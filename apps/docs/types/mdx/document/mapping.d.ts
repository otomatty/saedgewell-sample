/**
 * ドキュメントマッピング関連の型定義
 */

import type { Document } from './document';

/**
 * ドキュメントマッピングの設定
 */
export interface DocumentMappingConfig {
  /** ベースパス */
  basePath: string;
  /** 対象とするファイル拡張子 */
  extensions: string[];
  /** 無視するパス */
  ignorePaths: string[];
  /** インデックス更新間隔 */
  indexUpdateInterval: number;
}

/**
 * ドキュメントメタデータ
 */
export interface DocumentMetadata {
  /** タイトル */
  title: string;
  /** 説明 */
  description?: string;
  /** パス */
  path: string;
  /** スラッグ */
  slug: string;
  /** ドキュメントタイプ */
  docType: string;
  /** キーワード */
  keywords: string[];
  /** 最終更新日時 */
  lastModified: string;
}

/**
 * ドキュメントマッピングアイテム
 * Documentインターフェースと互換性を持たせる
 */
export interface DocumentMappingItem extends Document {
  /** スラッグ */
  slug: string;
  /** ドキュメントタイプ */
  docType: string;
  /** メタデータ */
  metadata: DocumentMetadata;
}

/**
 * ドキュメントマッピング結果
 * DocumentMappingItemの配列として扱えるようにする
 */
export type DocumentMapping = DocumentMappingItem[];
