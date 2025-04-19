// スキルカテゴリーの定義
export const SKILL_CATEGORIES = [
	{
		id: "frontend",
		name: "フロントエンド",
		description: "Webフロントエンド開発に関連するスキル",
	},
	{
		id: "backend",
		name: "バックエンド",
		description: "サーバーサイド開発に関連するスキル",
	},
	{
		id: "infrastructure",
		name: "インフラストラクチャ",
		description: "インフラ構築・運用に関連するスキル",
	},
	{
		id: "design",
		name: "デザイン",
		description: "UIデザインやUXデザインに関連するスキル",
	},
	{
		id: "management",
		name: "マネジメント",
		description: "プロジェクト管理やチームマネジメントに関連するスキル",
	},
] as const;

export type SkillCategory =
	| "frontend"
	| "backend"
	| "mobile"
	| "devops"
	| "database"
	| "other";

interface GenerateSkillsParams {
	category: SkillCategory;
	description?: string;
}

export interface GeneratedSkill {
	name: string;
	slug: string;
	description: string;
	icon_url: string | null;
}

/**
 * スキル生成のためのプロンプトを作成する
 */
function createSkillPrompt({
	category,
	description,
}: GenerateSkillsParams): string {
	const prompt = `以下の条件に基づいて、技術スキルの候補を3つ生成してください。
		
		カテゴリー: ${category}
		${description ? `追加の要件: ${description}` : ""}
		
		各スキルには以下の情報を含めてください：
		- name: スキル名
		- slug: スキル名のスラッグ（小文字のみ、ハイフン区切り）
		- description: スキルの説明（100文字以内）
		- icon_url: アイコンのURL（なければnull）
		
		JSON形式で出力してください。
	`;

	return prompt;
}

/**
 * Gemini APIを使用してスキル情報を生成する
 */
export async function generateSkills({
	category,
	description,
}: GenerateSkillsParams): Promise<GeneratedSkill[]> {
	const prompt = createSkillPrompt({ category, description });

	// TODO: Gemini APIを使用してスキルを生成する
	// 一時的なモックデータを返す
	return [
		{
			name: "React",
			slug: "react",
			description: "モダンなUIを構築するためのJavaScriptライブラリ",
			icon_url: "https://example.com/react.png",
		},
		{
			name: "Next.js",
			slug: "nextjs",
			description: "Reactベースのフルスタックフレームワーク",
			icon_url: "https://example.com/nextjs.png",
		},
		{
			name: "TypeScript",
			slug: "typescript",
			description: "静的型付けを提供するJavaScriptのスーパーセット",
			icon_url: "https://example.com/typescript.png",
		},
	];
}
