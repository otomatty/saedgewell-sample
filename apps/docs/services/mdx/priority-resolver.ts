import type { Document } from '../../types/mdx';

/**
 * 優先度解決クラス
 * ドキュメントの優先度に基づいてランク付けを行うクラス
 */
export class PriorityResolver {
  /**
   * ドキュメントをランク付けする
   * @param documents ドキュメントリスト
   * @returns ランク付けされたドキュメントリスト
   */
  rankDocuments(documents: Document[]): Document[] {
    if (!documents.length) {
      return documents;
    }

    return documents
      .map((doc) => {
        // 基本スコア（既存のスコアがあれば使用）
        let score = doc.score || 0;

        // タイトルの長さによるボーナス（短いタイトルほど優先）
        score += this.calculateTitleLengthBonus(doc.title);

        // パスの深さによるボーナス（浅いパスほど優先）
        score += this.calculatePathDepthBonus(doc.path);

        // 優先度フラグによるボーナス
        if (doc.priority) {
          score += this.calculatePriorityBonus(doc.priority);
        }

        return {
          ...doc,
          score,
        };
      })
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  /**
   * タイトルの長さによるボーナスを計算する
   * @param title タイトル
   * @returns ボーナススコア
   */
  private calculateTitleLengthBonus(title: string): number {
    // 短いタイトルほど高いボーナス（最大0.2）
    const length = title.length;
    if (length <= 10) return 0.2;
    if (length <= 20) return 0.15;
    if (length <= 30) return 0.1;
    if (length <= 40) return 0.05;
    return 0;
  }

  /**
   * パスの深さによるボーナスを計算する
   * @param path パス
   * @returns ボーナススコア
   */
  private calculatePathDepthBonus(path: string): number {
    // パスの深さが浅いほど高いボーナス（最大0.3）
    const depth = path.split('/').filter(Boolean).length;
    if (depth <= 1) return 0.3;
    if (depth === 2) return 0.2;
    if (depth === 3) return 0.1;
    return 0;
  }

  /**
   * 優先度フラグによるボーナスを計算する
   * @param priority 優先度
   * @returns ボーナススコア
   */
  private calculatePriorityBonus(priority: number): number {
    // 優先度に応じたボーナス（最大0.5）
    return Math.min(priority / 10, 0.5);
  }
}
