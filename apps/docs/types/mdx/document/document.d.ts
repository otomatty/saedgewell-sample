/**
 * ドキュメント型の定義
 */

/**
 * ドキュメント
 * MDXドキュメントの基本情報を表す
 */
export interface Document {
  /** タイトル */
  title: string;
  /** パス */
  path: string;
  /** スコア（検索結果のランキングなどに使用） */
  score?: number;
  /** 優先度 */
  priority?: number;
  /** キーワード */
  keywords?: string[];
  /** 説明 */
  description?: string;
  /** ドキュメントタイプ */
  docType?: string;
  /** 最終更新日時 */
  lastModified?: string;
  /** メタデータ */
  metadata?: Record<string, unknown>;
}
