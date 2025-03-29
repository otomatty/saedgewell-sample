'use server';

// flexsearchの型定義問題を解決
// @ts-ignore
import { Document, type Id } from 'flexsearch';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SearchEngine } from '~/lib/search/engine';
import type { SearchOptions } from '~/types/search';
import { searchConfig } from '~/config/search.config';
import { searchLogger } from '~/lib/logger/search';

export type SearchResult = {
  id: string;
  title: string;
  description: string;
  path: string;
  category: string;
  score: number;
  matchedContent?: string;
  sourceType: 'index' | 'content';
  thumbnail?: string;
};

// ドキュメントの型定義
type DocType = {
  id: string;
  title: string;
  description: string;
  content: string;
  path: string;
  category: string;
};

// インデックスをキャッシュするためのグローバル変数
// @ts-ignore: FlexSearchの型定義の問題を回避
let searchIndex: Document | null = null;

// インデックスの遅延ロード
function getSearchIndex() {
  if (searchIndex) return searchIndex;

  try {
    const indexPath = join(process.cwd(), 'public', 'search', 'index.json');

    if (!existsSync(indexPath)) {
      console.error('検索インデックスファイルが見つかりません:', indexPath);
      throw new Error(
        '検索インデックスが構築されていません。npm run build:search を実行してください。'
      );
    }

    const indexData = JSON.parse(readFileSync(indexPath, 'utf-8'));

    // @ts-ignore: FlexSearchの型定義の問題を回避
    searchIndex = new Document({
      tokenize: 'forward',
      // @ts-ignore: FlexSearchの型定義の問題を回避
      document: {
        id: 'id',
        index: ['title', 'description', 'content'],
        store: true,
      },
    });

    // @ts-ignore: FlexSearchの型定義が古いため、importメソッドの引数の型が合わないと誤検出されます
    searchIndex.import(indexData);
    console.log('検索インデックスを読み込みました');
    return searchIndex;
  } catch (error) {
    console.error('検索インデックスの読み込みに失敗しました:', error);
    throw new Error('検索インデックスの読み込みに失敗しました');
  }
}

/**
 * ドキュメントを検索する
 * SearchEngineクラスを使用する新しい実装
 * @param query 検索クエリ
 * @returns 検索結果の配列
 */
export async function searchDocuments(query: string): Promise<SearchResult[]> {
  try {
    const searchEngine = SearchEngine.getInstance();
    return await searchEngine.search(query, {
      searchMode: 'hybrid',
      limit: searchConfig.search.maxResults,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      searchLogger.error(error);
    } else {
      searchLogger.error(new Error(`不明なエラー: ${String(error)}`));
    }

    // 新しい実装が失敗した場合は古い実装にフォールバック
    try {
      return await searchDocumentsLegacy(query);
    } catch {
      return [];
    }
  }
}

/**
 * レガシーな検索実装（後方互換性のため残しておく）
 */
async function searchDocumentsLegacy(query: string): Promise<SearchResult[]> {
  console.log('レガシー検索実行:', query);

  if (!query || query.trim() === '') {
    return [];
  }

  try {
    const index = getSearchIndex();

    // 複数フィールドで検索
    // @ts-ignore: FlexSearchの型定義が古いため、searchメソッドの引数の型が合わないと誤検出されます
    const titleResults = await index.search(query, {
      field: 'title',
      limit: 20,
    });
    // @ts-ignore: FlexSearchの型定義が古いため、searchメソッドの引数の型が合わないと誤検出されます
    const descResults = await index.search(query, {
      field: 'description',
      limit: 20,
    });
    // @ts-ignore: FlexSearchの型定義が古いため、searchメソッドの引数の型が合わないと誤検出されます
    const contentResults = await index.search(query, {
      field: 'content',
      limit: 20,
    });

    console.log(
      `検索結果数: タイトル=${titleResults.length}, 説明=${descResults.length}, 内容=${contentResults.length}`
    );

    // 結果をマージして重複を除去
    const resultMap = new Map<string, SearchResult>();

    // スコア計算関数
    const calculateScore = (field: string, index: number) => {
      const baseScore =
        field === 'title' ? 100 : field === 'description' ? 80 : 60;
      return baseScore - index * 0.5; // 順位が下がるほどスコアも下がる
    };

    // マッチした内容の抜粋を作成する関数
    const createExcerpt = (content: string, searchTerm: string) => {
      if (!content) return undefined;

      const lowerContent = content.toLowerCase();
      const lowerTerm = searchTerm.toLowerCase();
      const index = lowerContent.indexOf(lowerTerm);

      if (index === -1) return undefined;

      const start = Math.max(0, index - 50);
      const end = Math.min(content.length, index + searchTerm.length + 50);
      return `...${content.substring(start, end)}...`;
    };

    // ドキュメントをIDから取得する関数
    const getDocumentById = (id: Id): DocType | undefined => {
      try {
        // @ts-ignore: FlexSearchの型定義が古いため、getメソッドの型が合わないと誤検出されます
        return index.get(id);
      } catch (error) {
        console.error(`ID ${id} のドキュメント取得に失敗:`, error);
        return undefined;
      }
    };

    // タイトル検索結果（高スコア）
    // @ts-ignore: FlexSearchの検索結果の型定義の問題を回避
    for (const result of titleResults) {
      // @ts-ignore: FlexSearchの検索結果の型定義の問題を回避
      const field = result.field;
      // @ts-ignore: FlexSearchの検索結果の型定義の問題を回避
      const ids = result.result;

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        if (id !== undefined) {
          const doc = getDocumentById(id);

          if (doc) {
            resultMap.set(doc.id, {
              id: doc.id,
              title: doc.title,
              description: doc.description,
              path: doc.path,
              category: doc.category,
              score: calculateScore('title', i),
              matchedContent: createExcerpt(doc.content, query),
              sourceType: 'content',
              thumbnail: undefined,
            });
          }
        }
      }
    }

    // 説明文検索結果
    // @ts-ignore: FlexSearchの検索結果の型定義の問題を回避
    for (const result of descResults) {
      // @ts-ignore: FlexSearchの検索結果の型定義の問題を回避
      const field = result.field;
      // @ts-ignore: FlexSearchの検索結果の型定義の問題を回避
      const ids = result.result;

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        if (id !== undefined) {
          const doc = getDocumentById(id);

          if (doc && !resultMap.has(doc.id)) {
            resultMap.set(doc.id, {
              id: doc.id,
              title: doc.title,
              description: doc.description,
              path: doc.path,
              category: doc.category,
              score: calculateScore('description', i),
              matchedContent: createExcerpt(doc.content, query),
              sourceType: 'content',
              thumbnail: undefined,
            });
          }
        }
      }
    }

    // 内容検索結果（低スコア）
    // @ts-ignore: FlexSearchの検索結果の型定義の問題を回避
    for (const result of contentResults) {
      // @ts-ignore: FlexSearchの検索結果の型定義の問題を回避
      const field = result.field;
      // @ts-ignore: FlexSearchの検索結果の型定義の問題を回避
      const ids = result.result;

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        if (id !== undefined) {
          const doc = getDocumentById(id);

          if (doc && !resultMap.has(doc.id)) {
            resultMap.set(doc.id, {
              id: doc.id,
              title: doc.title,
              description: doc.description,
              path: doc.path,
              category: doc.category,
              score: calculateScore('content', i),
              matchedContent: createExcerpt(doc.content, query),
              sourceType: 'content',
              thumbnail: undefined,
            });
          }
        }
      }
    }

    // スコア順にソート
    const results = Array.from(resultMap.values());
    results.sort((a, b) => b.score - a.score);

    console.log(`最終検索結果数: ${results.length}`);
    return results;
  } catch (error) {
    console.error('検索中にエラーが発生しました:', error);
    return [];
  }
}

/**
 * 検索候補を取得する
 * @param query 検索クエリ
 * @param limit 取得する候補の最大数
 * @returns 検索候補の配列
 */
export async function getSuggestions(
  query: string,
  limit = 5
): Promise<SearchResult[]> {
  try {
    const searchEngine = SearchEngine.getInstance();
    return await searchEngine.search(query, {
      searchMode: 'fast',
      limit,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      searchLogger.error(error);
    } else {
      searchLogger.error(new Error(`不明なエラー: ${String(error)}`));
    }
    return [];
  }
}
