/**
 * フロントマター関連の型定義
 */

/**
 * ドキュメントのフロントマター
 */
export interface DocFrontmatter {
  /** タイトル */
  title: string;
  /** 説明 */
  description?: string;
  /** 日付 */
  date?: string;
  /** 公開状態 */
  status?: 'published' | 'draft' | 'private';
  /** タグ */
  tags?: string[];
  /** カテゴリー */
  category?: string;
  /** 画像 */
  image?: string;
  /** 著者 */
  author?: string;
  /** 目次表示 */
  toc?: boolean;
  /** 注目コンテンツ */
  featured?: boolean;
  /** 表示順序 */
  order?: number;
  /** キーワード */
  keywords?: string[];
  /** その他のプロパティ */
  [key: string]: unknown;
}
