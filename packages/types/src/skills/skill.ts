/**
 * スキル管理で使用する型定義
 * @module
 */

/**
 * スキルカテゴリー
 */
export interface SkillCategory {
	id: string;
	name: string;
	description?: string;
	parent_id?: string;
	created_at: string;
	updated_at: string;
}

/**
 * スキルの基本情報
 */
export interface Skill {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	icon_url: string | null;
	started_at: string | null;
	created_at: string;
	updated_at: string;
	categories?: SkillCategory[];
	features?: SkillFeature[];
}

/**
 * スキルの使用実績
 */
export interface SkillExperience {
	id: string;
	skill_id: string;
	project_name: string;
	description: string;
	started_at: string;
	ended_at?: string;
	is_current: boolean;
	created_at: string;
	updated_at: string;
}

/**
 * スキル作成時の入力データ
 */
export interface CreateSkillInput {
	name: string;
	slug: string;
	description: string;
	icon_url: string | null;
	started_at: string;
	categories: string[];
}

/**
 * スキル更新時の入力データ
 */
export interface UpdateSkillInput extends CreateSkillInput {
	id: string;
}

/**
 * スキル実績作成時の入力データ
 */
export type CreateSkillExperienceInput = Omit<
	SkillExperience,
	"id" | "created_at" | "updated_at"
>;

/**
 * スキル実績更新時の入力データ
 */
export type UpdateSkillExperienceInput = Partial<CreateSkillExperienceInput>;

/**
 * スキルのフィルター条件
 */
export interface SkillFilter {
	search?: string;
	is_capable?: boolean;
}

/**
 * スキル一覧の取得結果
 */
export interface SkillListResponse {
	skills: Skill[];
	total: number;
	limit: number;
}

export interface SkillFeature {
	id: string;
	skill_id: string;
	description: string;
	is_capable: boolean;
	priority: number;
	created_at: string;
	updated_at: string;
}

export interface CreateSkillFeatureInput {
	skill_id: string;
	description: string;
	is_capable: boolean;
	priority: number;
}

export interface UpdateSkillFeatureInput
	extends Partial<Omit<CreateSkillFeatureInput, "skill_id">> {
	id: string;
}
