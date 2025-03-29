/**
 * キーワード関連の型定義のエントリーポイント
 */

/**
 * キーワード識別子
 * ドキュメントのタイトル、種類、パスなどの情報を持つ
 */
export interface KeywordIdentifier {
  /** ドキュメントのタイトル */
  title: string;
  /** ドキュメントの種類（例: 'docs', 'api'） */
  docType: string;
  /** ドキュメントへの相対パス */
  path: string;
  /** 最終更新時刻 */
  lastModified?: number;
}

// エラー型を直接ここで定義
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

/**
 * キーワードインデックス
 * キーワードをキーとして、関連するドキュメント情報を格納
 */
export interface KeywordIndex {
  [keyword: string]: {
    /** キーワードに関連するドキュメント */
    documents: KeywordIdentifier[];
    /** 重複があるかどうか */
    isAmbiguous: boolean;
    /** 最終更新時刻 */
    lastUpdated: number;
  };
}

/**
 * 解決されたキーワード情報
 */
export interface ResolvedKeyword {
  /** キーワード */
  keyword: string;
  /** ドキュメントタイプ */
  docType?: string;
  /** タイトル */
  title: string;
  /** パス */
  path: string;
  /** 最終更新時刻 */
  lastModified?: number;
  /** 関連キーワード */
  related?: {
    keyword: string;
    title: string;
    path: string;
  }[];
}

// 他のキーワード関連の型も必要に応じて追加
