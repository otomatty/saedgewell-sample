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
 * 統合検索エンジンクラス (ファイルシステムベース)
 */
export class SearchEngine {
  private static instance: SearchEngine;
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
   * ファイルシステムの変更を検知
   */
  private hasFileSystemChanges(): boolean {
    if (!this.fileSystemCache || !this.fileSystemCache.fileStats) {
      searchLogger.debug('Cache or fileStats missing, assuming changes.');
      return true;
    }
    searchLogger.debug('Checking for file system changes...');
    const contentsDir = join(process.cwd(), 'contents');
    return this.checkDirectoryForChanges(
      contentsDir,
      this.fileSystemCache.fileStats
    );
  }

  /**
   * ディレクトリの変更を再帰的にチェック
   * @param dirPath チェックするディレクトリのパス
   * @param fileStats キャッシュされたファイル/ディレクトリの最終更新時刻
   * @param checkedPaths 循環参照を防ぐためにチェック済みのパスを記録するSet（内部利用）
   * @returns 変更があった場合は true, なければ false
   */
  private checkDirectoryForChanges(
    dirPath: string,
    fileStats: Record<string, number>,
    checkedPaths: Set<string> = new Set()
  ): boolean {
    if (checkedPaths.has(dirPath)) {
      searchLogger.warn(
        `Circular reference detected or already checked: ${dirPath}`
      );
      return false;
    }
    checkedPaths.add(dirPath);

    try {
      if (!existsSync(dirPath)) {
        if (fileStats[dirPath]) {
          searchLogger.debug(`Directory deleted: ${dirPath}`);
          return true;
        }
        return false;
      }

      try {
        const dirStats = statSync(dirPath);
        const currentDirMtime = dirStats.mtimeMs;
        const cachedDirMtime = fileStats[dirPath] || 0;
        if (currentDirMtime > cachedDirMtime) {
          searchLogger.debug(`Directory mtime changed: ${dirPath}`);
          return true;
        }
      } catch (statError) {
        searchLogger.warn(
          `Error stating directory ${dirPath}: ${statError instanceof Error ? statError.message : statError}`
        );
        return true;
      }

      const entries = readdirSync(dirPath);
      const currentEntryPaths = new Set<string>();

      for (const entry of entries) {
        const entryPath = join(dirPath, entry);
        currentEntryPaths.add(entryPath);

        try {
          const stats = statSync(entryPath);
          const isDirectory = stats.isDirectory();
          const currentMtime = stats.mtimeMs;
          const cachedMtime = fileStats[entryPath] || 0;

          if (!fileStats[entryPath] || currentMtime > cachedMtime) {
            if (!fileStats[entryPath])
              searchLogger.debug(`New file/directory detected: ${entryPath}`);
            else
              searchLogger.debug(`File/directory mtime changed: ${entryPath}`);
            return true;
          }

          if (isDirectory) {
            if (
              this.checkDirectoryForChanges(entryPath, fileStats, checkedPaths)
            ) {
              return true;
            }
          }
        } catch (error) {
          searchLogger.warn(
            `Error stating file/directory ${entryPath}: ${error instanceof Error ? error.message : error}`
          );
          return true;
        }
      }

      for (const cachedPath in fileStats) {
        if (
          cachedPath.startsWith(`${dirPath}/`) &&
          !cachedPath.substring(dirPath.length + 1).includes('/')
        ) {
          if (!currentEntryPaths.has(cachedPath)) {
            searchLogger.debug(`File/directory deleted: ${cachedPath}`);
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      searchLogger.error(
        error instanceof Error
          ? error
          : new Error(
              `Error checking directory changes for ${dirPath}: ${String(error)}`
            )
      );
      return true;
    }
  }

  /**
   * 検索を実行 (ファイルシステム検索のみ)
   */
  public async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const { limit = searchConfig.search.maxResults } = options;

    if (!query || query.trim().length < searchConfig.search.minQueryLength) {
      return [];
    }

    try {
      return await this.searchFileSystem(query.trim(), limit);
    } catch (error) {
      searchLogger.error(
        error instanceof Error ? error : new Error(String(error))
      );
      return [];
    }
  }

  /**
   * ファイルシステムを使用した検索
   */
  private async searchFileSystem(
    query: string,
    limit: number
  ): Promise<SearchResult[]> {
    const now = Date.now();
    const isCacheStale =
      this.fileSystemCache &&
      now - this.fileSystemCache.timestamp >= searchConfig.cache.ttl;
    const fsChanges = this.fileSystemCache ? this.hasFileSystemChanges() : true;
    const needsRebuild = !this.fileSystemCache || isCacheStale || fsChanges;

    searchLogger.debug(
      `Cache check: Exists=${!!this.fileSystemCache}, Stale=${isCacheStale}, FS Changes=${fsChanges}`
    );

    if (needsRebuild) {
      searchLogger.info(
        `Rebuilding file system cache. Reason: ${!this.fileSystemCache ? 'No cache' : ''}${isCacheStale ? ' TTL expired' : ''}${fsChanges ? ' File system changes detected' : ''}`
      );
      try {
        await this.rebuildFileSystemCache();
      } catch (rebuildError) {
        searchLogger.warn(
          'Failed to rebuild file system cache. Search might use stale data or fail.'
        );
        searchLogger.error(
          rebuildError instanceof Error
            ? rebuildError
            : new Error(String(rebuildError))
        );
        if (!this.fileSystemCache) {
          throw new SearchError(
            'Initial cache build failed',
            SearchErrorCode.CACHE_ERROR,
            rebuildError instanceof Error ? rebuildError : undefined
          );
        }
        searchLogger.warn(
          'Proceeding with potentially stale cache after rebuild failure.'
        );
      }
    } else {
      searchLogger.info('Using valid file system cache for search.');
    }

    if (!this.fileSystemCache) {
      searchLogger.error(
        new SearchError(
          'Cache is unavailable for searching.',
          SearchErrorCode.CACHE_ERROR
        )
      );
      throw new SearchError('Cache unavailable', SearchErrorCode.CACHE_ERROR);
    }

    return this.searchInCache(query, limit);
  }

  /**
   * キャッシュ内を検索
   */
  private searchInCache(query: string, limit: number): SearchResult[] {
    if (!this.fileSystemCache) {
      searchLogger.error(
        new SearchError(
          'Attempted to search but cache is null.',
          SearchErrorCode.CACHE_ERROR
        )
      );
      return [];
    }
    const cache = this.fileSystemCache;

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();
    const { baseScores } = searchConfig.scoring;

    searchLogger.debug(
      `Searching in cache for query: "${query}" (term: "${searchTerm}") with limit ${limit}`
    );

    for (const [id, entry] of Object.entries(cache.index)) {
      let score = 0;
      let matchedContent: string | undefined;
      let matchFound = false;

      if (entry.title.toLowerCase().includes(searchTerm)) {
        score = Math.max(score, baseScores.title);
        matchFound = true;
        searchLogger.debug(`Match found in title for ID ${id}`);
      }

      if (entry.description?.toLowerCase().includes(searchTerm)) {
        score = Math.max(score, baseScores.description);
        matchFound = true;
        searchLogger.debug(`Match found in description for ID ${id}`);
      }

      if (entry.content.toLowerCase().includes(searchTerm)) {
        score = Math.max(score, baseScores.content);
        matchedContent = this.createExcerpt(entry.content, query);
        matchFound = true;
        searchLogger.debug(`Match found in content for ID ${id}`);
      }

      if (matchFound) {
        results.push({
          ...entry,
          score,
          matchedContent,
        });
      }
    }

    searchLogger.debug(
      `Found ${results.length} potential matches in cache before sorting and limiting.`
    );

    const sortedResults = results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    searchLogger.debug(
      `Returning ${sortedResults.length} results after sorting and limiting.`
    );
    return sortedResults;
  }

  /**
   * 抜粋を作成
   */
  private createExcerpt(content: string, query: string): string {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);
    if (index === -1) {
      return '';
    }

    const start = Math.max(0, index - searchConfig.search.contextLength);
    const end = Math.min(
      content.length,
      index + query.length + searchConfig.search.contextLength
    );

    const prefix = start > 0 ? '...' : '';
    const suffix = end < content.length ? '...' : '';

    return `${prefix}${content.substring(start, end)}${suffix}`;
  }

  /**
   * ファイルシステムキャッシュを再構築
   */
  private async rebuildFileSystemCache(): Promise<void> {
    searchLogger.info('Starting file system cache rebuild...');
    const startTime = Date.now();
    const newCache: SearchCache = {
      index: {},
      fileStats: {},
      timestamp: startTime,
    };
    const contentsDir = join(process.cwd(), 'contents');

    try {
      if (!existsSync(contentsDir)) {
        const error = new SearchError(
          `Content directory not found: ${contentsDir}`,
          SearchErrorCode.INDEX_NOT_FOUND
        );
        searchLogger.error(error);
        throw error;
      }
      await this.scanDirectoryRecursive(contentsDir, newCache);
      this.fileSystemCache = newCache;
      const endTime = Date.now();
      searchLogger.info(
        `File system cache rebuilt successfully in ${endTime - startTime}ms. Found ${Object.keys(newCache.index).length} index entries and ${Object.keys(newCache.fileStats).length} file stats.`
      );
    } catch (error) {
      const message = `Error during cache rebuild: ${error instanceof Error ? error.message : String(error)}`;
      searchLogger.warn(message);
      searchLogger.error(
        error instanceof Error ? error : new Error(String(error))
      );
      throw new SearchError(
        'Cache rebuild failed',
        SearchErrorCode.CACHE_ERROR,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * ディレクトリを再帰的にスキャンしてキャッシュエントリを構築
   */
  private async scanDirectoryRecursive(
    dirPath: string,
    cache: SearchCache,
    scannedPaths: Set<string> = new Set()
  ): Promise<void> {
    if (scannedPaths.has(dirPath)) {
      searchLogger.warn(
        `Skipping already scanned directory to prevent recursion: ${dirPath}`
      );
      return;
    }
    scannedPaths.add(dirPath);

    try {
      const dirStats = statSync(dirPath);
      cache.fileStats[dirPath] = dirStats.mtimeMs;
    } catch (statError) {
      searchLogger.warn(
        `Could not stat directory ${dirPath}: ${statError instanceof Error ? statError.message : statError}`
      );
      return;
    }

    const entries = readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = join(dirPath, entry.name);
      try {
        const stats = statSync(entryPath);
        cache.fileStats[entryPath] = stats.mtimeMs;

        if (entry.isDirectory()) {
          await this.scanDirectoryRecursive(entryPath, cache, scannedPaths);
        } else if (
          entry.isFile() &&
          (extname(entry.name) === '.md' || extname(entry.name) === '.mdx')
        ) {
          try {
            const fileContent = readFileSync(entryPath, 'utf-8');
            const { data, content } = matter(fileContent);

            const relativePath = entryPath.substring(
              join(process.cwd(), 'contents').length + 1
            );
            const id = relativePath.replace(/\.(md|mdx)$/, '');

            const title =
              typeof data.title === 'string'
                ? data.title
                : entry.name.replace(/\.(md|mdx)$/, '');
            const description =
              typeof data.description === 'string' ? data.description : '';
            const path = typeof data.slug === 'string' ? data.slug : `/${id}`;
            const category =
              typeof data.category === 'string' ? data.category : '';
            const sourceType = 'content';

            const indexEntry: IndexEntry = {
              id,
              title,
              description,
              content: content,
              path: path,
              category: category,
              sourceType: sourceType,
            };

            cache.index[id] = indexEntry;
          } catch (parseError) {
            searchLogger.warn(
              `Failed to read or parse file ${entryPath}: ${parseError instanceof Error ? parseError.message : String(parseError)}`
            );
          }
        } else {
          // Handle other file types if necessary
        }
      } catch (statError) {
        searchLogger.warn(
          `Could not access ${entryPath} during scan: ${statError instanceof Error ? statError.message : String(statError)}`
        );
      }
    }
  }

  /**
   * TODO: スコアリングロジックの改善 (単語の位置、完全一致ボーナスなど) を検討
   */
}
