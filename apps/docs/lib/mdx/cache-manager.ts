import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type {
  CacheConfig,
  CacheEntry,
  PerformanceMetrics,
} from '../../types/mdx';
import { CacheError, errorReporter } from './errors';

/**
 * MDXキーワードリンク機能のキャッシュ設定
 */

/**
 * 開発環境の設定
 * - ファイル変更を監視
 * - 5分ごとに更新
 * - 10分でキャッシュ無効化
 */
export const devConfig: CacheConfig = {
  enableFileWatcher: true, // ファイル変更を監視
  updateInterval: 5 * 60_000, // 5分ごとに更新
  ttl: 10 * 60_000, // 10分でキャッシュ無効化
  maxSize: 1000,
  persistToDisk: true,
  version: '1.0.0',
};

/**
 * 本番環境の設定
 * - 監視無効
 * - 更新なし
 * - キャッシュ永続化
 */
export const prodConfig: CacheConfig = {
  enableFileWatcher: false, // 監視無効
  updateInterval: 0, // 更新なし
  ttl: 0, // 無期限
  maxSize: 5000,
  persistToDisk: true,
  version: '1.0.0',
};

/**
 * LRUキャッシュ
 * 最近使用されていないアイテムから削除するキャッシュ
 */
class LRUCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;
  private ttl: number;
  private metrics: PerformanceMetrics;

  constructor(config: CacheConfig) {
    this.cache = new Map();
    this.maxSize = config.maxSize || 1000;
    this.ttl = config.ttl || 0;
    this.metrics = {
      hits: 0,
      misses: 0,
      size: 0,
      memoryUsage: 0,
    };
  }

  /**
   * キャッシュからアイテムを取得
   * @param key キャッシュキー
   * @returns キャッシュされた値またはnull
   */
  async get(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      this.updateMetrics('miss');
      return null;
    }

    // TTLが設定されていて、エントリが期限切れの場合
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.updateMetrics('miss');
      return null;
    }

    // エントリを最新の状態に更新（LRU）
    this.cache.delete(key);
    this.cache.set(key, {
      ...entry,
      lastAccessed: Date.now(),
    });

    this.updateMetrics('hit');
    return entry.value;
  }

  /**
   * キャッシュにアイテムを設定
   * @param key キャッシュキー
   * @param value キャッシュする値
   * @param config キャッシュ設定
   */
  set(key: string, value: T, config: CacheConfig): void {
    // キャッシュが最大サイズに達した場合、最も古いエントリを削除
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const now = Date.now();
    this.cache.set(key, {
      value,
      created: now,
      lastAccessed: now,
      version: config.version || '1.0.0',
    });

    this.updateMemoryUsage();
  }

  /**
   * エントリが期限切れかどうかを確認
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    return this.ttl > 0 && Date.now() - entry.lastAccessed > this.ttl;
  }

  /**
   * メトリクスを更新
   */
  private updateMetrics(type: 'hit' | 'miss'): void {
    if (type === 'hit') this.metrics.hits++;
    else this.metrics.misses++;
    this.metrics.size = this.cache.size;
  }

  /**
   * メモリ使用量を更新
   */
  private updateMemoryUsage(): void {
    // 簡易的なメモリ使用量の計算
    this.metrics.memoryUsage = process.memoryUsage().heapUsed;
  }

  /**
   * メトリクスを取得
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * キャッシュをクリア
   */
  clear(): void {
    this.cache.clear();
    this.metrics = {
      hits: 0,
      misses: 0,
      size: 0,
      memoryUsage: 0,
    };
  }
}

/**
 * ファイルシステムキャッシュ
 * キャッシュをディスクに永続化
 */
class FileSystemCache<T> {
  private readonly cacheDir: string;
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.cacheDir = join(process.cwd(), '.cache', 'mdx');
    this.config = config;
    this.ensureCacheDirectory();
  }

  /**
   * キャッシュディレクトリを確保
   */
  private async ensureCacheDirectory(): Promise<void> {
    try {
      await mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      errorReporter.report(
        new CacheError('キャッシュディレクトリの作成に失敗しました', {
          cause: error,
        })
      );
    }
  }

  /**
   * キャッシュをファイルに保存
   * @param key キャッシュキー
   * @param value 保存する値
   */
  async save(key: string, value: T): Promise<void> {
    if (!this.config.persistToDisk) return;

    try {
      const now = Date.now();
      const entry: CacheEntry<T> = {
        value,
        created: now,
        lastAccessed: now,
        version: this.config.version || '1.0.0',
      };

      const filePath = join(this.cacheDir, `${key}.json`);
      await writeFile(filePath, JSON.stringify(entry), 'utf8');
    } catch (error) {
      errorReporter.report(
        new CacheError(`キャッシュの保存に失敗しました: ${key}`, {
          cause: error,
        })
      );
    }
  }

  /**
   * キャッシュをファイルから読み込み
   * @param key キャッシュキー
   * @returns キャッシュされた値またはnull
   */
  async load(key: string): Promise<T | null> {
    if (!this.config.persistToDisk) return null;

    try {
      const filePath = join(this.cacheDir, `${key}.json`);
      const data = await readFile(filePath, 'utf8');
      const entry: CacheEntry<T> = JSON.parse(data);

      // バージョンチェックと期限切れチェック
      if (entry.version !== this.config.version || this.isExpired(entry)) {
        return null;
      }

      return entry.value;
    } catch (error) {
      // ファイルが存在しない場合はエラーを報告しない
      return null;
    }
  }

  /**
   * エントリが期限切れかどうかを確認
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    return (
      this.config.ttl > 0 && Date.now() - entry.lastAccessed > this.config.ttl
    );
  }
}

/**
 * キャッシュマネージャー
 * メモリキャッシュとファイルシステムキャッシュを組み合わせて管理
 */
class CacheManager<T> {
  private cache: Map<string, CacheEntry<T>>;
  private fileSystemCache: FileSystemCache<T>;
  private config: CacheConfig;
  private metrics: PerformanceMetrics;

  constructor(config: CacheConfig) {
    this.config = config;
    this.cache = new Map();
    this.fileSystemCache = new FileSystemCache<T>(config);
    this.metrics = {
      hits: 0,
      misses: 0,
      size: 0,
      memoryUsage: 0,
    };

    // 定期的なキャッシュ更新
    if (config.updateInterval > 0) {
      setInterval(() => {
        this.clear();
      }, config.updateInterval);
    }
  }

  /**
   * キャッシュからアイテムを取得
   * @param key キャッシュキー
   * @returns キャッシュされた値またはnull
   */
  async get(key: string): Promise<T | null> {
    // メモリキャッシュから取得を試みる
    const entry = this.cache.get(key);

    if (entry) {
      // TTLが設定されていて、エントリが期限切れの場合
      if (
        this.config.ttl > 0 &&
        Date.now() - entry.lastAccessed > this.config.ttl
      ) {
        this.cache.delete(key);
        this.metrics.misses++;
      } else {
        // エントリを最新の状態に更新（LRU）
        this.cache.delete(key);
        this.cache.set(key, {
          ...entry,
          lastAccessed: Date.now(),
        });
        this.metrics.hits++;
        return entry.value;
      }
    }

    // ファイルシステムキャッシュから取得を試みる
    try {
      const value = await this.fileSystemCache.load(key);
      if (value) {
        // メモリキャッシュに追加
        const now = Date.now();
        this.cache.set(key, {
          value,
          created: now,
          lastAccessed: now,
          version: this.config.version || '1.0.0',
        });
        this.metrics.hits++;
        return value;
      }
    } catch (error) {
      // ファイルシステムキャッシュからの読み込みに失敗した場合はエラーを無視
    }

    this.metrics.misses++;
    return null;
  }

  /**
   * キャッシュにアイテムを設定
   * @param key キャッシュキー
   * @param value キャッシュする値
   */
  async set(key: string, value: T): Promise<void> {
    // キャッシュが最大サイズに達した場合、最も古いエントリを削除
    if (this.cache.size >= (this.config.maxSize || 1000)) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const now = Date.now();
    const entry: CacheEntry<T> = {
      value,
      created: now,
      lastAccessed: now,
      version: this.config.version || '1.0.0',
    };

    // メモリキャッシュに追加
    this.cache.set(key, entry);
    this.metrics.size = this.cache.size;

    // ファイルシステムキャッシュに保存
    if (this.config.persistToDisk) {
      try {
        await this.fileSystemCache.save(key, value);
      } catch (error) {
        errorReporter.report(
          new CacheError(`キャッシュの保存に失敗しました: ${key}`, {
            cause: error,
          })
        );
      }
    }
  }

  /**
   * メトリクスを取得
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * キャッシュをクリア
   */
  clear(): void {
    this.cache.clear();
    this.metrics = {
      hits: 0,
      misses: 0,
      size: 0,
      memoryUsage: 0,
    };
  }
}

// 環境に応じたキャッシュ設定を取得
export function getCacheConfig(): CacheConfig {
  const isProd = process.env.NODE_ENV === 'production';
  return isProd ? prodConfig : devConfig;
}

// キャッシュマネージャーのシングルトンインスタンス
let cacheInstance: CacheManager<unknown> | null = null;

function getCacheManager<T>(): CacheManager<T> {
  if (!cacheInstance) {
    const config = getCacheConfig();
    cacheInstance = new CacheManager<unknown>(config);
  }
  return cacheInstance as CacheManager<T>;
}

// エクスポートするキャッシュマネージャーインスタンス
export const cacheManager = getCacheManager();
