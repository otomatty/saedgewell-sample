/**
 * estimate_agent.project_templates テーブルに対応する型
 * RLSポリシー: 共通テンプレートは閲覧可能, ユーザーは自分のテンプレートのみ操作可能
 */
export interface ProjectTemplate {
  id: string;
  user_id?: string | null;
  name: string;
  category_id: string;
  description: string | null;
  actual_hours: number | null;
  actual_cost: number | null;
  created_at?: string;
  updated_at?: string;
  content_embedding?: number[] | null;
}

/**
 * estimate_agent.template_features テーブルに対応する型 (新規追加)
 * プロジェクトテンプレートに紐づく個別の機能詳細
 */
export interface TemplateFeature {
  id: string;
  project_template_id: string; // REFERENCES estimate_agent.project_templates(id)
  name: string;
  description: string | null;
  estimated_hours: number | null;
  unit_price: number | null; // サンプルデータにはあったけど、設計書にはなかったわね…まあ、入れておくわ
  complexity: string | null;
  description_embedding?: number[] | null; // 機能説明のベクトル
  created_at?: string;
  updated_at?: string;
}

/**
 * ベクトル検索の結果として期待される型 (プロジェクトテンプレート + 類似度スコア)
 */
export interface ProjectTemplateWithSimilarity extends ProjectTemplate {
  similarity: number; // ベクトル検索関数が返す類似度スコア (と仮定)
}

/**
 * estimate_agent.match_template_features DB関数の戻り値の型 (と仮定)
 * 類似する機能テンプレートと類似度スコアを含む
 */
export interface SimilarTemplateFeature {
  id: string;
  name: string;
  description?: string | null;
  estimated_hours?: number | null;
  similarity: number;
  // 必要に応じて他のカラムを追加
}
