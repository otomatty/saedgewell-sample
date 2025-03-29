import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/actions/index.ts', 'src/routes/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'next', 'zod', '@kit/auth', '@kit/supabase'],
  treeshake: true,
  sourcemap: true,
  // Vercelビルド用に型チェックを一時的に無効化
  noExternal: [],
  skipNodeModulesBundle: true,
  splitting: false,
  minify: false,
  legacyOutput: false,
  target: 'es2020',
  outDir: 'dist',
  // 型チェックを無効化
  ignoreWatch: ['node_modules', 'dist'],
});
