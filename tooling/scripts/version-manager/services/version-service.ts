import { execAsync } from '../utils/async';
import type {
  VersionMismatch,
  PackageVersion,
  VersionPolicy,
  VersionSelectionOptions,
} from '../types';
import semver from 'semver';
import { execSync } from 'node:child_process';

export class VersionService {
  private readonly defaultPolicy: VersionPolicy = {
    stability: {
      major: {
        freeze: true,
        minStabilityDays: 30,
      },
      minor: {
        maxVersionJump: 1,
        minStabilityDays: 14,
      },
      patch: {
        autoUpdate: true,
        minStabilityDays: 7,
      },
    },
  };

  compareVersions(version1: string, version2: string): number {
    const v1 = version1.replace(/^\^|~/, '').split('.');
    const v2 = version2.replace(/^\^|~/, '').split('.');

    for (let i = 0; i < 3; i++) {
      const num1 = Number.parseInt(v1[i] || '0', 10);
      const num2 = Number.parseInt(v2[i] || '0', 10);
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    return 0;
  }

  async getLatestVersion(packageName: string): Promise<string> {
    try {
      const result = await execAsync(`npm view ${packageName} version`);
      if (!result?.stdout) {
        throw new Error(`Could not find latest version for ${packageName}`);
      }
      const latestVersion = result.stdout.trim();
      if (!latestVersion) {
        throw new Error(`Could not find latest version for ${packageName}`);
      }
      return latestVersion;
    } catch (error) {
      console.error(`Error getting latest version for ${packageName}:`, error);
      throw error;
    }
  }

  async selectPackagesForUpdate(
    mismatches: VersionMismatch[]
  ): Promise<string[]> {
    const uniquePackages = [...new Set(mismatches.map((m) => m.package))];
    const choices = uniquePackages.map((pkg) => {
      const mismatch = mismatches.find((m) => m.package === pkg);
      return {
        name: pkg,
        value: pkg,
        checked: mismatch?.isNewer || false,
        description: mismatch
          ? `${mismatch.expected} → ${mismatch.actual}`
          : undefined,
      };
    });

    console.log(
      '\n📋 更新するパッケージを選択してください（スペース区切りで番号を入力）：'
    );
    choices.forEach((choice, index) => {
      console.log(
        `${index + 1}. ${choice.name} ${choice.description ? `(${choice.description})` : ''} ${choice.checked ? '[🔄 更新推奨]' : ''}`
      );
    });

    const response = await new Promise<string>((resolve) => {
      const stdin = process.stdin;
      const stdout = process.stdout;

      stdout.write('🔍 選択してください：');
      stdin.resume();
      stdin.setEncoding('utf8');

      stdin.once('data', (data) => {
        stdin.pause();
        resolve(data.toString().trim());
      });
    });

    const selectedIndices = response
      .split(/\s+/)
      .map((n) => Number.parseInt(n, 10) - 1);
    return selectedIndices
      .filter((i) => i >= 0 && i < choices.length)
      .map((i) => {
        const choice = choices[i];
        if (!choice) {
          throw new Error(`無効な選択肢です：${i}`);
        }
        return choice.value;
      });
  }

  /**
   * npmレジストリから利用可能なバージョン情報を取得
   */
  async getAvailableVersions(packageName: string): Promise<PackageVersion[]> {
    try {
      const output = execSync(`npm view ${packageName} versions time --json`, {
        encoding: 'utf-8',
      });
      const data = JSON.parse(output);

      return Object.entries(data).map(([version, time]) => ({
        version,
        releaseDate: new Date(time as string),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '不明なエラー';
      throw new Error(`バージョン情報の取得に失敗しました: ${errorMessage}`);
    }
  }

  /**
   * 安定版のバージョンのみをフィルタリング
   */
  private filterStableVersions(versions: PackageVersion[]): PackageVersion[] {
    return versions.filter(({ version }) => {
      // 実験的バージョンは除外しない
      if (version.includes('experimental')) {
        return true;
      }
      return (
        !version.includes('-') &&
        !version.includes('alpha') &&
        !version.includes('beta') &&
        !version.includes('rc')
      );
    });
  }

  /**
   * リリースからの経過日数をチェック
   */
  private checkVersionStability(
    version: PackageVersion,
    minStabilityDays: number
  ): boolean {
    const daysSinceRelease =
      (Date.now() - version.releaseDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceRelease >= minStabilityDays;
  }

  /**
   * バージョンの互換性をチェック
   */
  private checkVersionCompatibility(
    version: string,
    dependencies: Record<string, string>,
    peerDependencies?: Record<string, string>
  ): boolean {
    // 依存関係のチェック
    for (const [dep, range] of Object.entries(dependencies)) {
      if (!semver.satisfies(version, range)) {
        return false;
      }
    }

    // peerDependenciesのチェック
    if (peerDependencies) {
      for (const [peer, range] of Object.entries(peerDependencies)) {
        if (!semver.satisfies(version, range)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * 最適なバージョンを選択
   */
  async selectAppropriateVersion(
    packageName: string,
    options: VersionSelectionOptions
  ): Promise<string> {
    const {
      currentVersion,
      policy = this.defaultPolicy,
      dependencies,
      peerDependencies,
    } = options;

    // 利用可能なバージョンを取得
    const versions = await this.getAvailableVersions(packageName);
    const stableVersions = this.filterStableVersions(versions);

    // 現在のバージョンのメジャー番号を取得
    const currentMajor = semver.major(currentVersion);

    // ポリシーに基づいてフィルタリング
    const compatibleVersions = stableVersions.filter((v) => {
      const version = v.version;

      // メジャーバージョンのチェック
      if (
        policy.stability.major.freeze &&
        semver.major(version) !== currentMajor
      ) {
        return false;
      }

      // 安定性のチェック
      const isStable = this.checkVersionStability(
        v,
        policy.stability.major.minStabilityDays
      );
      if (!isStable) return false;

      // 互換性のチェック
      return this.checkVersionCompatibility(
        version,
        dependencies,
        peerDependencies
      );
    });

    if (compatibleVersions.length === 0) {
      throw new Error('互換性のあるバージョンが見つかりませんでした');
    }

    // 最新のバージョンを返す
    const latestVersion = compatibleVersions[compatibleVersions.length - 1];
    if (!latestVersion) {
      throw new Error('バージョンの取得に失敗しました');
    }
    return latestVersion.version;
  }

  /**
   * ワイルドカードバージョンを解決
   */
  async resolveWildcardVersion(
    packageName: string,
    wildcard: string,
    dependencies: Record<string, string>,
    peerDependencies?: Record<string, string>
  ): Promise<string> {
    try {
      let currentMajor = '*';

      // ワイルドカードパターンを解析
      if (wildcard.startsWith('^')) {
        currentMajor = wildcard.substring(1).split('.')[0] ?? '0';
      } else if (wildcard !== '*') {
        currentMajor = wildcard.split('.')[0] ?? '0';
      }

      const version = await this.selectAppropriateVersion(packageName, {
        currentVersion: currentMajor === '*' ? '0.0.0' : `${currentMajor}.0.0`,
        policy: this.defaultPolicy,
        dependencies,
        peerDependencies,
      });

      return version;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '不明なエラー';
      throw new Error(
        `ワイルドカードバージョンの解決に失敗しました: ${errorMessage}`
      );
    }
  }
}
