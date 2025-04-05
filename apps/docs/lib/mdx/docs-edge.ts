/**
 * Edge Runtime対応のドキュメントツリー取得モジュール
 * このモジュールは、Node.jsのファイルシステムに依存せず
 * ビルド時に生成された静的データを使用します
 */

import type { DocNode } from '~/types/mdx';

// JSONファイルをインポートするための型宣言 は削除
// declare module '*.json' {
//   const value: DocNode[];
//   export default value;
// }

// ビルド時に生成された静的JSONファイルをインポート
// 注: これらのファイルはビルド時にgenerate-doc-data.tsスクリプトによって生成されます
import documentsTreeData from '../../data/documents-tree.json';
import wikiTreeData from '../../data/wiki-tree.json';
import journalsTreeData from '../../data/journals-tree.json';

// 型キャストとデフォルト値の設定
const documentsTree: DocNode[] = Array.isArray(documentsTreeData)
  ? documentsTreeData
  : [];
const wikiTree: DocNode[] = Array.isArray(wikiTreeData) ? wikiTreeData : [];
const journalsTree: DocNode[] = Array.isArray(journalsTreeData)
  ? journalsTreeData
  : [];

/**
 * Edge Runtime対応のドキュメントツリー取得関数
 * @param type ドキュメントタイプ
 * @param subDir オプションのサブディレクトリ
 * @returns ドキュメントツリー
 */
export async function getDocTreeEdge(
  type: string,
  subDir?: string | null
): Promise<DocNode[]> {
  // タイプに応じた静的データを返す
  switch (type) {
    case 'documents':
      return documentsTree;
    case 'wiki':
      return wikiTree;
    case 'journals':
      return journalsTree;
    default:
      return [];
  }
}

/**
 * ドキュメントタイプの取得（Edge対応）
 */
export function getDocTypesEdge() {
  return [
    {
      id: 'documents',
      title: 'ドキュメント',
      description: '書籍、プロジェクト文書、技術文書などのまとまった情報',
      category: 'documents',
    },
    {
      id: 'wiki',
      title: 'Wiki',
      description: '技術用語や業務用語などの単語レベルの情報',
      category: 'wiki',
    },
    {
      id: 'journals',
      title: '日記',
      description: '日々の作業記録や学習記録',
      category: 'journals',
    },
  ];
}
