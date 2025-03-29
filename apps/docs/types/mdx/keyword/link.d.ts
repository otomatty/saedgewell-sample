/**
 * キーワードリンク関連の型定義
 */

import type { DocumentMapping, DocumentMappingItem } from '../document/mapping';
import type { KeywordErrorType } from './error';

/**
 * KeywordLinkコンポーネントのプロパティ
 */
export interface KeywordLinkProps {
  /** リンクするキーワード */
  keyword: string;
  /** ドキュメントタイプ（任意） */
  docType?: string;
  /** リンクが有効かどうか（任意） */
  isValid?: boolean;
  /** スタイリング用のクラス名（任意） */
  className?: string;
  /** 解決済みキーワードデータ（任意）、文字列の場合はJSONとしてパース */
  initialData?: ResolvedKeyword | string;
}

/**
 * キーワード候補
 */
export interface KeywordCandidate {
  /** タイトル */
  title: string;
  /** パス */
  path: string;
  /** スコア */
  score: number;
}

/**
 * キーワードエラー
 */
export interface KeywordErrorInfo {
  /** エラータイプ */
  type: KeywordErrorType;
  /** エラーメッセージ */
  message: string;
}

/**
 * キーワード解決結果
 */
export interface ResolvedKeyword {
  /** キーワード */
  keyword: string;
  /** ドキュメントタイプ */
  docType?: string;
  /** ドキュメントマッピング */
  mapping?: DocumentMappingItem;
  /** 重複があるかどうか */
  isAmbiguous?: boolean;
  /** 代替ドキュメント */
  alternatives?: DocumentMappingItem[];
  /** エラーメッセージ */
  error?: string | KeywordErrorInfo;
  /** 関連キーワード */
  relatedKeywords?: string[];
  /** 解決されたかどうか */
  resolved?: boolean;
  /** 解決されたパス */
  path?: string;
  /** 解決されたタイトル */
  title?: string;
  /** 候補リスト */
  candidates?: KeywordCandidate[];
}
