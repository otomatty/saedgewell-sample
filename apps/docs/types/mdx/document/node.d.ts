/**
 * ドキュメントノード関連の型定義
 */

import type { DocFrontmatter } from './frontmatter';

/**
 * ドキュメントノード
 * ドキュメントツリーの各ノードを表す
 */
export interface DocNode {
  /** タイトル */
  title: string;
  /** 説明 */
  description?: string;
  /** スラッグ */
  slug: string;
  /** 表示順序 */
  order?: number;
  /** 子ノード */
  children: DocNode[];
  /** ノードタイプ（フォルダまたはファイル） */
  type?: 'folder' | 'file';
  /** ファイル名 */
  name?: string;
  /** ファイルパス */
  path?: string;
  /** 最終更新日時 */
  lastModified?: string;
  /** フロントマター */
  frontmatter?: DocFrontmatter;
}

/**
 * ドキュメントナビゲーション
 * 前後のドキュメントへのナビゲーション情報
 */
export interface DocNavigation {
  /** 前のドキュメント */
  prev: DocNavigationItem | null;
  /** 次のドキュメント */
  next: DocNavigationItem | null;
}

/**
 * ドキュメントナビゲーション項目
 */
export interface DocNavigationItem {
  /** タイトル */
  title: string;
  /** スラッグ */
  slug: string;
  /** 説明 */
  description?: string;
}
