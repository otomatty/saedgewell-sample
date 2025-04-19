'use server';

import {
  cacheManager,
  getCacheConfig as getConfig,
  devConfig,
} from '../../lib/mdx/cache-manager';
import type { CacheConfig, PerformanceMetrics } from '../../types/mdx';

/**
 * キャッシュ設定を取得するサーバーアクション
 * @returns キャッシュ設定
 */
export async function getCacheConfig(): Promise<CacheConfig> {
  return getConfig();
}

/**
 * キャッシュからデータを取得するサーバーアクション
 * @param key キャッシュキー
 * @returns キャッシュされた値またはnull
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  return cacheManager.get(key) as Promise<T | null>;
}

/**
 * キャッシュにデータを設定するサーバーアクション
 * @param key キャッシュキー
 * @param value キャッシュする値
 */
export async function setToCache<T>(key: string, value: T): Promise<void> {
  await cacheManager.set(key, value);
}

/**
 * キャッシュのメトリクスを取得するサーバーアクション
 * @returns キャッシュメトリクス
 */
export async function getCacheMetrics(): Promise<PerformanceMetrics> {
  return cacheManager.getMetrics();
}

/**
 * キャッシュをクリアするサーバーアクション
 */
export async function clearCache(): Promise<void> {
  cacheManager.clear();
}

// サーバーアクションで使用するために開発環境設定をエクスポート
export { devConfig };
