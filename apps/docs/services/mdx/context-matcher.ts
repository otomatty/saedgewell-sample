import {
  DocumentMapping,
  type Document,
  type DocumentMappingItem,
} from '../../types/mdx';

/**
 * コンテキストマッチャークラス
 * ドキュメントのコンテキスト（現在の文脈）に基づいて
 * 最も関連性の高いドキュメントを選択するためのクラス
 */
export class ContextMatcher {
  private context = '';

  /**
   * コンテキストを設定
   * @param context コンテキスト
   */
  setContext(context: string): void {
    this.context = context.toLowerCase();
  }

  /**
   * コンテキスト関連性に基づいてドキュメントをソート
   * @param keyword キーワード
   * @param documents ドキュメントリスト
   * @returns ソートされたドキュメントリスト
   */
  sortByContextRelevance(
    keyword: string,
    documents: DocumentMappingItem[]
  ): DocumentMappingItem[] {
    if (!documents.length || !this.context) {
      return documents;
    }

    return documents
      .map((doc) => {
        const path = doc.path.toLowerCase();
        const contextScore = this.calculateContextScore(path, this.context);

        return {
          ...doc,
          score: (doc.score || 0) + contextScore,
        };
      })
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  /**
   * 関連キーワードを抽出
   * @param keyword メインキーワード
   * @param documents ドキュメントリスト
   * @param limit 上限数
   * @returns 関連キーワードの配列
   */
  extractRelatedKeywords(
    keyword: string,
    documents: DocumentMappingItem[],
    limit = 5
  ): string[] {
    const relatedKeywords = new Set<string>();
    const normalizedKeyword = keyword.toLowerCase();

    // 各ドキュメントからキーワードを抽出
    for (const doc of documents) {
      if (doc.keywords) {
        for (const kw of doc.keywords) {
          // メインキーワードと同じでなければ追加
          if (kw.toLowerCase() !== normalizedKeyword) {
            relatedKeywords.add(kw);
          }
        }
      }
    }

    // 上限数に制限して返す
    return Array.from(relatedKeywords).slice(0, limit);
  }

  /**
   * コンテキストに基づいてドキュメントをランク付けする
   * @param documents ドキュメントリスト
   * @param context コンテキスト（現在のパスセグメントなど）
   * @returns ランク付けされたドキュメントリスト
   */
  rankByContext(documents: Document[], context: string[]): Document[] {
    if (!documents.length || !context.length) {
      return documents;
    }

    // コンテキストの文字列表現
    const contextString = context.join('/').toLowerCase();

    // 各ドキュメントにコンテキストスコアを付与
    return documents
      .map((doc) => {
        const path = doc.path.toLowerCase();
        const contextScore = this.calculateContextScore(path, contextString);

        return {
          ...doc,
          score: (doc.score || 0) + contextScore,
        };
      })
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  /**
   * コンテキストスコアを計算する
   * @param path ドキュメントパス
   * @param contextString コンテキスト文字列
   * @returns コンテキストスコア
   */
  private calculateContextScore(path: string, contextString: string): number {
    // 完全一致の場合は高いスコア
    if (path.includes(contextString)) {
      return 1.0;
    }

    // コンテキストの各セグメントについて部分一致を確認
    const contextSegments = contextString.split('/');
    let score = 0;

    for (const segment of contextSegments) {
      if (segment.length > 2 && path.includes(segment)) {
        score += 0.2;
      }
    }

    // パスセグメントの類似性を評価
    const pathSegments = path.split('/');
    for (
      let i = 0;
      i < pathSegments.length && i < contextSegments.length;
      i++
    ) {
      if (pathSegments[i] === contextSegments[i]) {
        score += 0.1;
      }
    }

    return Math.min(score, 0.9); // 完全一致以外は0.9を上限とする
  }
}
