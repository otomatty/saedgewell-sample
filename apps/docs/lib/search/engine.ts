import * as FlexSearch from 'flexsearch';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import matter from 'gray-matter';
import { searchConfig } from '~/config/search.config';
import { searchLogger } from '~/lib/logger/search';
import { SearchError, SearchErrorCode } from '~/lib/errors/search';
import type {
  SearchResult,
  SearchOptions,
  IndexEntry,
  SearchCache,
} from '~/types/search';

/**
 * 統合検索エンジンクラス
 */
export class SearchEngine {
  private static instance: SearchEngine;
  private flexSearchIndex: FlexSearch.Document | null = null;
  private fileSystemCache: SearchCache | null = null;

  private constructor() {}

  /**
   * シングルトンインスタンスを取得
   */
  public static getInstance(): SearchEngine {
    if (!SearchEngine.instance) {
      SearchEngine.instance = new SearchEngine();
    }
    return SearchEngine.instance;
  }

  /**
   * FlexSearchインデックスを取得
   */
  private async getFlexSearchIndex(): Promise<FlexSearch.Document> {
    if (this.flexSearchIndex) {
      return this.flexSearchIndex;
    }

    try {
      const indexPath = join(process.cwd(), searchConfig.index.path);
      if (!existsSync(indexPath)) {
        throw new SearchError(
          'インデックスファイルが見つかりません',
          SearchErrorCode.INDEX_NOT_FOUND
        );
      }

      const indexData = JSON.parse(readFileSync(indexPath, 'utf-8'));
      // @ts-ignore: FlexSearchの型定義の問題を回避
      this.flexSearchIndex = new FlexSearch.Document({
        tokenize: 'forward',
        // @ts-ignore: FlexSearchの型定義の問題を回避
        document: {
          id: 'id',
          index: ['title', 'description', 'content'],
          store: true,
        },
      });

      // @ts-ignore: FlexSearchの型定義の問題を回避
      this.flexSearchIndex.import(indexData);
      searchLogger.info('FlexSearchインデックスを読み込みました');
      return this.flexSearchIndex;
    } catch (error) {
      if (error instanceof SearchError) {
        throw error;
      }
      throw new SearchError(
        'インデックスの読み込みに失敗しました',
        SearchErrorCode.SEARCH_ENGINE_ERROR,
        error
      );
    }
  }

  /**
   * ファイルシステムの変更を検知
   */
  private hasFileSystemChanges(): boolean {
    if (!this.fileSystemCache || !this.fileSystemCache.fileStats) {
      return true;
    }

    const contentsDir = join(process.cwd(), 'contents');
    return this.checkDirectoryForChanges(
      contentsDir,
      this.fileSystemCache.fileStats
    );
  }

  /**
   * ディレクトリの変更を再帰的にチェック
   */
  private checkDirectoryForChanges(
    dirPath: string,
    fileStats: Record<string, number>
  ): boolean {
    try {
      if (!existsSync(dirPath)) {
        return true;
      }

      const entries = readdirSync(dirPath);
      for (const entry of entries) {
        const entryPath = join(dirPath, entry);
        try {
          const stats = statSync(entryPath);
          if (stats.isDirectory()) {
            if (this.checkDirectoryForChanges(entryPath, fileStats)) {
              return true;
            }
          } else {
            const currentMtime = stats.mtimeMs;
            const cachedMtime = fileStats[entryPath] || 0;
            if (currentMtime > cachedMtime) {
              return true;
            }
          }
        } catch (error) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return true;
    }
  }

  /**
   * 検索を実行
   */
  public async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const { searchMode = 'hybrid', limit = searchConfig.search.maxResults } =
      options;

    if (!query || query.trim().length < searchConfig.search.minQueryLength) {
      return [];
    }

    try {
      switch (searchMode) {
        case 'fast':
          return await this.searchFlexIndex(query.trim(), limit);
        case 'accurate':
          return await this.searchFileSystem(query.trim(), limit);
        default: {
          const [flexResults, fsResults] = await Promise.all([
            this.searchFlexIndex(query.trim(), limit),
            this.searchFileSystem(query.trim(), limit),
          ]);
          return this.mergeResults(flexResults, fsResults, limit);
        }
      }
    } catch (error) {
      searchLogger.error(error as Error);
      throw error;
    }
  }

  /**
   * FlexSearchを使用した検索
   */
  private async searchFlexIndex(
    query: string,
    limit: number
  ): Promise<SearchResult[]> {
    const index = await this.getFlexSearchIndex();
    // @ts-ignore: FlexSearchの型定義の問題を回避
    const results = await Promise.all([
      index.search(query, {
        field: 'title',
        limit,
      }),
      index.search(query, {
        field: 'description',
        limit,
      }),
      index.search(query, {
        field: 'content',
        limit,
      }),
    ]);

    const searchResults = new Map<string, SearchResult>();
    const { baseScores, rankDecayFactor } = searchConfig.scoring;

    // @ts-expect-error FlexSearchの型定義の問題を回避
    results.forEach((result, fieldIndex) => {
      const baseScore =
        fieldIndex === 0
          ? baseScores.title
          : fieldIndex === 1
            ? baseScores.description
            : baseScores.content;

      for (const r of result) {
        // @ts-expect-error FlexSearchの型定義の問題を回避
        const doc = index.get(r.id) as IndexEntry;
        if (doc) {
          const existingResult = searchResults.get(doc.id);
          const score = baseScore - r.index * rankDecayFactor;

          if (!existingResult || existingResult.score < score) {
            searchResults.set(doc.id, {
              ...doc,
              score,
              matchedContent: this.createExcerpt(doc.content, query),
            });
          }
        }
      }
    });

    return Array.from(searchResults.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * ファイルシステムを使用した検索
   */
  private async searchFileSystem(
    query: string,
    limit: number
  ): Promise<SearchResult[]> {
    // キャッシュの有効性をチェック
    const now = Date.now();
    if (
      this.fileSystemCache &&
      now - this.fileSystemCache.timestamp < searchConfig.cache.ttl &&
      !this.hasFileSystemChanges()
    ) {
      return this.searchInCache(query, limit);
    }

    // キャッシュの再構築
    await this.rebuildFileSystemCache();
    return this.searchInCache(query, limit);
  }

  /**
   * キャッシュ内を検索
   */
  private searchInCache(query: string, limit: number): SearchResult[] {
    if (!this.fileSystemCache) {
      throw new SearchError(
        'キャッシュが利用できません',
        SearchErrorCode.CACHE_ERROR
      );
    }

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();
    const { baseScores } = searchConfig.scoring;

    for (const [id, entry] of Object.entries(this.fileSystemCache.index)) {
      let score = 0;
      let matchedContent: string | undefined;

      // タイトルマッチ
      if (entry.title.toLowerCase().includes(searchTerm)) {
        score = Math.max(score, baseScores.title);
      }

      // 説明文マッチ
      if (entry.description.toLowerCase().includes(searchTerm)) {
        score = Math.max(score, baseScores.description);
      }

      // コンテンツマッチ
      if (entry.content.toLowerCase().includes(searchTerm)) {
        score = Math.max(score, baseScores.content);
        matchedContent = this.createExcerpt(entry.content, query);
      }

      if (score > 0) {
        results.push({
          ...entry,
          score,
          matchedContent,
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * 検索結果をマージ
   */
  private mergeResults(
    flexResults: SearchResult[],
    fsResults: SearchResult[],
    limit: number
  ): SearchResult[] {
    const mergedMap = new Map<string, SearchResult>();

    // FlexSearch結果の追加
    for (const result of flexResults) {
      mergedMap.set(result.id, result);
    }

    // ファイルシステム結果の追加（スコアが高い場合のみ上書き）
    for (const result of fsResults) {
      const existing = mergedMap.get(result.id);
      if (!existing || existing.score < result.score) {
        mergedMap.set(result.id, result);
      }
    }

    return Array.from(mergedMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * 抜粋を作成
   */
  private createExcerpt(content: string, query: string): string {
    const index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return '';

    const start = Math.max(0, index - searchConfig.search.contextLength);
    const end = Math.min(
      content.length,
      index + query.length + searchConfig.search.contextLength
    );

    return `...${content.substring(start, end)}...`;
  }

  /**
   * ファイルシステムキャッシュを再構築
   */
  private async rebuildFileSystemCache(): Promise<void> {
    // キャッシュ再構築の実装
    // 既存の実装を参考に、ファイルシステムからデータを読み込む
    // この実装は別のPRで提供します
  }
}
