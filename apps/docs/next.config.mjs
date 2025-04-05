import { fileURLToPath } from 'node:url';
import createNextIntlPlugin from 'next-intl/plugin';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// 正しいnext-intlプラグイン設定
// https://next-intl-docs.vercel.app/docs/getting-started/app-router
const withNextIntlPlugin = createNextIntlPlugin();

// Next.jsの環境変数を出力（デバッグ用）
console.log('====== DOCS APP NEXT.CONFIG.MJS DEBUG ======');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('AUTH_COOKIE_DOMAIN:', process.env.AUTH_COOKIE_DOMAIN);
console.log('COOKIE_DOMAIN:', process.env.COOKIE_DOMAIN);
console.log(
  'SUPABASE_AUTH_COOKIE_SECURE:',
  process.env.SUPABASE_AUTH_COOKIE_SECURE
);
console.log(
  'SUPABASE_AUTH_COOKIE_SAME_SITE:',
  process.env.SUPABASE_AUTH_COOKIE_SAME_SITE
);
console.log('=============================================');

// Vercel環境を検出
const isVercel = process.env.VERCEL === '1';

// クッキー設定
const cookiePrefix = '__Host-';
const cookieSecure = true;
const cookieSameSite = 'lax';

// @ts-ignore - Next.jsの型チェックを一時的に無視
const nextConfig = {
  output: 'standalone', // サーバーレス関数のサイズを削減
  reactStrictMode: true,
  // 本番環境では圧縮を有効化（サイズ削減）
  compress: process.env.NODE_ENV === 'production',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.gyazo.com',
      },
      {
        protocol: 'https',
        hostname: 'github.githubassets.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
    // 画像を最適化（本番環境でのみ）
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  experimental: {
    // レンダリングエンジンの最適化
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    // コンパイラの最適化オプション
    serverMinification: true,
    serverSourceMaps: false,
    // トラブルシューティング用のオプション
    mdxRs: true,
  },
  // キャッシュを最適化
  outputFileTracingExcludes: {
    // 不要なファイルを除外して出力サイズを削減
    '*': [
      '.git/**',
      '.github/**',
      '**/node_modules/@swc/core-linux-x64-gnu',
      '**/node_modules/@swc/core-linux-x64-musl',
      '**/node_modules/@esbuild/linux-x64',
      'node_modules/typescript/**',
    ],
  },
  // サイズ最適化のためのサーバーレス関数の分割設定
  serverExternalPackages: [
    '@mdx-js/react',
    '@mdx-js/mdx',
    'remark-gfm',
    'rehype-highlight',
    'rehype-slug',
    'rehype-autolink-headings',
    'remark-unwrap-images',
    'unified',
    'i18next',
  ],
  compiler: {
    // 本番環境では不要なコンソールログを削除
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn', 'debug', 'log'],
          }
        : false,
  },
  // セキュリティヘッダーの設定
  async headers() {
    return [
      {
        // すべてのパスに適用
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; frame-src 'self'; connect-src 'self' https://*.supabase.co; img-src 'self' data: blob: https://*.githubusercontent.com https://i.gyazo.com https://github.githubassets.com",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // .mdxファイルとしてのマークダウン処理の設定
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // ビルドキャッシュを有効化
  poweredByHeader: false, // 不要なヘッダーを削除
};

// @ts-ignore - Next.js設定の型チェックを無視
export default withNextIntlPlugin(nextConfig);
