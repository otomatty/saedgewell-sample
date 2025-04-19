/**
 * 検索結果の型定義
 */
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  category: string;
  score: number;
  matchedContent?: string;
  sourceType: 'index' | 'content';
  thumbnail?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 検索オプションの型定義
 */
export interface SearchOptions {
  limit?: number;
  searchMode?: 'fast' | 'accurate' | 'hybrid';
  includeContent?: boolean;
}

/**
 * インデックスエントリーの型定義
 */
export interface IndexEntry {
  id: string;
  title: string;
  description: string;
  content: string;
  path: string;
  category: string;
  sourceType: 'index' | 'content';
  thumbnail?: string;
}

/**
 * キャッシュエントリーの型定義
 */
export interface SearchCache {
  timestamp: number;
  index: Record<string, IndexEntry>;
  fileStats: Record<string, number>;
}
