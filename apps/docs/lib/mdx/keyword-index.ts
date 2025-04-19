import type { DocNode } from './docs';
import type {
  KeywordIndex,
  DuplicateTitleError,
  KeywordIdentifier,
  CacheConfig,
} from '~/types/mdx';

/**
 * キーワードインデックスを構築する
 * @param docTree ドキュメントツリー
 * @param config キャッシュ設定
 * @returns キーワードインデックスと重複タイトルのエラー情報
 */
export function buildKeywordIndex(
  docTree: DocNode[],
  config: CacheConfig
): {
  index: KeywordIndex;
  duplicates: DuplicateTitleError[];
} {
  const index: KeywordIndex = {};
  const duplicates: DuplicateTitleError[] = [];

  /**
   * ドキュメントツリーを再帰的に巡回し、キーワードインデックスを構築する
   * @param nodes ドキュメントノード
   * @param docType ドキュメントタイプ
   */
  function traverseTree(nodes: DocNode[], docType: string) {
    for (const node of nodes) {
      if (node.title) {
        // タイトルをキーワードとしてインデックスに追加
        const entry = index[node.title] || {
          documents: [] as KeywordIdentifier[],
          isAmbiguous: false,
          lastUpdated: Date.now(),
        };

        // 既に同じタイトルがあれば重複としてマーク
        if (entry.documents.length > 0) {
          entry.isAmbiguous = true;

          // 重複情報を記録
          const existingDuplicate = duplicates.find(
            (d) => d.title === node.title
          );
          if (existingDuplicate) {
            existingDuplicate.occurrences.push({
              title: node.title,
              docType,
              path: node.slug,
            });
          } else {
            duplicates.push({
              title: node.title,
              occurrences: [
                ...entry.documents,
                { title: node.title, docType, path: node.slug },
              ],
              severity: 'warning',
            });
          }
        }

        // ドキュメント情報を追加
        entry.documents.push({
          title: node.title,
          docType,
          path: node.slug,
        });

        index[node.title] = entry;
      }

      // 子ノードを処理
      if (node.children && node.children.length > 0) {
        traverseTree(node.children, docType);
      }
    }
  }

  // docType='docs'としてドキュメントツリーを処理
  traverseTree(docTree, 'docs');

  return { index, duplicates };
}

// キャッシュ機構
let cachedIndex: KeywordIndex | null = null;
let cachedTimestamp = 0;

/**
 * キャッシュを考慮したキーワードインデックスの取得
 * @param docTree ドキュメントツリー
 * @param config キャッシュ設定
 * @returns キーワードインデックスと重複タイトル情報
 */
export function getKeywordIndex(
  docTree: DocNode[],
  config: CacheConfig
): {
  index: KeywordIndex;
  duplicates: DuplicateTitleError[];
} {
  const now = Date.now();

  // キャッシュが有効期限内であれば、キャッシュを返す
  if (cachedIndex && now - cachedTimestamp < config.ttl) {
    return { index: cachedIndex, duplicates: [] };
  }

  // 新しいインデックスを構築
  const result = buildKeywordIndex(docTree, config);

  // キャッシュを更新
  cachedIndex = result.index;
  cachedTimestamp = now;

  return result;
}
