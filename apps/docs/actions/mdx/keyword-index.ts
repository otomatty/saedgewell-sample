'use server';

import type { DocNode } from '../../lib/mdx/docs';
import type {
  KeywordIndex,
  DuplicateTitleError,
  KeywordIdentifier,
  CacheConfig,
} from '../../types/mdx';

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
      // フォルダの場合は再帰的に処理
      if (node.type === 'folder' && node.children) {
        traverseTree(node.children, docType);
        continue;
      }

      // ファイルの場合はキーワードインデックスに追加
      if (node.type === 'file') {
        const title = node.title || node.name || '';
        const path = node.path || '';
        const lastModified = node.lastModified
          ? new Date(node.lastModified).getTime()
          : Date.now();

        // タイトルをキーワードとして追加
        addToIndex(title, {
          title,
          docType,
          path,
          lastModified,
        });

        // フロントマターのキーワードがあれば追加
        if (node.frontmatter && Array.isArray(node.frontmatter.keywords)) {
          for (const keyword of node.frontmatter.keywords) {
            addToIndex(keyword, {
              title,
              docType,
              path,
              lastModified,
            });
          }
        }
      }
    }
  }

  /**
   * キーワードインデックスにドキュメント情報を追加する
   * @param keyword キーワード
   * @param doc ドキュメント情報
   */
  function addToIndex(keyword: string, doc: KeywordIdentifier) {
    if (!keyword || typeof keyword !== 'string') return;

    // キーワードを正規化
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return;

    // キーワードがまだインデックスにない場合は初期化
    if (!index[normalizedKeyword]) {
      index[normalizedKeyword] = {
        documents: [],
        isAmbiguous: false,
        lastUpdated: Date.now(),
      };
    }

    // 同じパスのドキュメントが既に存在する場合はスキップ
    if (index[normalizedKeyword].documents.some((d) => d.path === doc.path)) {
      return;
    }

    // ドキュメントを追加
    index[normalizedKeyword].documents.push(doc);

    // 複数のドキュメントが同じキーワードを持つ場合は曖昧フラグを立てる
    if (index[normalizedKeyword].documents.length > 1) {
      index[normalizedKeyword].isAmbiguous = true;

      // 重複エラーを記録
      if (normalizedKeyword === doc.title.toLowerCase()) {
        duplicates.push({
          title: doc.title,
          occurrences: index[normalizedKeyword].documents,
          severity: 'warning',
          suggestion:
            'タイトルが重複しています。一意なタイトルを設定することを検討してください。',
        });
      }
    }
  }

  // ドキュメントツリーを巡回してインデックスを構築
  traverseTree(docTree, 'docs');

  return { index, duplicates };
}

/**
 * キーワードインデックスを取得する
 * @param docTree ドキュメントツリー
 * @param config キャッシュ設定
 * @returns キーワードインデックスと重複タイトルのエラー情報
 */
export function getKeywordIndex(
  docTree: DocNode[],
  config: CacheConfig
): {
  index: KeywordIndex;
  duplicates: DuplicateTitleError[];
} {
  // キャッシュキー
  const cacheKey = 'keyword-index';

  // キャッシュから取得を試みる
  // TODO: キャッシュ実装

  // キャッシュになければ新規構築
  return buildKeywordIndex(docTree, config);
}
