import { join } from 'node:path';

/**
 * ファイルパスを構築する
 * @param segments パスセグメントの配列
 * @returns 構築されたファイルパス
 */
export function buildFilePath(segments: string[]): string {
  return join(process.cwd(), ...segments);
}

/**
 * esbuildのバイナリパスを設定する
 * プラットフォームに応じて適切なパスを設定
 */
export function setupEsbuildBinary(): void {
  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'esbuild.exe'
    );
  } else {
    process.env.ESBUILD_BINARY_PATH = join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'bin',
      'esbuild'
    );
  }
}

// esbuildのバイナリパスを設定
setupEsbuildBinary();
