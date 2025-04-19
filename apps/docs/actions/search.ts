'use server';

// flexsearch 関連のインポートを削除
// import { Document, type Id } from 'flexsearch';
// import { readFileSync, existsSync } from 'node:fs'; // readFileSync, existsSync は SearchEngine 側で使われる
// import { join } from 'node:path'; // join は SearchEngine 側で使われる
import { SearchEngine } from '~/lib/search/engine';
// import type { SearchOptions } from '~/types/search'; // SearchOptions はここで直接使わない
// SearchResult 型を SearchEngine と共有するためインポート
import type { SearchResult as EngineSearchResult } from '~/types/search';
import { searchConfig } from '~/config/search.config';
import { searchLogger } from '~/lib/logger/search';

// ローカルの SearchResult 型定義を削除 (EngineSearchResult を使用)
// export type SearchResult = {
//   id: string;
//   title: string;
//   description: string;
//   path: string;
//   category: string;
//   score: number;
//   matchedContent?: string;
//   sourceType: 'index' | 'content';
//   thumbnail?: string;
// };

// DocType 型定義を削除
// type DocType = { ... };

// searchIndex グローバル変数を削除
// let searchIndex: Document | null = null;

// getSearchIndex 関数を削除
// function getSearchIndex() { ... }

/**
 * ドキュメントを検索する
 * SearchEngineクラスを使用する実装
 * @param query 検索クエリ
 * @returns 検索結果の配列
 */
export async function searchDocuments(
  query: string
): Promise<EngineSearchResult[]> {
  // 戻り値の型を EngineSearchResult に変更
  try {
    const searchEngine = SearchEngine.getInstance();
    // searchMode オプションを削除し、limit のみ指定
    return await searchEngine.search(query, {
      // searchMode: 'hybrid', // 削除
      limit: searchConfig.search.maxResults,
    });
  } catch (error: unknown) {
    // エラーロギングは SearchEngine 側で行われる可能性もあるが、アクションレベルでもログを残す
    if (error instanceof Error) {
      searchLogger.error(error);
    } else {
      searchLogger.error(new Error(`不明な検索エラー: ${String(error)}`));
    }
    // フォールバックロジック削除
    // try {
    //   return await searchDocumentsLegacy(query);
    // } catch {
    //   return [];
    // }
    return []; // エラー時は空配列を返す
  }
}

// searchDocumentsLegacy 関数を削除
// async function searchDocumentsLegacy(query: string): Promise<SearchResult[]> { ... }

/**
 * 検索候補を取得する
 * @param query 検索クエリ
 * @param limit 取得する候補の最大数
 * @returns 検索候補の配列
 */
export async function getSuggestions(
  query: string,
  limit = 5 // デフォルトの limit 値を設定
): Promise<EngineSearchResult[]> {
  // 戻り値の型を EngineSearchResult に変更
  try {
    const searchEngine = SearchEngine.getInstance();
    // searchMode オプションを削除
    return await searchEngine.search(query, {
      // searchMode: 'fast', // 削除
      limit,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      searchLogger.error(error);
    } else {
      searchLogger.error(
        new Error(`不明なサジェスト取得エラー: ${String(error)}`)
      );
    }
    return []; // エラー時は空配列を返す
  }
}
