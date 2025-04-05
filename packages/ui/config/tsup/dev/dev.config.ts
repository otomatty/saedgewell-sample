import type { Options } from 'tsup';
import { commonExternalDependencies } from '../common/config';

/**
 * 開発用の共通設定
 * - ビルド速度の最適化
 * - デバッグのしやすさ
 * - リソース管理
 */
export const commonDevConfig: Partial<Options> = {
  format: ['esm'], // 開発時はESMのみで十分
  dts: false, // 型定義は別プロセスで生成
  treeshake: false, // 開発時は無効化して速度優先
  sourcemap: true, // デバッグ用にソースマップを有効化
  minify: false, // 開発時は無効化
  clean: false, // 既存ビルドを保持
  watch: true, // ファイル変更の監視を有効化
  splitting: false, // 開発時は無効化して速度優先
  external: commonExternalDependencies,
  outDir: 'dist/dev', // 開発用の出力ディレクトリを分離
  onSuccess: async () => {
    console.log('Build successful, watching for changes...');
  },
};
