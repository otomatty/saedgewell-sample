/**
 * キーワード解決関連の型定義
 */

import type { KeywordIdentifier } from './index';

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
 * 重複タイトルエラー
 * 同じタイトルを持つドキュメントが複数存在する場合の情報
 */
export interface DuplicateTitleError {
  /** タイトル */
  title: string;
  /** 重複しているドキュメント */
  occurrences: KeywordIdentifier[];
  /** エラーの重要度 */
  severity: 'warning' | 'error';
  /** 解決のための提案 */
  suggestion?: string;
}
