import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/clients/server-client.ts',
    'src/clients/server-admin-client.ts',
    'src/clients/middleware-client.ts',
    'src/clients/browser-client.ts',
    'src/check-requires-mfa.ts',
    'src/require-user.ts',
    'src/hooks/index.ts',
    'src/database.types.ts',
    'src/auth.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['@supabase/supabase-js', 'next', 'react'],
  treeshake: true,
  sourcemap: true,
  // hooksディレクトリのファイルをすべて含める
  outDir: 'dist',
  splitting: true,
  bundle: true,
});
