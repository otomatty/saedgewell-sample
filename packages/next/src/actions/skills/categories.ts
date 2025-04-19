'use server';

/**
 * スキルカテゴリー管理用のServer Actions
 * @module
 */
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { SkillCategory } from '@kit/types/skills';
import { revalidatePath } from 'next/cache';

/**
 * スキルカテゴリー一覧を取得する
 */
export async function getSkillCategories(): Promise<SkillCategory[]> {
  const supabase = await getSupabaseServerClient();
  const { data: categories, error } = await supabase
    .from('skill_categories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching skill categories:', error);
    throw new Error('カテゴリーの取得に失敗しました');
  }

  return categories as SkillCategory[];
}

/**
 * スキルカテゴリーを作成する
 */
export async function createSkillCategory(input: {
  name: string;
  description: string;
}): Promise<SkillCategory> {
  const supabase = await getSupabaseServerClient();

  const { data: category, error } = await supabase
    .from('skill_categories')
    .insert({
      ...input,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating skill category:', error);
    throw new Error('カテゴリーの作成に失敗しました');
  }

  revalidatePath('/admin/skills/categories');
  return category as SkillCategory;
}

/**
 * スキルカテゴリーを更新する
 */
export async function updateSkillCategory(
  id: string,
  input: {
    name: string;
    description: string;
  }
): Promise<SkillCategory> {
  const supabase = await getSupabaseServerClient();

  const { data: category, error } = await supabase
    .from('skill_categories')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating skill category:', error);
    throw new Error('カテゴリーの更新に失敗しました');
  }

  revalidatePath('/admin/skills/categories');
  return category as SkillCategory;
}

/**
 * スキルカテゴリーを削除する
 */
export async function deleteSkillCategory(id: string): Promise<void> {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from('skill_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting skill category:', error);
    throw new Error('カテゴリーの削除に失敗しました');
  }

  revalidatePath('/admin/skills/categories');
}

/**
 * スキルカテゴリーを取得する
 */
export async function getSkillCategory(
  id: string
): Promise<SkillCategory | null> {
  const supabase = await getSupabaseServerClient();

  const { data: category, error } = await supabase
    .from('skill_categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching skill category:', error);
    throw new Error('カテゴリーの取得に失敗しました');
  }

  return category as SkillCategory | null;
}
