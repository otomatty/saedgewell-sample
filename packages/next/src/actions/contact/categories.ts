'use server';

import { enhanceAction } from '../enhance-action';
import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Category } from '@kit/types/contact';
import type { Database } from '@kit/supabase/database';
import {
  GetCategorySchema,
  CreateCategorySchema,
  UpdateCategorySchema,
  DeleteCategorySchema,
} from './schemas';

type DbResult<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
type CategoryRow = DbResult<'contact_categories'>;

/**
 * カテゴリ一覧を取得する
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('contact_categories')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error('カテゴリの取得に失敗しました');
  }

  return (data as unknown as Category[]) ?? [];
}

/**
 * カテゴリを取得する
 */
export const getCategory = enhanceAction(
  async (data) => {
    const supabase = getSupabaseServerClient();

    const { data: category, error } = await supabase
      .from('contact_categories')
      .select('*')
      .eq('id', data.id)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      throw new Error('カテゴリの取得に失敗しました');
    }

    return category as CategoryRow | null;
  },
  {
    schema: GetCategorySchema,
  }
);

/**
 * カテゴリを作成する
 */
export const createCategory = enhanceAction(
  async (data) => {
    const supabase = getSupabaseServerClient();

    const { data: category, error } = await supabase
      .from('contact_categories')
      .insert({
        name: data.name,
        description: data.description,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw new Error('カテゴリの作成に失敗しました');
    }

    revalidatePath('/admin/contact/categories');
    return category as CategoryRow;
  },
  {
    schema: CreateCategorySchema,
  }
);

/**
 * カテゴリを更新する
 */
export const updateCategory = enhanceAction(
  async (data) => {
    const supabase = getSupabaseServerClient();

    const { data: category, error } = await supabase
      .from('contact_categories')
      .update({
        name: data.name,
        description: data.description,
      })
      .eq('id', data.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw new Error('カテゴリの更新に失敗しました');
    }

    revalidatePath('/admin/contact/categories');
    return category as CategoryRow;
  },
  {
    schema: UpdateCategorySchema,
  }
);

/**
 * カテゴリを削除する
 */
export const deleteCategory = enhanceAction(
  async (data) => {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from('contact_categories')
      .delete()
      .eq('id', data.id);

    if (error) {
      console.error('Error deleting category:', error);
      throw new Error('カテゴリの削除に失敗しました');
    }

    revalidatePath('/admin/contact/categories');
    return { success: true };
  },
  {
    schema: DeleteCategorySchema,
  }
);
