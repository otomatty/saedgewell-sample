import { join } from 'node:path';
import { existsSync } from 'node:fs';

/**
 * ドキュメントのルートディレクトリパス
 * プロジェクトルートからの相対パス
 */
export const DOC_ROOT_DIR = '.docs';

/**
 * プロジェクトルートのパスを動的に特定する
 * モノレポや異なる環境（開発/本番）でも動作するよう調整
 */
function findProjectRoot(): string {
  // Docker環境チェック
  if (process.env.DOCKER_DEBUG) {
    return '/app';
  }

  // 現在の作業ディレクトリ
  const currentDir = process.cwd();

  // 1. ローカル開発環境 - モノレポのルートディレクトリ
  // currentDirが「apps/docs」で終わる場合、2階層上に移動
  if (
    currentDir.endsWith('/apps/docs') ||
    currentDir.endsWith('\\apps\\docs')
  ) {
    return join(currentDir, '../..');
  }

  // 2. Vercelデプロイ環境 - プロジェクトルートは現在のディレクトリの2階層上
  const monorepoRoot = join(currentDir, '../..');
  if (existsSync(join(monorepoRoot, '.docs'))) {
    return monorepoRoot;
  }

  // 3. Vercelデプロイ環境 - プロジェクトルートが現在のディレクトリの3階層上
  const alternativeRoot = join(currentDir, '../../..');
  if (existsSync(join(alternativeRoot, '.docs'))) {
    return alternativeRoot;
  }

  // 4. Vercel環境 - .docsディレクトリが存在しない場合、ビルド時に.docsをコピーする必要がある
  // そのため、現在のディレクトリに.docsがあるかチェック
  if (existsSync(join(currentDir, '.docs'))) {
    return currentDir;
  }

  // 5. フォールバック - 環境変数で設定されたパスまたはデフォルト値
  return process.env.PROJECT_ROOT || '/Users/sugaiakimasa/apps/saedgewell';
}

/**
 * プロジェクトルートのパス
 * 現在の環境での絶対パス
 */
export const PROJECT_ROOT = findProjectRoot();

/**
 * ドキュメントのルートディレクトリの絶対パスを取得
 * @returns ドキュメントルートディレクトリの絶対パス
 */
export function getDocRootPath(): string {
  // パスを取得して、コンソールにデバッグ出力
  const path = join(PROJECT_ROOT, DOC_ROOT_DIR);
  console.log(
    `[DEBUG] getDocRootPath() = ${path} (PROJECT_ROOT=${PROJECT_ROOT})`
  );
  return path;
}

/**
 * コンテンツパスを取得する
 * @param paths パスセグメント
 * @returns 結合されたパス
 */
export function getContentPath(...paths: string[]): string {
  return join(getDocRootPath(), ...paths);
}
