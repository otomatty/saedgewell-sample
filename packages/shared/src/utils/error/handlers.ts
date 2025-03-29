/**
 * エラーハンドリングユーティリティ
 * 様々なエラーをアプリケーションのエラー形式に変換する関数を提供します。
 */

import type { PostgrestError } from '@supabase/supabase-js';

/**
 * アプリケーションのエラーコード
 */
export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'DATABASE_ERROR'
  | 'INTERNAL_ERROR';

/**
 * アプリケーションのエラー型
 */
export interface AppError {
  code: ErrorCode;
  message: string;
  status: number;
  cause?: unknown;
}

/**
 * エラーコードとステータスコードのマッピング
 */
const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  DATABASE_ERROR: 500,
  INTERNAL_ERROR: 500,
};

/**
 * Supabaseのエラーをアプリケーションのエラーに変換する
 * @param error - Supabaseから返されたエラー
 * @returns アプリケーションのエラー形式に変換されたエラー
 */
export function handleSupabaseError(error: PostgrestError): AppError {
  // エラーコードに基づいてエラー型を決定
  let code: ErrorCode = 'DATABASE_ERROR';
  if (error.code === 'PGRST116') {
    code = 'NOT_FOUND';
  } else if (error.code === '42501') {
    code = 'FORBIDDEN';
  } else if (error.code === '23505') {
    code = 'VALIDATION_ERROR';
  }

  return {
    code,
    message: error.message,
    status: ERROR_STATUS_MAP[code],
    cause: error,
  };
}

/**
 * 未知のエラーをアプリケーションのエラーに変換する
 * @param error - 未知のエラー
 * @returns アプリケーションのエラー形式に変換されたエラー
 */
export function handleUnknownError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      code: 'INTERNAL_ERROR',
      message: error.message,
      status: 500,
      cause: error,
    };
  }

  return {
    code: 'INTERNAL_ERROR',
    message: '予期せぬエラーが発生しました',
    status: 500,
    cause: error,
  };
}

/**
 * エラーをアプリケーションのエラーに変換する
 * @param error - 変換するエラー
 * @returns アプリケーションのエラー形式に変換されたエラー
 */
export function handleError(error: unknown): AppError {
  if ((error as PostgrestError).code !== undefined) {
    return handleSupabaseError(error as PostgrestError);
  }

  return handleUnknownError(error);
}
