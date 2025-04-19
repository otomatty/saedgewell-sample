/**
 * @interface CategoryStat
 * @description カテゴリ別の統計情報。
 * @property {string} category - カテゴリ名。
 * @property {number} count - 件数。
 */
export interface CategoryStat {
  category: string;
  count: number;
}

/**
 * @interface WorkStats
 * @description 実績の統計情報を示す型定義（カテゴリ別情報を含む）。
 * @property {number} totalWorks - 総実績数。
 * @property {CategoryStat[]} totalByCategory - カテゴリ別の総実績数内訳。
 * @property {number} publishedWorks - 公開中の実績数。
 * @property {CategoryStat[]} publishedByCategory - カテゴリ別の公開中実績数内訳。
 */
export interface WorkStats {
  totalWorks: number;
  totalByCategory: CategoryStat[];
  publishedWorks: number;
  publishedByCategory: CategoryStat[];
}

/**
 * @interface TopTechnologyStat
 * @description よく使われている技術の統計情報。
 * @property {string} name - 技術名。
 * @property {number} count - 使用された実績数。
 */
export interface TopTechnologyStat {
  name: string;
  count: number;
}
