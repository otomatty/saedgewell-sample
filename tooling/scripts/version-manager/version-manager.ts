import { execSync } from 'node:child_process';
import path from 'node:path';
import type {
  Dependencies,
  PackageJson,
  UpdateConfig,
  VersionMismatch,
  UndefinedPackage,
  VersionCheckResult,
} from './types';
import { FileService } from './services/file-service';
import { VersionService } from './services/version-service';
import { SafetyService } from './services/safety-service';
import { PackageService } from './services/package-service';
import { CategorizeService } from './services/categorize-service';
import { PromptService } from './services/prompt-service';

export class VersionManager {
  private dependencies!: Dependencies;
  private updateConfig!: UpdateConfig;
  private fileService: FileService;
  private versionService: VersionService;
  private safetyService!: SafetyService;
  private packageService!: PackageService;
  private categorizeService!: CategorizeService;
  private promptService: PromptService;

  constructor(workspaceRoot: string) {
    this.fileService = new FileService(workspaceRoot);
    this.versionService = new VersionService();
    this.promptService = new PromptService();
  }

  async initialize() {
    this.dependencies = await this.fileService.readJson(
      'tooling/configs/dependencies.json'
    );
    this.updateConfig = await this.fileService.readJson(
      'tooling/configs/update-config.json'
    );
    this.safetyService = new SafetyService(this.updateConfig);
    this.packageService = new PackageService();
    this.categorizeService = new CategorizeService(this.updateConfig);
  }

  async checkVersionMismatches(): Promise<VersionCheckResult> {
    const mismatches: VersionMismatch[] = [];
    const undefinedPackages: UndefinedPackage[] = [];
    const workspaces = await this.fileService.getWorkspaces();
    let hasNewerVersions = false;

    // node_modulesを含むパスを除外する関数
    const shouldSkipWorkspace = (workspace: string) => {
      return workspace.includes('node_modules');
    };

    // 未定義パッケージの検出
    for (const workspace of workspaces) {
      // node_modulesディレクトリは除外
      if (shouldSkipWorkspace(workspace)) {
        continue;
      }

      const pkg = await this.fileService.readJson<PackageJson>(
        path.join(workspace, 'package.json')
      );

      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      for (const [name, version] of Object.entries(allDeps)) {
        if (this.packageService.isInternalPackage(name)) {
          continue;
        }

        let isDefined = false;
        for (const versions of Object.values(this.dependencies)) {
          if (name in versions) {
            isDefined = true;
            break;
          }
        }
        if (!isDefined) {
          undefinedPackages.push({
            name,
            version,
            location: workspace,
          });
        }
      }
    }

    // 未定義パッケージがある場合、ユーザーに確認
    if (undefinedPackages.length > 0) {
      const consolidatedPackages =
        await this.packageService.consolidatePackages(undefinedPackages);
      const categorizedPackages =
        this.categorizeService.categorizePackages(consolidatedPackages);
      const sortedCategories =
        this.categorizeService.getSortedCategories(categorizedPackages);

      const shouldAdd =
        await this.promptService.promptForPackageAddition(sortedCategories);
      if (!shouldAdd) {
        return {
          mismatches: [],
          hasNewerVersions: false,
          undefinedPackages: consolidatedPackages,
        };
      }

      // 設定ファイルに追加
      const newDependencies = { ...this.dependencies };
      for (const [category, packages] of Object.entries(categorizedPackages)) {
        if (!newDependencies[category]) {
          newDependencies[category] = {};
        }
        for (const pkg of packages) {
          newDependencies[category][pkg.name] = pkg.version;
        }
      }

      await this.fileService.writeJson(
        'tooling/configs/dependencies.json',
        newDependencies
      );

      // 設定が更新されたので、依存関係を再読み込み
      await this.initialize();
    }

    // バージョンの不一致をチェック
    for (const workspace of workspaces) {
      // node_modulesディレクトリは除外
      if (shouldSkipWorkspace(workspace)) {
        continue;
      }

      const pkg = await this.fileService.readJson<PackageJson>(
        path.join(workspace, 'package.json')
      );

      for (const [category, versions] of Object.entries(this.dependencies)) {
        for (const [dep, version] of Object.entries(versions)) {
          if (pkg.dependencies?.[dep] && pkg.dependencies[dep] !== version) {
            const isNewer =
              this.versionService.compareVersions(
                pkg.dependencies[dep],
                version
              ) > 0;
            if (isNewer) hasNewerVersions = true;

            mismatches.push({
              workspace,
              package: dep,
              expected: version,
              actual: pkg.dependencies[dep],
              isNewer,
            });
          }
          if (
            pkg.devDependencies?.[dep] &&
            pkg.devDependencies[dep] !== version
          ) {
            const isNewer =
              this.versionService.compareVersions(
                pkg.devDependencies[dep],
                version
              ) > 0;
            if (isNewer) hasNewerVersions = true;

            mismatches.push({
              workspace,
              package: dep,
              expected: version,
              actual: pkg.devDependencies[dep],
              isNewer,
            });
          }
        }
      }
    }

    return { mismatches, hasNewerVersions, undefinedPackages: [] };
  }

  async updateVersions(groupName?: string, selectedPackages?: string[]) {
    try {
      if (this.updateConfig.safetyChecks?.backupBeforeUpdate) {
        await this.fileService.createBackup(this.dependencies);
      }

      const updates: Record<string, string> = {};
      let packagesToUpdate: string[] = [];

      // パッケージリストの取得
      if (selectedPackages) {
        packagesToUpdate = selectedPackages;
      } else if (groupName) {
        const group = this.updateConfig.updateGroups[groupName];
        if (!group) {
          throw new Error(`Update group "${groupName}" not found`);
        }
        packagesToUpdate = group.packages;
      } else {
        // 全パッケージの場合
        for (const category of Object.values(this.dependencies)) {
          packagesToUpdate.push(...Object.keys(category));
        }
      }

      const totalPackages = packagesToUpdate.length;
      // 最新バージョン情報の収集と表示
      console.log('\n📦 パッケージの更新確認を開始します：');
      const updateConfirmations: Record<string, boolean> = {};

      for (let i = 0; i < packagesToUpdate.length; i++) {
        const pkg = packagesToUpdate[i];
        if (!pkg) continue; // パッケージ名が undefined の場合はスキップ

        try {
          console.log(`\n${pkg} (${i + 1}/${totalPackages}):`);
          const currentVersion = this.getCurrentVersion(pkg);
          const latestVersion = await this.versionService.getLatestVersion(pkg);
          if (!latestVersion) {
            console.error(
              `  ⚠️ ${pkg} の最新バージョン情報の取得に失敗しました`
            );
            continue;
          }

          const versions = await this.versionService.getAvailableVersions(pkg);
          const releaseDate = versions.find(
            (v) => v.version === latestVersion
          )?.releaseDate;

          console.log(`  現在のバージョン: ${currentVersion}`);
          console.log(`  最新のバージョン: ${latestVersion}`);

          // 現在のバージョンと最新バージョンを比較
          if (
            this.versionService.compareVersions(
              currentVersion,
              latestVersion
            ) === 0
          ) {
            console.log('  ✨ 最新のバージョンです');
            continue;
          }

          if (releaseDate) {
            console.log(`  リリース日: ${releaseDate.toLocaleDateString()}`);
          }

          const shouldUpdate = await this.promptService.confirm(
            `  ${pkg} を ${currentVersion} から ${latestVersion} に更新しますか？`
          );

          if (shouldUpdate) {
            updates[pkg] = latestVersion;
            updateConfirmations[pkg] = true;
            console.log('  ✅ 更新が確認されました');
          } else {
            console.log('  ⏭️  更新をスキップしました');
          }
        } catch (error) {
          console.error(
            `  ⚠️ ${pkg} の最新バージョン情報の取得に失敗しました:`,
            error
          );
        }
      }

      // 更新するパッケージがない場合は終了
      if (Object.keys(updates).length === 0) {
        return {
          success: true,
          updates: {},
          message: '\n📝 更新するパッケージがありません。',
        };
      }

      const packagesToUpdateCount = Object.keys(updates).length;
      console.log(
        `\n🔄 パッケージの更新を開始します... (全${packagesToUpdateCount}個)`
      );

      // 確認された更新の実行
      const newDependencies = await this.packageService.applyUpdates(
        this.dependencies,
        updates
      );
      await this.fileService.writeJson(
        'tooling/configs/dependencies.json',
        newDependencies
      );

      let updatedCount = 0;
      const workspaces = await this.fileService.getWorkspaces();
      for (const workspace of workspaces) {
        const pkgPath = path.join(workspace, 'package.json');
        const pkg = await this.fileService.readJson<PackageJson>(pkgPath);
        const { pkg: updatedPkg, updated } =
          this.packageService.updatePackageJson(pkg, updates);

        if (updated) {
          await this.fileService.writeJson(pkgPath, updatedPkg);
          updatedCount++;
          console.log(
            `  📦 package.json を更新中... (${updatedCount}/${workspaces.length})`
          );
        }
      }

      console.log('  🔄 依存関係をインストール中...');
      execSync('bun install', { stdio: 'inherit' });

      if (!(await this.safetyService.runSafetyChecks())) {
        await this.fileService.rollback();
        throw new Error('Safety checks failed');
      }

      console.log('\n✨ パッケージの更新が完了しました！');
      console.log('\n📦 更新されたパッケージ:');
      for (const [pkg, version] of Object.entries(updates)) {
        console.log(`  ・${pkg}: ${version}`);
      }

      return { success: true, updates };
    } catch (error) {
      await this.fileService.rollback();
      return { success: false, error };
    }
  }

  private getCurrentVersion(packageName: string): string {
    for (const category of Object.values(this.dependencies)) {
      const version = category[packageName];
      if (version) {
        return version;
      }
    }
    throw new Error(`Package ${packageName} not found in dependencies`);
  }

  async selectPackagesForUpdate(
    mismatches: VersionMismatch[]
  ): Promise<string[]> {
    return this.versionService.selectPackagesForUpdate(mismatches);
  }
}
