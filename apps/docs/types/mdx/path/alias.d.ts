/**
 * パスエイリアス関連の型定義
 */

/**
 * パスエイリアス
 * エイリアスとそれに対応する実際のパスの対応を定義
 */
export interface PathAlias {
  /** エイリアス（例: '@docs'） */
  alias: string;
  /** 実際のパス */
  path: string;
}
