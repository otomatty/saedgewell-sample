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

// 他のファイルからエクスポート
export * from './link';
export * from './resolver';
export * from './error';
