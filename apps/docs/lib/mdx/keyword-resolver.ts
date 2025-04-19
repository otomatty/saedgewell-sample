import type {
  DocumentMapping,
  DocumentMappingItem,
  ResolvedKeyword,
} from '~/types/mdx';
import { KeywordResolutionError, errorReporter } from './errors';
import { AliasResolver, PathResolver } from './path-resolver';
import {
  PriorityBasedResolver,
  PriorityCriteria,
  type DocumentMatch,
  type ResolverConfig,
} from './priority-resolver';
import { ContextMatcher } from '~/services/mdx/context-matcher';

/**
 * キーワードリンク解決設定
 */
export interface KeywordResolverConfig extends ResolverConfig {
  basePath: string;
  aliases?: { alias: string; path: string }[];
  enableContextMatching?: boolean;
  enablePriorityMatching?: boolean;
  maxRelatedKeywords?: number;
  enableRelatedKeywords?: boolean;
  resolveStrategy?: 'strict' | 'fuzzy' | 'adaptive';
}

/**
 * 解決戦略
 * - strict: 厳密一致のみ
 * - fuzzy: あいまい一致を許容
 * - adaptive: コンテキストに応じて戦略を変更
 */
type ResolveStrategy = 'strict' | 'fuzzy' | 'adaptive';

/**
 * キーワードリンク解決クラス
 * 複数の解決ロジックを組み合わせてキーワードを解決する
 */
export class KeywordResolver {
  private documentMapping: DocumentMapping;
  private contextMatcher: ContextMatcher;
  private priorityResolver: PriorityBasedResolver;
  private pathResolver: PathResolver;
  private aliasResolver: AliasResolver;
  private config: KeywordResolverConfig;
  private resolveStrategy: ResolveStrategy;
  private userHistory: Map<string, number> = new Map(); // キーワード使用履歴

  /**
   * コンストラクタ
   * @param documentMapping ドキュメントマッピング
   * @param config 設定
   */
  constructor(documentMapping: DocumentMapping, config: KeywordResolverConfig) {
    this.documentMapping = documentMapping;
    this.config = {
      ...config,
      maxRelatedKeywords: config.maxRelatedKeywords || 5,
      enableRelatedKeywords: config.enableRelatedKeywords ?? true,
    };
    this.resolveStrategy = config.resolveStrategy || 'adaptive';
    this.contextMatcher = new ContextMatcher();
    this.priorityResolver = new PriorityBasedResolver(config);
    this.pathResolver = new PathResolver(config.basePath);
    this.aliasResolver = new AliasResolver(config.aliases || []);

    // デフォルトの優先度基準を設定
    if (config.enablePriorityMatching) {
      this.priorityResolver.setEnabledCriteria([
        PriorityCriteria.DOC_TYPE,
        PriorityCriteria.RELEVANCE,
        PriorityCriteria.RECENCY,
      ]);
    }
  }

  /**
   * キーワードを解決
   * @param keyword キーワード
   * @param docType オプションのドキュメントタイプ
   * @param context 現在のドキュメントコンテキスト（オプション）
   */
  async resolveKeyword(
    keyword: string,
    docType?: string,
    context?: string
  ): Promise<ResolvedKeyword> {
    try {
      // キーワード使用履歴を更新
      this.updateKeywordUsage(keyword);

      // 3. ドキュメントマッパーで解決を試みる
      try {
        // ドキュメントマッピングからキーワードに一致するドキュメントを検索
        const matchingDocuments = this.findMatchingDocuments(keyword, docType);

        const documents = matchingDocuments || [];

        if (documents.length === 0) {
          return {
            keyword,
            docType,
            isAmbiguous: false,
            error: `キーワード "${keyword}" に一致するドキュメントが見つかりませんでした。`,
          };
        }

        // コンテキストを設定
        this.contextMatcher.setContext(context || '');

        // 複数の解決ロジックを適用してドキュメントをランク付け
        const rankedDocuments = await this.rankDocuments(
          documents,
          keyword,
          docType,
          context,
          this.determineStrategy(keyword, context)
        );

        if (rankedDocuments.length > 0) {
          const firstMatch = rankedDocuments[0];
          if (!firstMatch) {
            return {
              keyword,
              docType,
              isAmbiguous: false,
              error: 'マッチするドキュメントが見つかりませんでした。',
            };
          }

          const bestMatch = firstMatch.document;
          const alternatives = rankedDocuments
            .slice(1)
            .map((match) => match.document);

          // パスを解決
          const resolvedPath = this.resolvePath(bestMatch.path);

          // 関連キーワードを抽出（コンテキストが存在する場合のみ）
          let relatedKeywords: string[] | undefined;
          if (this.config.enableRelatedKeywords && context) {
            relatedKeywords = this.contextMatcher.extractRelatedKeywords(
              keyword,
              documents,
              this.config.maxRelatedKeywords || 5
            );
          }

          return {
            keyword,
            docType,
            mapping: {
              ...bestMatch,
              path: resolvedPath,
            },
            isAmbiguous: alternatives.length > 0,
            alternatives: alternatives.length > 0 ? alternatives : undefined,
            relatedKeywords: relatedKeywords?.length
              ? relatedKeywords
              : undefined,
          };
        }

        // 候補がない場合はエラーを返す
        return {
          keyword,
          docType,
          isAmbiguous: false,
          error: `キーワード "${keyword}" に一致するドキュメントが見つかりませんでした。`,
        };
      } catch (error) {
        // エラーを報告して詳細情報を返す
        if (error instanceof KeywordResolutionError) {
          errorReporter.report(error);
          return {
            keyword,
            docType,
            isAmbiguous: false,
            error: error.message,
          };
        }

        // その他のエラー
        const message = error instanceof Error ? error.message : String(error);
        errorReporter.report(
          new KeywordResolutionError(
            'UNKNOWN',
            `キーワード解決中にエラーが発生しました: ${message}`
          )
        );

        return {
          keyword,
          docType,
          isAmbiguous: false,
          error: `キーワード解決中にエラーが発生しました: ${message}`,
        };
      }
    } catch (error) {
      // エラーを報告して詳細情報を返す
      if (error instanceof KeywordResolutionError) {
        errorReporter.report(error);
        return {
          keyword,
          docType,
          isAmbiguous: false,
          error: error.message,
        };
      }

      // その他のエラー
      const message = error instanceof Error ? error.message : String(error);
      errorReporter.report(
        new KeywordResolutionError(
          'UNKNOWN',
          `キーワード解決中にエラーが発生しました: ${message}`
        )
      );

      return {
        keyword,
        docType,
        isAmbiguous: false,
        error: `キーワード解決中にエラーが発生しました: ${message}`,
      };
    }
  }

  /**
   * 解決戦略を決定
   * @param keyword キーワード
   * @param context コンテキスト
   */
  private determineStrategy(
    keyword: string,
    context?: string
  ): ResolveStrategy {
    // 設定で固定されている場合はその戦略を使用
    if (this.resolveStrategy !== 'adaptive') {
      return this.resolveStrategy;
    }

    // 適応的な戦略決定
    // 1. キーワードが短い（3文字以下）場合は厳密一致
    if (keyword.length <= 3) {
      return 'strict';
    }

    // 2. コンテキストがない場合は厳密一致
    if (!context) {
      return 'strict';
    }

    // 3. キーワードの使用頻度が高い場合は厳密一致
    const usageCount = this.userHistory.get(keyword.toLowerCase()) || 0;
    if (usageCount > 5) {
      return 'strict';
    }

    // 4. それ以外はあいまい一致
    return 'fuzzy';
  }

  /**
   * キーワードの使用履歴を更新
   * @param keyword キーワード
   */
  private updateKeywordUsage(keyword: string): void {
    const key = keyword.toLowerCase();
    const count = (this.userHistory.get(key) || 0) + 1;
    this.userHistory.set(key, count);

    // 履歴が大きくなりすぎないように制限
    if (this.userHistory.size > 100) {
      // 最も古いエントリを削除
      const oldestKey = this.userHistory.keys().next().value;
      if (oldestKey) {
        this.userHistory.delete(oldestKey);
      }
    }
  }

  /**
   * 複数の解決ロジックを適用してドキュメントをランク付け
   * @param documents ドキュメント一覧
   * @param keyword キーワード
   * @param docType ドキュメントタイプ（オプション）
   * @param context コンテキスト（オプション）
   * @param strategy 解決戦略
   */
  private async rankDocuments(
    documents: DocumentMapping,
    keyword: string,
    docType?: string,
    context?: string,
    strategy: ResolveStrategy = 'adaptive'
  ): Promise<DocumentMatch[]> {
    // 1. 戦略に基づいてフィルタリング
    let filteredDocuments = documents;
    if (strategy === 'strict') {
      // 厳密一致の場合、完全一致するものだけを残す
      filteredDocuments = documents.filter(
        (doc) =>
          doc.keywords?.some(
            (k) => k.toLowerCase() === keyword.toLowerCase()
          ) || doc.metadata.title.toLowerCase() === keyword.toLowerCase()
      );

      // 厳密一致がない場合は元のリストを使用
      if (filteredDocuments.length === 0) {
        filteredDocuments = documents;
      }
    }

    // 2. コンテキスト考慮型マッチングを適用（オプション）
    let rankedDocuments = filteredDocuments;
    if (this.config.enableContextMatching && context) {
      rankedDocuments = this.contextMatcher.sortByContextRelevance(
        keyword,
        filteredDocuments
      );
    }

    // 3. ドキュメントマッチオブジェクトに変換
    const matches: DocumentMatch[] = rankedDocuments.map((doc, index) => ({
      document: doc,
      score: rankedDocuments.length - index, // インデックスが小さいほどスコアが高い
      docType: doc.docType,
    }));

    // 4. 優先度に基づくソートを適用（オプション）
    if (this.config.enablePriorityMatching) {
      return this.priorityResolver.sortByPriority(matches);
    }

    return matches;
  }

  /**
   * パスを解決
   * @param path 解決するパス
   */
  private resolvePath(path: string): string {
    // 1. エイリアスを解決
    const pathWithoutAlias = this.aliasResolver.resolveAlias(path);

    // 2. 相対パスを解決
    return this.pathResolver.resolveRelativePath('', pathWithoutAlias);
  }

  /**
   * 優先度を設定
   * @param docType ドキュメントタイプ
   * @param priority 優先度
   */
  setPriority(docType: string, priority: number): void {
    this.priorityResolver.setPriority(docType, priority);
  }

  /**
   * コンテキストを設定
   * @param context コンテキスト
   */
  setContext(context: string): void {
    this.contextMatcher.setContext(context);
  }

  /**
   * 解決戦略を設定
   * @param strategy 解決戦略
   */
  setResolveStrategy(strategy: ResolveStrategy): void {
    this.resolveStrategy = strategy;
  }

  /**
   * 優先度の基準を設定
   * @param criteria 有効にする基準の配列
   */
  setPriorityCriteria(criteria: PriorityCriteria[]): void {
    this.priorityResolver.setEnabledCriteria(criteria);
  }

  /**
   * 基準の重みを設定
   * @param criteria 基準
   * @param weight 重み（0-1の範囲）
   */
  setCriteriaWeight(criteria: PriorityCriteria, weight: number): void {
    this.priorityResolver.setCriteriaWeight(criteria, weight);
  }

  /**
   * ユーザー設定による優先度を設定
   * @param docType ドキュメントタイプ
   * @param preference 優先度（-1から1の範囲）
   */
  setUserPreference(docType: string, preference: number): void {
    this.priorityResolver.setUserPreference(docType, preference);
  }

  /**
   * 人気度スコアを設定
   * @param path ドキュメントパス
   * @param score 人気度スコア（0-1の範囲）
   */
  setPopularityScore(path: string, score: number): void {
    this.priorityResolver.setPopularityScore(path, score);
  }

  /**
   * 設定をリセット
   */
  reset(): void {
    this.priorityResolver.resetAll();
    this.userHistory.clear();
    this.resolveStrategy = this.config.resolveStrategy || 'adaptive';
  }

  /**
   * ドキュメントマッピングからキーワードに一致するドキュメントを検索
   * @param keyword キーワード
   * @param docType オプションのドキュメントタイプ
   * @returns マッチするドキュメントの配列
   */
  private findMatchingDocuments(
    keyword: string,
    docType?: string
  ): DocumentMappingItem[] {
    // 大文字小文字を区別せずにキーワードを正規化
    const normalizedKeyword = keyword.toLowerCase().trim();

    return this.documentMapping.filter((doc) => {
      // タイトルが一致するか確認
      const titleMatch = doc.title.toLowerCase() === normalizedKeyword;

      // ドキュメントタイプが指定されていれば、それも一致するか確認
      const typeMatch = !docType || doc.docType === docType;

      // キーワードが一致するか確認
      const keywordMatch = doc.keywords?.some(
        (k) => k.toLowerCase() === normalizedKeyword
      );

      return (titleMatch || keywordMatch) && typeMatch;
    });
  }
}
