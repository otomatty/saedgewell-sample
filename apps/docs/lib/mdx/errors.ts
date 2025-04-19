import type {
  KeywordError,
  KeywordIdentifier,
} from '../../types/mdx/keyword-ts';
import { KeywordErrorType } from '../../types/mdx/keyword-ts';

/**
 * キーワード解決エラー
 */
export class KeywordResolutionError extends Error {
  readonly type: KeywordErrorType = KeywordErrorType.RESOLUTION_ERROR;
  readonly timestamp: number;

  constructor(
    public keyword: string,
    public docType?: string,
    message?: string
  ) {
    super(message || `キーワード "${keyword}" の解決に失敗しました`);
    this.name = 'KeywordResolutionError';
    this.timestamp = Date.now();
  }

  toJSON(): KeywordError {
    return {
      type: this.type,
      message: this.message,
      details: {
        keyword: this.keyword,
        docType: this.docType,
      },
      timestamp: this.timestamp,
    };
  }
}

/**
 * 重複エラー
 */
export class DuplicateKeywordError extends Error {
  readonly type: KeywordErrorType = KeywordErrorType.DUPLICATE_ERROR;
  readonly timestamp: number;

  constructor(
    public keyword: string,
    public occurrences: KeywordIdentifier[],
    message?: string
  ) {
    super(
      message ||
        `キーワード "${keyword}" が複数のドキュメントで使用されています`
    );
    this.name = 'DuplicateKeywordError';
    this.timestamp = Date.now();
  }

  toJSON(): KeywordError {
    return {
      type: this.type,
      message: this.message,
      details: {
        keyword: this.keyword,
        occurrences: this.occurrences,
      },
      timestamp: this.timestamp,
    };
  }

  /**
   * 解決のための提案を生成
   */
  getSuggestion(): string {
    const paths = this.occurrences.map((o) => o.path).join(', ');
    return `以下のドキュメントでキーワードの重複が見つかりました: ${paths}
docTypeを指定して一意に解決するか、キーワードを変更することを検討してください。`;
  }
}

/**
 * キャッシュエラー
 */
export class CacheError extends Error {
  readonly type: KeywordErrorType = KeywordErrorType.CACHE_ERROR;
  readonly timestamp: number;

  constructor(
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'CacheError';
    this.timestamp = Date.now();
  }

  toJSON(): KeywordError {
    return {
      type: this.type,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

/**
 * パースエラー
 */
export class ParseError extends Error {
  readonly type: KeywordErrorType = KeywordErrorType.PARSE_ERROR;
  readonly timestamp: number;

  constructor(
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ParseError';
    this.timestamp = Date.now();
  }

  toJSON(): KeywordError {
    return {
      type: this.type,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

/**
 * エラーレポーター
 * エラーの収集、ログ記録、分析を行う
 */
export class ErrorReporter {
  private errors: KeywordError[] = [];
  private readonly maxErrors: number = 100;

  /**
   * エラーを記録
   */
  report(error: Error): void {
    if (this.errors.length >= this.maxErrors) {
      this.errors.shift(); // 古いエラーを削除
    }

    if (
      error instanceof KeywordResolutionError ||
      error instanceof DuplicateKeywordError ||
      error instanceof CacheError ||
      error instanceof ParseError
    ) {
      this.errors.push(error.toJSON());
    } else {
      this.errors.push({
        type: KeywordErrorType.PARSE_ERROR,
        message: error.message,
        details: error,
        timestamp: Date.now(),
      });
    }

    // エラーをコンソールに出力
    console.error(
      `[${new Date().toISOString()}] ${error.name}: ${error.message}`
    );
  }

  /**
   * エラー履歴を取得
   */
  getErrors(): KeywordError[] {
    return [...this.errors];
  }

  /**
   * エラー統計を取得
   */
  getStatistics(): Record<KeywordErrorType, number> {
    return this.errors.reduce(
      (acc, error) => {
        acc[error.type] = (acc[error.type] || 0) + 1;
        return acc;
      },
      {} as Record<KeywordErrorType, number>
    );
  }

  /**
   * エラー履歴をクリア
   */
  clear(): void {
    this.errors = [];
  }
}

// エラーレポーターのシングルトンインスタンス
export const errorReporter = new ErrorReporter();
