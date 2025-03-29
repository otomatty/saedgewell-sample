/**
 * キャッシュ設定関連の型定義
 */

/**
 * キャッシュ設定
 */
export interface CacheConfig {
  /** ファイル変更の監視 */
  enableFileWatcher: boolean;
  /** 更新間隔（ミリ秒） */
  updateInterval: number;
  /** キャッシュの有効期限（ミリ秒） */
  ttl: number;
  /** キャッシュの最大サイズ */
  maxSize: number;
  /** ディスクへの永続化 */
  persistToDisk: boolean;
  /** キャッシュバージョン */
  version: string;
  /** キャッシュディレクトリのパス */
  cacheDir?: string;
}

/**
 * キャッシュエントリ
 */
export interface CacheEntry<T> {
  /** キャッシュデータ */
  value: T;
  /** 作成時刻 */
  created: number;
  /** 最終アクセス時刻 */
  lastAccessed: number;
  /** バージョン */
  version: string;
}
