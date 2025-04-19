/**
 * キーワードエラー関連の型定義
 */

/**
 * エラー種別
 */
export enum KeywordErrorType {
  /** キーワード解決エラー */
  RESOLUTION_ERROR = 'resolution_error',
  /** 重複エラー */
  DUPLICATE_ERROR = 'duplicate_error',
  /** キャッシュエラー */
  CACHE_ERROR = 'cache_error',
  /** パースエラー */
  PARSE_ERROR = 'parse_error',
  /** 見つからないエラー */
  NOT_FOUND = 'not_found',
}

/**
 * エラー情報
 */
export interface KeywordError {
  /** エラーの種類 */
  type: KeywordErrorType;
  /** エラーメッセージ */
  message: string;
  /** 詳細情報 */
  details?: unknown;
  /** エラー発生時刻 */
  timestamp: number;
}
