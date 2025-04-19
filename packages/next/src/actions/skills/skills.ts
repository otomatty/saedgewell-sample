'use server';

/**
 * スキル管理用のServer Actions
 * @module
 */
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type {
  Skill,
  SkillCategory,
  SkillExperience,
  CreateSkillInput,
  UpdateSkillInput,
  CreateSkillExperienceInput,
  UpdateSkillExperienceInput,
  SkillFeature,
  CreateSkillFeatureInput,
  UpdateSkillFeatureInput,
} from '@kit/types/skills';

/**
 * スキルカテゴリー一覧を取得する
 */
export async function getSkillCategories(): Promise<SkillCategory[]> {
  const supabase = await getSupabaseServerClient();
  const { data: categories, error } = await supabase
    .from('skill_categories')
    .select('*')
    .order('name');

  if (error) {
    throw new Error('カテゴリーの取得に失敗しました');
  }

  return categories as SkillCategory[];
}

/**
 * スキル一覧を取得する
 */
export async function getSkills(params?: {
  page?: number;
  search?: string;
  category?: string;
}): Promise<Skill[]> {
  const supabase = await getSupabaseServerClient();

  let query = supabase.from('skills').select(`
			*,
			features:skill_features(*)
		`);

  // 検索条件の適用
  if (params?.search) {
    query = query.or(
      `name.ilike.%${params.search}%,description.ilike.%${params.search}%`
    );
  }

  if (params?.category) {
    query = query.eq('category', params.category);
  }

  // ページネーション
  if (params?.page) {
    const limit = 10;
    const from = (params.page - 1) * limit;
    query = query.range(from, from + limit - 1);
  }

  query = query.order('created_at', { ascending: false });

  const { data: skills, error } = await query;

  if (error) {
    console.error('Error fetching skills:', error);
    throw new Error('スキルの取得に失敗しました');
  }

  return skills as unknown as Skill[];
}

/**
 * スキルとカテゴリーを紐付ける
 */
async function linkSkillToCategories(
  skillId: string,
  categoryIds: string[]
): Promise<void> {
  console.log('カテゴリー紐付け - 実行:', { skillId, categoryIds });
  const supabase = await getSupabaseServerClient();

  try {
    // 既存の紐付けを削除
    const { error: deleteError } = await supabase
      .from('skill_category_relations')
      .delete()
      .eq('skill_id', skillId);

    if (deleteError) {
      console.error('カテゴリー紐付けの削除エラー:', deleteError);
      throw new Error('カテゴリー紐付けの更新に失敗しました');
    }

    // 新しい紐付けを作成
    const relations = categoryIds.map((categoryId) => ({
      skill_id: skillId,
      category_id: categoryId,
    }));

    const { error: insertError } = await supabase
      .from('skill_category_relations')
      .insert(relations);

    if (insertError) {
      console.error('カテゴリー紐付けの作成エラー:', insertError);
      throw new Error('カテゴリー紐付けの作成に失敗しました');
    }
  } catch (error) {
    console.error('予期せぬエラー:', error);
    throw error;
  }
}

/**
 * スキルを作成する
 */
export async function createSkill(input: CreateSkillInput): Promise<Skill> {
  console.log('createSkill - 受け取ったデータ:', input);
  const supabase = await getSupabaseServerClient();

  try {
    const { categories, ...skillData } = input;
    const { data: skill, error } = await supabase
      .from('skills')
      .insert(skillData)
      .select()
      .single();

    if (error) {
      console.error('スキル作成エラーの詳細:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw new Error('スキルの作成に失敗しました');
    }

    // カテゴリーの紐付け
    if (categories && categories.length > 0) {
      await linkSkillToCategories(skill.id, categories);
    }

    console.log('作成されたスキル:', skill);
    return skill;
  } catch (error) {
    console.error('予期せぬエラー:', error);
    throw error;
  }
}

/**
 * スキルを更新する
 */
export async function updateSkill(input: UpdateSkillInput): Promise<Skill> {
  console.log('updateSkill - 受け取ったデータ:', input);
  const supabase = await getSupabaseServerClient();

  try {
    const { categories, ...skillData } = input;
    const { data: skill, error } = await supabase
      .from('skills')
      .update(skillData)
      .eq('id', input.id)
      .select()
      .single();

    if (error) {
      console.error('スキル更新エラーの詳細:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw new Error('スキルの更新に失敗しました');
    }

    // カテゴリーの紐付け
    if (categories && categories.length > 0) {
      await linkSkillToCategories(skill.id, categories);
    }

    console.log('更新されたスキル:', skill);
    return skill;
  } catch (error) {
    console.error('予期せぬエラー:', error);
    throw error;
  }
}

/**
 * スキルを削除する
 */
export async function deleteSkill(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from('skills').delete().eq('id', id);

  if (error) {
    console.error('Error deleting skill:', error);
    throw new Error('スキルの削除に失敗しました');
  }
}

/**
 * スキルの機能説明を取得する
 */
export async function getSkillFeatures(
  skillId: string
): Promise<SkillFeature[]> {
  const supabase = await getSupabaseServerClient();

  const { data: features, error } = await supabase
    .from('skill_features')
    .select('*')
    .eq('skill_id', skillId)
    .order('is_capable', { ascending: false })
    .order('priority', { ascending: false });

  if (error) {
    console.error('Error fetching skill features:', error);
    throw new Error('スキルの機能説明の取得に失敗しました');
  }

  return features as unknown as SkillFeature[];
}

/**
 * スキルの機能説明を作成する
 */
export async function createSkillFeature(
  input: CreateSkillFeatureInput
): Promise<SkillFeature> {
  const supabase = await getSupabaseServerClient();

  const { data: feature, error } = await supabase
    .from('skill_features')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('Error creating skill feature:', error);
    throw new Error('スキルの機能説明の作成に失敗しました');
  }

  return feature as unknown as SkillFeature;
}

/**
 * スキルの機能説明を更新する
 */
export async function updateSkillFeature(
  input: UpdateSkillFeatureInput
): Promise<SkillFeature> {
  const supabase = await getSupabaseServerClient();

  const { data: feature, error } = await supabase
    .from('skill_features')
    .update(input)
    .eq('id', input.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating skill feature:', error);
    throw new Error('スキルの機能説明の更新に失敗しました');
  }

  return feature as unknown as SkillFeature;
}

/**
 * スキルの機能説明を削除する
 */
export async function deleteSkillFeature(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from('skill_features').delete().eq('id', id);

  if (error) {
    console.error('Error deleting skill feature:', error);
    throw new Error('スキルの機能説明の削除に失敗しました');
  }
}
