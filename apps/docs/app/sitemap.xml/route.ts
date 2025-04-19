import { getServerSideSitemap } from 'next-sitemap';

import appConfig from '~/config/app.config';

/**
 * @description The maximum age of the sitemap in seconds.
 * This is used to set the cache-control header for the sitemap. The cache-control header is used to control how long the sitemap is cached.
 * By default, the cache-control header is set to 'public, max-age=600, s-maxage=3600'.
 * This means that the sitemap will be cached for 600 seconds (10 minutes) and will be considered stale after 3600 seconds (1 hour).
 */
const MAX_AGE = 60;
const S_MAX_AGE = 3600;

/**
 * デフォルトのサイトURL（バックアップとして使用）
 * Vercel環境でURLバリデーションが失敗した場合のフォールバック
 */
const DEFAULT_SITE_URL = 'https://docs.saedgewell.net';

/**
 * サイトマップエントリの型定義
 */
interface SitemapEntry {
  loc: string;
  lastmod: string;
}

/**
 * GETリクエストハンドラー - サイトマップXMLを生成
 */
export async function GET() {
  try {
    // Vercel環境を検出
    const isVercel = process.env.VERCEL === '1';

    if (isVercel) {
      console.log(
        'サイトマップ: Vercel環境で実行中 - 強制的にデフォルトURLを使用'
      );
    }

    const paths = getPaths();
    const headers = {
      'Cache-Control': `public, max-age=${MAX_AGE}, s-maxage=${S_MAX_AGE}`,
    };
    return getServerSideSitemap([...paths], headers);
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // エラーが発生した場合は最小限のサイトマップを生成
    const minimalPaths = [
      {
        loc: DEFAULT_SITE_URL,
        lastmod: new Date().toISOString(),
      },
    ];

    const headers = {
      'Cache-Control': `public, max-age=${MAX_AGE}, s-maxage=${S_MAX_AGE}`,
    };

    try {
      return getServerSideSitemap(minimalPaths, headers);
    } catch (fallbackError) {
      // 最終手段：プレーンテキストで応答
      return new Response('Error generating sitemap', { status: 500 });
    }
  }
}

/**
 * サイトマップに含めるパスの生成
 */
function getPaths(): SitemapEntry[] {
  const paths = [
    '/',
    '/faq',
    '/cookie-policy',
    '/terms-of-service',
    '/privacy-policy',
    // add more paths here
  ];

  // 安全なベースURLの取得
  const baseUrl = getSafeBaseUrl();
  console.log(`サイトマップ: ベースURL=${baseUrl} を使用`);

  return paths.map((path) => {
    return createSitemapEntry(path, baseUrl);
  });
}

/**
 * 安全なベースURLを取得
 * アプリ設定、環境変数、デフォルト値の順で試行
 */
function getSafeBaseUrl(): string {
  // Vercel環境を検出
  const isVercel = process.env.VERCEL === '1';

  // Vercelでは常にデフォルトURLを使用
  if (isVercel) {
    console.log('サイトマップ: Vercel環境検出 - デフォルトURLを使用');
    return DEFAULT_SITE_URL;
  }

  try {
    console.log(`サイトマップ: appConfig.url=${appConfig.url}`);

    // appConfig.urlが有効なURLであることを確認
    if (typeof appConfig.url === 'string' && isValidUrl(appConfig.url)) {
      return appConfig.url;
    }

    // 次に環境変数を試す
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    console.log(`サイトマップ: NEXT_PUBLIC_SITE_URL=${envUrl}`);

    if (typeof envUrl === 'string' && isValidUrl(envUrl)) {
      return envUrl;
    }

    // 最後にデフォルト値を使用
    console.log(`サイトマップ: デフォルトURLを使用=${DEFAULT_SITE_URL}`);
    return DEFAULT_SITE_URL;
  } catch (error) {
    console.warn('Error getting base URL:', error);
    return DEFAULT_SITE_URL;
  }
}

/**
 * 文字列が有効なURLかどうかを確認
 */
function isValidUrl(url: string): boolean {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch (error) {
    console.warn(`サイトマップ: 無効なURL: ${url}`);
    return false;
  }
}

/**
 * サイトマップエントリを作成
 */
function createSitemapEntry(path: string, baseUrl: string): SitemapEntry {
  try {
    // URLオブジェクトを使用して正規化
    return {
      loc: new URL(path, baseUrl).href,
      lastmod: new Date().toISOString(),
    };
  } catch (error) {
    // URLの生成に失敗した場合は、文字列連結で代替
    console.warn(`Invalid URL generation for path: ${path}. Using fallback.`);
    const normalizedBaseUrl = baseUrl.endsWith('/')
      ? baseUrl.slice(0, -1)
      : baseUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return {
      loc: `${normalizedBaseUrl}${normalizedPath}`,
      lastmod: new Date().toISOString(),
    };
  }
}
