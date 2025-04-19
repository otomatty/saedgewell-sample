import type { DocumentMappingItem } from '~/types/mdx';

/**
 * ドキュメント優先度設定
 * ドキュメントの種類ごとに優先度を設定
 */
export interface DocumentPriority {
  docType: string;
  priorityLevel: number;
}

/**
 * 優先度の基準
 * 優先度の計算方法を定義
 */
export enum PriorityCriteria {
  DOC_TYPE = 'docType', // ドキュメントタイプによる優先度
  RECENCY = 'recency', // 最終更新日による優先度
  POPULARITY = 'popularity', // 人気度（アクセス数など）による優先度
  RELEVANCE = 'relevance', // 関連度による優先度
  CUSTOM = 'custom', // カスタム優先度
}

/**
 * 解決設定
 */
export interface ResolverConfig {
  documentPriorities?: DocumentPriority[];
  defaultPriority?: number;
  enabledCriteria?: PriorityCriteria[];
  criteriaWeights?: Record<PriorityCriteria, number>;
  userPreferences?: Record<string, number>; // ユーザー設定による優先度
}

/**
 * マッチング結果インターフェース
 * ドキュメントとマッチングスコアを含む
 */
export interface DocumentMatch {
  document: DocumentMappingItem;
  score: number;
  docType: string;
}

/**
 * 優先度に基づくマッチング
 * ドキュメントタイプと一致度に基づいてマッチングを行う
 */
export class PriorityBasedResolver {
  private priorities: DocumentPriority[];
  private defaultPriority: number;
  private enabledCriteria: PriorityCriteria[];
  private criteriaWeights: Record<PriorityCriteria, number>;
  private userPreferences: Record<string, number>;
  private popularityScores: Map<string, number> = new Map();

  constructor(config: ResolverConfig = {}) {
    this.priorities = config.documentPriorities || [];
    this.defaultPriority = config.defaultPriority || 0;
    this.enabledCriteria = config.enabledCriteria || [
      PriorityCriteria.DOC_TYPE,
    ];
    this.criteriaWeights = config.criteriaWeights || {
      [PriorityCriteria.DOC_TYPE]: 1.0,
      [PriorityCriteria.RECENCY]: 0.7,
      [PriorityCriteria.POPULARITY]: 0.5,
      [PriorityCriteria.RELEVANCE]: 0.8,
      [PriorityCriteria.CUSTOM]: 0.6,
    };
    this.userPreferences = config.userPreferences || {};
  }

  /**
   * 優先度に基づいてマッチングをソート
   * @param matches マッチング結果
   */
  sortByPriority(matches: DocumentMatch[]): DocumentMatch[] {
    return matches.sort((a, b) => {
      // 複数の基準を組み合わせた総合スコアを計算
      const aScore = this.calculateCombinedScore(a);
      const bScore = this.calculateCombinedScore(b);

      // 総合スコアが同じ場合は元のスコアで比較
      if (aScore === bScore) {
        return b.score - a.score;
      }

      return bScore - aScore;
    });
  }

  /**
   * 複数の基準を組み合わせた総合スコアを計算
   * @param match マッチング結果
   */
  private calculateCombinedScore(match: DocumentMatch): number {
    let totalScore = 0;
    let totalWeight = 0;

    // 有効な各基準に対してスコアを計算
    for (const criteria of this.enabledCriteria) {
      const weight = this.criteriaWeights[criteria];
      totalWeight += weight;

      switch (criteria) {
        case PriorityCriteria.DOC_TYPE:
          totalScore += this.getPriorityLevel(match.docType) * weight;
          break;
        case PriorityCriteria.RECENCY:
          totalScore += this.getRecencyScore(match.document) * weight;
          break;
        case PriorityCriteria.POPULARITY:
          totalScore += this.getPopularityScore(match.document) * weight;
          break;
        case PriorityCriteria.RELEVANCE:
          totalScore += match.score * weight;
          break;
        case PriorityCriteria.CUSTOM:
          totalScore += this.getCustomScore(match.document) * weight;
          break;
      }
    }

    // 重みの合計で正規化
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * ドキュメントタイプの優先度を取得
   * @param docType ドキュメントタイプ
   */
  private getPriorityLevel(docType: string): number {
    const priority = this.priorities.find((p) => p.docType === docType);
    return priority ? priority.priorityLevel : this.defaultPriority;
  }

  /**
   * 最終更新日に基づくスコアを計算
   * 新しいドキュメントほど高いスコア
   * @param document ドキュメント
   */
  private getRecencyScore(document: DocumentMappingItem): number {
    const lastModified = document.metadata.lastModified;
    if (!lastModified) return 0;

    const modifiedDate = new Date(lastModified);
    const now = new Date();
    const ageInDays =
      (now.getTime() - modifiedDate.getTime()) / (1000 * 60 * 60 * 24);

    // 30日以内の更新は高いスコア、それ以降は徐々に下がる
    return Math.max(0, 1 - ageInDays / 30);
  }

  /**
   * 人気度に基づくスコアを計算
   * @param document ドキュメント
   */
  private getPopularityScore(document: DocumentMappingItem): number {
    const path = document.path;
    return this.popularityScores.get(path) || 0;
  }

  /**
   * カスタムスコアを計算
   * ユーザー設定や特定の条件に基づくスコア
   * @param document ドキュメント
   */
  private getCustomScore(document: DocumentMappingItem): number {
    // ユーザー設定による優先度
    const docTypePreference = this.userPreferences[document.docType] || 0;

    // キーワード数によるボーナス（多くのキーワードを持つドキュメントは重要）
    const keywordBonus = document.keywords ? document.keywords.length * 0.1 : 0;

    // タイトルの長さによるペナルティ（短いタイトルのドキュメントを優先）
    const titlePenalty = document.metadata.title
      ? Math.max(0, 1 - document.metadata.title.length / 100)
      : 0;

    return docTypePreference + keywordBonus + titlePenalty;
  }

  /**
   * 優先度の設定を追加/更新
   * @param docType ドキュメントタイプ
   * @param priorityLevel 優先度レベル
   */
  setPriority(docType: string, priorityLevel: number): void {
    const existingIndex = this.priorities.findIndex(
      (p) => p.docType === docType
    );

    if (existingIndex >= 0) {
      this.priorities[existingIndex] = {
        docType,
        priorityLevel,
      };
    } else {
      this.priorities.push({ docType, priorityLevel });
    }
  }

  /**
   * 人気度スコアを設定
   * @param path ドキュメントパス
   * @param score 人気度スコア（0-1の範囲）
   */
  setPopularityScore(path: string, score: number): void {
    this.popularityScores.set(path, Math.max(0, Math.min(1, score)));
  }

  /**
   * ユーザー設定による優先度を設定
   * @param docType ドキュメントタイプ
   * @param preference 優先度（-1から1の範囲、正の値は優先、負の値は非優先）
   */
  setUserPreference(docType: string, preference: number): void {
    this.userPreferences[docType] = Math.max(-1, Math.min(1, preference));
  }

  /**
   * 優先度の計算に使用する基準を設定
   * @param criteria 有効にする基準の配列
   */
  setEnabledCriteria(criteria: PriorityCriteria[]): void {
    this.enabledCriteria = criteria;
  }

  /**
   * 基準の重みを設定
   * @param criteria 基準
   * @param weight 重み（0-1の範囲）
   */
  setCriteriaWeight(criteria: PriorityCriteria, weight: number): void {
    this.criteriaWeights[criteria] = Math.max(0, Math.min(1, weight));
  }

  /**
   * 優先度の設定をリセット
   */
  resetPriorities(): void {
    this.priorities = [];
  }

  /**
   * すべての設定をリセット
   */
  resetAll(): void {
    this.priorities = [];
    this.enabledCriteria = [PriorityCriteria.DOC_TYPE];
    this.criteriaWeights = {
      [PriorityCriteria.DOC_TYPE]: 1.0,
      [PriorityCriteria.RECENCY]: 0.7,
      [PriorityCriteria.POPULARITY]: 0.5,
      [PriorityCriteria.RELEVANCE]: 0.8,
      [PriorityCriteria.CUSTOM]: 0.6,
    };
    this.userPreferences = {};
    this.popularityScores.clear();
  }
}
