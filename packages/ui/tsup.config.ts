import { defineConfig, type Format } from 'tsup';
import {
  shadcnEntries,
  makerkitEntries,
  magicuiEntries,
  customEntries,
  utilEntries,
} from './config/tsup/entries';

const baseConfig = {
  format: ['esm', 'cjs'] as Format[],
  dts: true,
  clean: true,
  external: [
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
  ],
  treeshake: true,
  sourcemap: true,
  outDir: 'dist',
  splitting: true,
  bundle: true,
  minify: true,
  workers: 2,
};

// エントリーポイントを分割してビルドする
export default defineConfig([
  {
    ...baseConfig,
    entry: shadcnEntries,
    clean: true, // 最初のビルドでのみtrueに設定
  },
  {
    ...baseConfig,
    entry: makerkitEntries,
    clean: false, // 後続のビルドではfalseに設定
  },
  {
    ...baseConfig,
    entry: magicuiEntries,
    clean: false,
  },
  {
    ...baseConfig,
    entry: customEntries,
    clean: false,
  },
  {
    ...baseConfig,
    entry: utilEntries,
    clean: false,
  },
]);
