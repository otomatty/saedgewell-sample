import { SearchError } from '../errors/search';

/**
 * ログレベルの定義
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * 検索ロガーの実装
 */
export const searchLogger = {
  /**
   * デバッグログを出力
   */
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Search Debug]', message, meta);
    }
  },

  /**
   * 情報ログを出力
   */
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log('[Search]', message, meta);
  },

  /**
   * 警告ログを出力
   */
  warn: (message: string, meta?: Record<string, unknown>) => {
    console.warn('[Search Warning]', message, meta);
  },

  /**
   * エラーログを出力
   */
  error: (error: SearchError | Error) => {
    if (error instanceof SearchError) {
      console.error('[Search Error]', {
        code: error.code,
        message: error.message,
        details: error.details,
      });
    } else {
      console.error('[Search Error]', {
        message: error.message,
        stack: error.stack,
      });
    }
  },
} as const;
