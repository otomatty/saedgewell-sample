import type { Dependencies, PackageJson, UndefinedPackage } from '../types';
import { VersionService } from './version-service';
import { execAsync } from '../utils/async';

export class PackageService {
  private versionService: VersionService;

  constructor() {
    this.versionService = new VersionService();
  }

  isInternalPackage(name: string): boolean {
    // 内部パッケージの判定
    if (name.startsWith('@kit/')) {
      return true;
    }

    // Vercelの開発用パッケージの判定
    const vercelDevPackages = [
      '@vercel/turbopack-ecmascript-runtime',
      // 他のVercel開発用パッケージがあれば追加
    ];

    if (vercelDevPackages.includes(name)) {
      console.log(
        `
ℹ️ Vercel開発用パッケージを検出:
パッケージ名: ${name}
注意: このパッケージはVercelの開発用パッケージとして扱われ、バージョン管理から除外されます。
      `.trim()
      );
      return true;
    }

    return false;
  }

  async consolidatePackages(
    packages: UndefinedPackage[]
  ): Promise<UndefinedPackage[]> {
    const packageMap = new Map<string, UndefinedPackage>();

    for (const pkg of packages) {
      // デバッグ情報を出力
      if (pkg.version.includes('experimental')) {
        console.log(
          `
📦 実験的バージョンのパッケージ情報:
パッケージ名: ${pkg.name}
バージョン: ${pkg.version}
場所: ${pkg.location}
        `.trim()
        );
      }

      const existing = packageMap.get(pkg.name);
      if (!existing) {
        packageMap.set(pkg.name, {
          ...pkg,
          version: await this.normalizeToFixedVersion(pkg.version, pkg.name),
        });
        continue;
      }

      // バージョンを比較し、より新しい方を保持
      const normalizedExistingVersion = await this.normalizeToFixedVersion(
        existing.version,
        pkg.name
      );
      const normalizedNewVersion = await this.normalizeToFixedVersion(
        pkg.version,
        pkg.name
      );

      if (
        this.versionService.compareVersions(
          normalizedNewVersion,
          normalizedExistingVersion
        ) > 0
      ) {
        // 新しいバージョンの場合は、locationを追加
        packageMap.set(pkg.name, {
          ...pkg,
          version: normalizedNewVersion,
          location: this.mergeLocations(existing.location, pkg.location),
        });
      } else if (
        this.versionService.compareVersions(
          normalizedNewVersion,
          normalizedExistingVersion
        ) === 0
      ) {
        // 同じバージョンの場合は、locationのみ追加
        packageMap.set(pkg.name, {
          ...existing,
          location: this.mergeLocations(existing.location, pkg.location),
        });
      }
    }

    return Array.from(packageMap.values());
  }

  private normalizeVersion(version: string): string {
    return version.replace(/^[\^~]/, '');
  }

  private async normalizeToFixedVersion(
    version: string,
    packageName?: string
  ): Promise<string> {
    const normalized = this.normalizeVersion(version);

    // 実験的バージョンの処理
    if (normalized.includes('experimental')) {
      // Next.jsの実験的パッケージの場合は警告を表示
      if (
        packageName === 'scheduler' ||
        packageName?.startsWith('@next') ||
        packageName === 'next'
      ) {
        console.log(
          `
⚠️ Next.js実験的パッケージを検出:
パッケージ名: ${packageName}
バージョン: ${normalized}
注意: このパッケージは Next.js の実験的機能の一部として使用されています。
      `.trim()
        );
        return normalized;
      }

      // その他の実験的パッケージの場合は警告を表示
      console.warn(
        `
🚨 実験的バージョンのパッケージを検出:
パッケージ名: ${packageName}
バージョン: ${normalized}
警告: 実験的バージョンは不安定な可能性があります。
推奨: 安定版の使用を検討してください。
      `.trim()
      );
      return normalized;
    }

    if (/[xX*]/.test(normalized)) {
      if (!packageName) {
        throw new Error(
          `
バージョン形式が無効です：${version}
理由：パッケージ名が指定されていません
推奨：パッケージ名を指定してください
        `.trim()
        );
      }

      try {
        // 依存関係を取得
        const dependencies = await this.getDependencyTree(packageName);
        const peerDependencies = await this.getPeerDependencies(packageName);

        // ワイルドカードバージョンを解決
        const resolvedVersion =
          await this.versionService.resolveWildcardVersion(
            packageName,
            normalized,
            dependencies,
            peerDependencies
          );

        return resolvedVersion;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '不明なエラー';
        throw new Error(
          `
バージョン解決に失敗しました：
パッケージ：${packageName}
現在のバージョン：${version}
理由：${errorMessage}
推奨：手動でバージョンを指定するか、package.jsonを確認してください
        `.trim()
        );
      }
    }

    return normalized;
  }

  private async getDependencyTree(
    packageName: string
  ): Promise<Record<string, string>> {
    try {
      const { stdout } = await execAsync(
        `npm view ${packageName} dependencies --json`
      );
      return JSON.parse(stdout) || {};
    } catch {
      return {};
    }
  }

  private async getPeerDependencies(
    packageName: string
  ): Promise<Record<string, string>> {
    try {
      const { stdout } = await execAsync(
        `npm view ${packageName} peerDependencies --json`
      );
      return JSON.parse(stdout) || {};
    } catch {
      return {};
    }
  }

  private mergeLocations(location1: string, location2: string): string {
    const locations = new Set(
      [location1, location2]
        .flatMap((loc) => loc.split(', '))
        .map((loc) => loc.trim())
    );
    return Array.from(locations).join(', ');
  }

  async applyUpdates(
    dependencies: Dependencies,
    updates: Record<string, string>
  ): Promise<Dependencies> {
    const newDependencies = { ...dependencies };
    for (const [category, packages] of Object.entries(newDependencies)) {
      for (const [pkg, _] of Object.entries(packages)) {
        if (updates[pkg]) {
          packages[pkg] = await this.normalizeToFixedVersion(updates[pkg], pkg);
        }
      }
    }
    return newDependencies;
  }

  updatePackageJson(
    pkg: PackageJson,
    updates: Record<string, string>
  ): {
    pkg: PackageJson;
    updated: boolean;
  } {
    let updated = false;
    const depTypes = ['dependencies', 'devDependencies'] as const;

    for (const depType of depTypes) {
      if (pkg[depType]) {
        for (const [name, version] of Object.entries(updates)) {
          if (pkg[depType]?.[name]) {
            pkg[depType][name] = version;
            updated = true;
          }
        }
      }
    }

    return { pkg, updated };
  }
}
