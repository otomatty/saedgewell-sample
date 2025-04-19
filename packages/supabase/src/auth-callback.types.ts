/**
 * auth-callback.types.ts
 *
 * 認証コールバックに関連する型定義を提供します。
 * これはauth-callback.service.tsで使用されます。
 */

/**
 * 認証コールバックのパラメータ
 */
export interface CallbackParams {
  /**
   * 認証コード
   */
  code?: string;

  /**
   * OAuth認証の状態トークン
   */
  state?: string;

  /**
   * エラーメッセージ
   */
  error?: string;

  /**
   * エラーの詳細
   */
  errorDescription?: string;
}

/**
 * エラーコード列挙型
 */
export enum ErrorCode {
  /**
   * 不明なエラー
   */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',

  /**
   * OAuth認証エラー
   */
  OAUTH_ERROR = 'OAUTH_ERROR',

  /**
   * 状態トークンエラー
   */
  STATE_ERROR = 'STATE_ERROR',

  /**
   * 状態トークン不一致エラー
   */
  STATE_MISMATCH = 'STATE_MISMATCH',

  /**
   * 認証コードエラー
   */
  CODE_ERROR = 'CODE_ERROR',

  /**
   * セッションエラー
   */
  SESSION_ERROR = 'SESSION_ERROR',

  /**
   * Code Verifierエラー
   */
  CODE_VERIFIER_ERROR = 'CODE_VERIFIER_ERROR',

  /**
   * コード交換エラー
   */
  EXCHANGE_ERROR = 'EXCHANGE_ERROR',

  /**
   * リダイレクトエラー
   */
  REDIRECT_ERROR = 'REDIRECT_ERROR',

  /**
   * 無効なリダイレクトエラー
   */
  INVALID_REDIRECT = 'INVALID_REDIRECT',
}
