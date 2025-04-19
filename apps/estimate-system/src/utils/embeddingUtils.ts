/**
 * テンプレート機能の Embedding 生成に使用するテキストを組み立てる関数。
 * 機能名、機能説明、プロジェクト名、プロジェクトカテゴリを結合して、
 * 文脈情報を含んだテキストを生成する。
 *
 * @param featureName 機能名 (template_features.name)
 * @param featureDescription 機能説明 (template_features.description)
 * @param projectName プロジェクト名 (project_templates.name)
 * @param projectCategory プロジェクトカテゴリ (project_templates.category)
 * @returns Embedding 生成用の結合されたテキスト文字列
 */
export function createEmbeddingTextForTemplateFeature(
  featureName: string,
  featureDescription: string | null | undefined,
  projectName: string,
  projectCategory: string
): string {
  // 各要素を結合して、Embedding モデルが文脈を理解しやすいようにラベル付けする
  // description が null や undefined の場合は '説明なし' とするか、空にするか。
  // ここでは '説明なし' としておくわ。アンタが必要なら変えなさい。
  const desc = featureDescription || '説明なし';

  // 各要素を改行で区切って結合
  return `カテゴリ: ${projectCategory}\nプロジェクト: ${projectName}\n機能: ${featureName}\n説明: ${desc}`;
}
