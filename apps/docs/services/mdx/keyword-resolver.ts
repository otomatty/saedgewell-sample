import {
  type DocumentMapping,
  type ResolvedKeyword,
  KeywordErrorType,
  type Document,
} from '../../types/mdx';
import { ContextMatcher } from './context-matcher';
import { PriorityResolver } from './priority-resolver';
import { PathResolver } from '../../lib/mdx/path-resolver';

/**
 * キーワードリンク解決の設定
 */
export interface KeywordResolverConfig {
  /**
   * ベースパス
   */
  basePath?: string;
  /**
   * エイリアス
   */
  aliases?: Record<string, string[]>;
  /**
   * コンテキストマッチングを有効にするか
   */
  enableContextMatching?: boolean;
  /**
   * 解決戦略
   * - strict: 完全一致のみ
   * - fuzzy: あいまい一致も許容
   * - adaptive: コンテキストに応じて戦略を変更
   */
  resolveStrategy?: 'strict' | 'fuzzy' | 'adaptive';
  /**
   * 最大候補数
   */
  maxCandidates?: number;
  /**
   * 最小類似度スコア
   */
  minSimilarityScore?: number;
}

/**
 * キーワードリンク解決クラス
 */
export class KeywordResolver {
  private documentMapper: DocumentMapping;
  private contextMatcher: ContextMatcher | null = null;
  private priorityResolver: PriorityResolver;
  private pathResolver: PathResolver;
  private config: Required<KeywordResolverConfig>;
  private currentContext: string[] = [];

  /**
   * コンストラクタ
   * @param documentMapper ドキュメントマッピング
   * @param config 設定
   */
  constructor(
    documentMapper: DocumentMapping,
    config: KeywordResolverConfig = {}
  ) {
    this.documentMapper = documentMapper;
    this.config = {
      basePath: config.basePath || '',
      aliases: config.aliases || {},
      enableContextMatching:
        config.enableContextMatching !== undefined
          ? config.enableContextMatching
          : true,
      resolveStrategy: config.resolveStrategy || 'adaptive',
      maxCandidates: config.maxCandidates || 5,
      minSimilarityScore: config.minSimilarityScore || 0.7,
    };

    this.priorityResolver = new PriorityResolver();
    this.pathResolver = new PathResolver(this.config.basePath);

    if (this.config.enableContextMatching) {
      this.contextMatcher = new ContextMatcher();
    }
  }

  /**
   * コンテキストを設定する
   * @param context コンテキスト
   */
  setContext(context: string[]): void {
    this.currentContext = context;
  }

  /**
   * キーワードを解決する
   * @param keyword キーワード
   * @returns 解決されたキーワード
   */
  resolveKeyword(keyword: string): ResolvedKeyword {
    // エイリアスを確認
    const keywordToUse = this.resolveAlias(keyword);

    // 解決戦略を決定
    const strategy = this.determineStrategy(keywordToUse);

    // ドキュメントを検索
    let documents = this.findDocuments(keywordToUse, strategy);

    // 候補がない場合
    if (documents.length === 0) {
      return {
        keyword: keywordToUse,
        resolved: false,
        error: {
          type: KeywordErrorType.NOT_FOUND,
          message: `キーワード "${keywordToUse}" に一致するドキュメントが見つかりません`,
        },
      };
    }

    // コンテキストマッチングを適用
    if (
      this.config.enableContextMatching &&
      this.contextMatcher &&
      this.currentContext.length > 0
    ) {
      documents = this.contextMatcher.rankByContext(
        documents,
        this.currentContext
      );
    }

    // 優先度でランク付け
    documents = this.priorityResolver.rankDocuments(documents);

    // 候補数を制限
    documents = documents.slice(0, this.config.maxCandidates);

    // 複数の候補がある場合
    if (documents.length > 1) {
      return {
        keyword: keywordToUse,
        resolved: true,
        candidates: documents.map((doc) => ({
          title: doc.title,
          path: this.pathResolver.resolvePath(doc.path),
          score: doc.score || 0,
        })),
      };
    }

    // 単一の候補がある場合
    if (documents.length === 1 && documents[0]) {
      const doc = documents[0];
      return {
        keyword: keywordToUse,
        resolved: true,
        path: this.pathResolver.resolvePath(doc.path),
        title: doc.title,
      };
    }

    // 候補がない場合（通常はここには到達しないはず）
    return {
      keyword: keywordToUse,
      resolved: false,
      error: {
        type: KeywordErrorType.NOT_FOUND,
        message: `キーワード "${keywordToUse}" に一致するドキュメントが見つかりません`,
      },
    };
  }

  /**
   * エイリアスを解決する
   * @param keyword キーワード
   * @returns 解決されたキーワード
   */
  private resolveAlias(keyword: string): string {
    // エイリアスを確認
    for (const [key, aliases] of Object.entries(this.config.aliases)) {
      if (aliases.includes(keyword.toLowerCase())) {
        return key;
      }
    }
    return keyword;
  }

  /**
   * 解決戦略を決定する
   * @param keyword キーワード
   * @returns 解決戦略
   */
  private determineStrategy(keyword: string): 'strict' | 'fuzzy' {
    if (this.config.resolveStrategy === 'strict') {
      return 'strict';
    }

    if (this.config.resolveStrategy === 'fuzzy') {
      return 'fuzzy';
    }

    // adaptive戦略の場合
    // キーワードが短い場合は厳密一致、長い場合はあいまい一致
    return keyword.length < 4 ? 'strict' : 'fuzzy';
  }

  /**
   * ドキュメントを検索する
   * @param keyword キーワード
   * @param strategy 解決戦略
   * @returns ドキュメントリスト
   */
  private findDocuments(
    keyword: string,
    strategy: 'strict' | 'fuzzy'
  ): Document[] {
    if (strategy === 'strict') {
      // @ts-expect-error - DocumentMappingItemとDocumentの互換性の問題
      return this.documentMapper.filter(
        (doc) =>
          doc.keywords?.some(
            (k) => k.toLowerCase() === keyword.toLowerCase()
          ) || doc.title.toLowerCase() === keyword.toLowerCase()
      );
    }

    // あいまい一致の場合
    // @ts-expect-error - DocumentMappingItemとDocumentの互換性の問題
    return this.documentMapper.filter((doc) => {
      // キーワードに一致
      const keywordMatch = doc.keywords?.some(
        (k) =>
          k.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(k.toLowerCase())
      );

      // タイトルに一致
      const titleMatch =
        doc.title.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(doc.title.toLowerCase());

      return keywordMatch || titleMatch;
    });
  }
}
