import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/i18n.server.ts',
    'src/i18n.client.ts',
    'src/i18n-provider.tsx',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'i18next', 'react-i18next', 'next'],
  treeshake: true,
  sourcemap: true,
  outDir: 'dist',
  splitting: true,
  bundle: true,
});
