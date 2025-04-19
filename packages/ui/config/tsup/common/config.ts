import type { Options } from 'tsup';

/**
 * すべての設定で共通して使用する外部依存関係
 */
export const commonExternalDependencies = [
  'react',
  'react-dom',
  'next',
  '@radix-ui/*',
  'tailwindcss',
  'clsx',
  'lucide-react',
  '@hookform/resolvers',
  'cmdk',
  'input-otp',
  'react-day-picker',
  'react-top-loading-bar',
  'recharts',
  'tailwind-merge',
  'class-variance-authority',
  'next-themes',
  'react-hook-form',
  'react-i18next',
  'sonner',
  'zod',
];

/**
 * すべての設定で共通して使用するtsupの基本設定
 */
export const commonTsupConfig: Partial<Options> = {
  format: ['esm' as const, 'cjs' as const],
  dts: false, // 型定義ビルドを無効化（別プロセスで生成）
  treeshake: true,
  sourcemap: false, // ソースマップを無効化
  outDir: 'dist',
  splitting: true,
  bundle: true,
  minify: true,
  clean: false, // 初回ビルド時のエラーを回避するためfalseに設定
  esbuildOptions(options) {
    // パス解決の設定を追加
    options.resolveExtensions = ['.tsx', '.ts', '.jsx', '.js'];
    options.mainFields = ['module', 'main'];
  },
};

/**
 * 型定義生成用の共通設定
 */
export const commonDtsConfig: Partial<Options> = {
  dts: {
    // 型定義生成の最適化オプション
    resolve: true, // 依存関係の型を解決
    compilerOptions: {
      skipLibCheck: true, // ライブラリのチェックをスキップ
      emitDeclarationOnly: true, // 宣言ファイルのみ出力
    },
  },
  format: [], // 出力形式なし
  outDir: 'dist',
  clean: false, // 既存のビルド結果を保持
  external: commonExternalDependencies,
};
