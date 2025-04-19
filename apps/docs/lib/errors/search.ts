/**
 * 検索エラーコードの定義
 */
export enum SearchErrorCode {
  /** インデックスが見つからない */
  INDEX_NOT_FOUND = 'INDEX_NOT_FOUND',
  /** 無効なクエリ */
  INVALID_QUERY = 'INVALID_QUERY',
  /** キャッシュエラー */
  CACHE_ERROR = 'CACHE_ERROR',
  /** ファイルシステムエラー */
  FILE_SYSTEM_ERROR = 'FILE_SYSTEM_ERROR',
  /** 検索エンジンエラー */
  SEARCH_ENGINE_ERROR = 'SEARCH_ENGINE_ERROR',
}

/**
 * 検索エラーの基本クラス
 */
export class SearchError extends Error {
  constructor(
    message: string,
    public readonly code: SearchErrorCode,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'SearchError';
  }

  /**
   * エラーの文字列表現を返す
   */
  toString(): string {
    return `[${this.code}] ${this.message}${
      this.details ? ` (${JSON.stringify(this.details)})` : ''
    }`;
  }
}
