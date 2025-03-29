import { defineConfig } from 'tsup';
import {
  shadcnEntries,
  makerkitEntries,
  magicuiEntries,
  utilEntries,
} from './config/tsup/entries';

// 外部依存関係を共通の変数として定義
const externalDependencies = [
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

// 型定義のみを生成する設定
export default defineConfig([
  {
    entry: shadcnEntries,
    dts: true, // 型定義のみを生成
    format: [], // 出力形式なし
    external: externalDependencies,
    outDir: 'dist',
    clean: false, // 既存のビルド結果を保持
  },
  {
    entry: makerkitEntries,
    dts: true,
    format: [],
    external: externalDependencies,
    outDir: 'dist',
    clean: false,
  },
  {
    entry: magicuiEntries,
    dts: true,
    format: [],
    external: externalDependencies,
    outDir: 'dist',
    clean: false,
  },
  {
    entry: utilEntries,
    dts: true,
    format: [],
    external: externalDependencies,
    outDir: 'dist',
    clean: false,
  },
]);
