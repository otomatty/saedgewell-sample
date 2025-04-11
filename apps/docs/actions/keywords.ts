// apps/docs/actions/keywords.ts
'use server';

import type {
  ResolvedKeyword,
  KeywordIndex,
  KeywordIdentifier,
  DocumentMetadata,
  DocumentMappingItem,
} from '~/types/mdx';
import { getDocTree } from '../lib/mdx/doc-tree';

// DocNodeの型定義
interface DocNode {
  title?: string;
  slug?: string;
  children?: DocNode[];
  lastModified?: number;
}

/**
 * キーワードインデックスを取得する関数
 * @returns キーワードインデックス
 */
async function getKeywordIndex(): Promise<KeywordIndex> {
  try {
    // ドキュメントツリーを取得
    const docTree = await getDocTree();
    // テスト用ドキュメントツリーも取得
    const testDocTree = await getDocTree('contents/test');

    // 簡易的なキーワードインデックスを構築
    const index: KeywordIndex = {};

    // ドキュメントツリーからキーワードインデックスを構築
    function traverseTree(nodes: DocNode[], docType: string) {
      for (const node of nodes) {
        if (node.title) {
          // タイトルをキーワードとしてインデックスに追加
          const entry = index[node.title] || {
            documents: [],
            isAmbiguous: false,
            lastUpdated: Date.now(),
          };

          // ドキュメント情報を追加
          const identifier: KeywordIdentifier = {
            title: node.title,
            docType,
            path: node.slug || '',
            lastModified: node.lastModified || Date.now(),
          };

          entry.documents.push(identifier);

          // 既に同じタイトルがあれば重複としてマーク
          if (entry.documents.length > 1) {
            entry.isAmbiguous = true;
          }

          index[node.title] = entry;
        }

        // 子ノードを処理
        if (node.children && node.children.length > 0) {
          traverseTree(node.children, docType);
        }
      }
    }

    // docType='docs'としてドキュメントツリーを処理
    traverseTree(docTree as DocNode[], 'docs');
    // docType='test'としてテスト用ドキュメントツリーを処理
    traverseTree(testDocTree as DocNode[], 'test');

    return index;
  } catch (error) {
    console.error('キーワードインデックスの取得に失敗しました:', error);
    return {};
  }
}

/**
 * キーワードを解決する関数
 * @param keyword 解決するキーワード
 * @param docType ドキュメントタイプ（オプション）
 * @param context コンテキスト情報（オプション）
 * @returns 解決されたキーワード情報
 */
export async function resolveKeyword(
  keyword: string,
  docType?: string,
  context?: string
): Promise<ResolvedKeyword> {
  try {
    // キーワードインデックスを取得
    const keywordIndex = await getKeywordIndex();

    // キーワードが空の場合はエラー
    if (!keyword.trim()) {
      return {
        keyword,
        docType: 'wiki', // docTypeを常にwikiに設定
        isAmbiguous: false,
        error: 'キーワードが指定されていません',
      };
    }

    // キーワードインデックスからエントリを検索
    const entry = keywordIndex[keyword];

    // エントリが見つからない場合
    if (!entry) {
      // 類似キーワードを検索（オプション）
      const similarKeywords = findSimilarKeywords(keyword, keywordIndex, 3);

      return {
        keyword,
        docType: 'wiki', // docTypeを常にwikiに設定
        isAmbiguous: false,
        error: 'キーワードが見つかりません',
        relatedKeywords:
          similarKeywords.length > 0 ? similarKeywords : undefined,
      };
    }

    // wikiドキュメントを探す
    const wikiDocs = entry.documents.filter((doc) => doc.docType === 'wiki');

    // wikiドキュメントが存在しない場合
    if (wikiDocs.length === 0) {
      return {
        keyword,
        docType: 'wiki',
        isAmbiguous: false,
        error: 'キーワードはwikiに存在しません',
      };
    }

    // 最適なwikiドキュメントを選択
    const bestMatch = wikiDocs[0]; // 複数ある場合は最初のものを使用

    // bestMatchが存在することを確認
    if (!bestMatch) {
      return {
        keyword,
        docType: 'wiki',
        isAmbiguous: false,
        error: 'wikiドキュメントの取得に失敗しました',
      };
    }

    // 正常に解決された情報を返す
    return {
      keyword,
      docType: 'wiki',
      mapping: {
        title: bestMatch.title,
        path: bestMatch.path,
        docType: 'wiki',
        slug: bestMatch.path,
        metadata: {
          title: bestMatch.title,
          path: bestMatch.path,
          slug: bestMatch.path,
          docType: 'wiki',
          keywords: [],
          lastModified: bestMatch.lastModified
            ? String(bestMatch.lastModified)
            : String(Date.now()),
        },
      },
      isAmbiguous: false,
    };
  } catch (error) {
    console.error('キーワード解決中にエラーが発生しました:', error);

    return {
      keyword,
      docType: 'wiki',
      isAmbiguous: false,
      error:
        error instanceof Error ? error.message : '不明なエラーが発生しました',
    };
  }
}

/**
 * ドキュメントマッピングを作成する関数
 * @param entry キーワードエントリ
 * @param docType ドキュメントタイプ
 * @returns ドキュメントマッピングアイテム
 */
function createDocumentMapping(
  entry: KeywordIdentifier,
  docType: string
): DocumentMappingItem {
  // パスからスラッグを抽出
  const pathParts = entry.path.split('/');
  const docTypeIndex = pathParts.findIndex((part) => part === entry.docType);

  // スラッグの構築
  let slug: string;

  // パスにdocTypeが含まれている場合は、そのまま使用
  if (docTypeIndex !== -1) {
    slug = entry.path;
  } else {
    // パスにdocTypeが含まれていない場合は、単純にパスを使用
    slug = entry.path;
  }

  // メタデータの構築
  const metadata: DocumentMetadata = {
    title: entry.title,
    description: '', // 必要に応じて説明を追加
    path: entry.path,
    slug,
    docType,
    keywords: [entry.title],
    lastModified: new Date(entry.lastModified || Date.now()).toISOString(),
  };

  return {
    title: entry.title,
    path: entry.path,
    docType,
    slug,
    metadata,
    keywords: [entry.title],
  };
}

/**
 * 類似キーワードを検索する関数
 * @param keyword 検索キーワード
 * @param keywordIndex キーワードインデックス
 * @param limit 最大件数
 * @returns 類似キーワードの配列
 */
function findSimilarKeywords(
  keyword: string,
  keywordIndex: KeywordIndex,
  limit = 5
): string[] {
  const allKeywords = Object.keys(keywordIndex);

  // 簡易的な類似度計算（部分一致）
  const matches = allKeywords
    .filter(
      (k) =>
        k.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(k.toLowerCase())
    )
    .slice(0, limit);

  return matches;
}
