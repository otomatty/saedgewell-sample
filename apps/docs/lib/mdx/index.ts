/**
 * MDXドキュメント処理モジュール
 *
 * このモジュールは、MDXドキュメントの処理に関連する機能をエクスポートします。
 * 各サブモジュールは特定の機能に特化しています。
 */

// 型定義
export * from '../../types/mdx';

// フロントマター処理
export * from './frontmatter';

// ドキュメントタイプ
export * from './doc-types';

// ユーティリティ
export * from './utils';

// remarkプラグイン
export * from './remark-keyword-links';

// エラー処理
export * from './errors';

// パス解決
export * from './path-resolver';

// ナビゲーション関連の関数をエクスポート
export { getAdjacentDocs, getDocsWithOrder } from './navigation';
export type { DocNavigation, DocNavigationItem } from './navigation';

// ドキュメントタイプ関連の関数をエクスポート
export { getDocTypes } from './docs';

// フロントマター関連の関数をエクスポート
export { DocFrontmatterSchema, generateTitleFromFilename } from './frontmatter';

// Server Actions
export * from '../../actions/mdx';

// Client Services
export * from '../../services/mdx';
