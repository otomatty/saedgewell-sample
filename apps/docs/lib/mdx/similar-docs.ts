import { getDocTree } from './doc-tree';
import type { DocNode } from '~/types/mdx';

/**
 * ドキュメントの簡易表現
 */
export interface SimplifiedDoc {
  title: string;
  path: string;
  description?: string;
  category: string;
  docType: string;
  score?: number;
}

/**
 * 検索語に基づいて類似ドキュメントを検索する
 * @param searchTerm 検索語
 * @param limit 最大結果数
 * @returns 類似ドキュメントの配列
 */
export async function findSimilarDocuments(
  searchTerm: string,
  limit = 5
): Promise<SimplifiedDoc[]> {
  try {
    // ドキュメントツリーを取得
    const docTree = await getDocTree();
    const allDocs: SimplifiedDoc[] = [];

    // ドキュメントツリーをフラット化して検索可能な配列に変換
    function flattenDocTree(
      nodes: DocNode[],
      category = 'documents',
      docType = 'general'
    ) {
      for (const node of nodes) {
        if (node.title) {
          allDocs.push({
            title: node.title,
            path: `/${node.slug || ''}`,
            description: node.description,
            category,
            docType,
          });
        }

        // 子ノードを処理
        if (node.children && node.children.length > 0) {
          // スラッグからカテゴリとドキュメントタイプを抽出
          let currentCategory = category;
          let currentDocType = docType;

          if (node.slug) {
            const slugParts = node.slug.split('/');
            if (slugParts.length >= 2) {
              // 型安全な代入
              const categoryPart = slugParts[0];
              const docTypePart = slugParts[1];

              if (categoryPart && docTypePart) {
                currentCategory = categoryPart;
                currentDocType = docTypePart;
              }
            }
          }

          flattenDocTree(node.children, currentCategory, currentDocType);
        }
      }
    }

    flattenDocTree(docTree as DocNode[]);

    // 検索語に基づいてドキュメントをスコアリング
    const scoredDocs = allDocs.map((doc) => {
      let score = 0;

      // タイトルに検索語が含まれる場合、高いスコアを付与
      if (
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(doc.title.toLowerCase())
      ) {
        score += 10;
      }

      // 説明に検索語が含まれる場合、中程度のスコアを付与
      if (doc.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        score += 5;
      }

      // パスに検索語が含まれる場合、低いスコアを付与
      if (doc.path.toLowerCase().includes(searchTerm.toLowerCase())) {
        score += 3;
      }

      return { ...doc, score };
    });

    // スコアでソートして上位の結果を返す
    return scoredDocs
      .filter((doc) => doc.score !== undefined && doc.score > 0)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, limit);
  } catch (error) {
    console.error('類似ドキュメントの検索中にエラーが発生しました:', error);
    return [];
  }
}
