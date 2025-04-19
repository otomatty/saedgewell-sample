/**
 * 画像URLキャッシュモジュール
 * OGP画像URLなどをキャッシュするための機能を提供します
 */
import { cacheManager, prodConfig } from '~/lib/mdx/cache-manager';
import { createHash } from 'node:crypto';

// キャッシュマネージャーのインスタンスを使用
const imageUrlCache = cacheManager as {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
};

/**
 * URLのハッシュ値を生成する
 * @param url URL
 * @returns ハッシュ値
 */
function generateCacheKey(url: string): string {
  return createHash('md5').update(url).digest('hex');
}

/**
 * OGP画像URLをキャッシュから取得する
 * キャッシュにない場合はnullを返す
 * @param url 元のURL
 * @returns キャッシュされたOGP画像URL、またはnull
 */
export async function getCachedOgImageUrl(url: string): Promise<string | null> {
  const cacheKey = `og-image:${generateCacheKey(url)}`;
  return imageUrlCache.get(cacheKey);
}

/**
 * OGP画像URLをキャッシュに保存する
 * @param originalUrl 元のURL
 * @param ogImageUrl OGP画像URL
 */
export async function cacheOgImageUrl(
  originalUrl: string,
  ogImageUrl: string
): Promise<void> {
  const cacheKey = `og-image:${generateCacheKey(originalUrl)}`;
  await imageUrlCache.set(cacheKey, ogImageUrl);
}

/**
 * 最適化された画像URLをキャッシュから取得する
 * キャッシュにない場合はnullを返す
 * @param url 元のURL
 * @returns キャッシュされた最適化画像URL、またはnull
 */
export async function getCachedOptimizedImageUrl(
  url: string
): Promise<string | null> {
  const cacheKey = `optimized-image:${generateCacheKey(url)}`;
  return imageUrlCache.get(cacheKey);
}

/**
 * 最適化された画像URLをキャッシュに保存する
 * @param originalUrl 元のURL
 * @param optimizedUrl 最適化された画像URL
 */
export async function cacheOptimizedImageUrl(
  originalUrl: string,
  optimizedUrl: string
): Promise<void> {
  const cacheKey = `optimized-image:${generateCacheKey(originalUrl)}`;
  await imageUrlCache.set(cacheKey, optimizedUrl);
}
