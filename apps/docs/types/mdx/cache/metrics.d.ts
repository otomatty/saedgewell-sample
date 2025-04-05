/**
 * パフォーマンスメトリクス関連の型定義
 */

/**
 * パフォーマンスメトリクス
 */
export interface PerformanceMetrics {
  /** インデックス構築時間 */
  indexBuildTime?: number;
  /** キャッシュヒット率 */
  cacheHitRate?: number;
  /** キーワード解決時間 */
  resolutionTime?: number;
  /** メモリ使用量 */
  memoryUsage: number;
  /** ヒット数 */
  hits: number;
  /** ミス数 */
  misses: number;
  /** 総リクエスト数 */
  totalRequests?: number;
  /** キャッシュサイズ */
  size?: number;
}
