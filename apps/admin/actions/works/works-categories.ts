// TODO: apps/admin/actions/works/work-categories.ts を作成

'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

export interface WorkCategory {
  id: string;
  name: string;
}

/**
 * @function getWorkCategories
 * @description 有効な作業カテゴリのリストを取得します。
 * @returns {Promise<WorkCategory[]>} カテゴリのリスト (id と name)。
 */
export async function getWorkCategories(): Promise<WorkCategory[]> {
  // Database 型をインポートして使用することを推奨
  // import type { Database } from '~/types/supabase';
  // const supabase = getSupabaseServerClient<Database>();
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('work_categories')
    .select('id, name')
    .order('name', { ascending: true }); // 名前順でソート

  if (error) {
    console.error('Error fetching work categories:', error);
    // エラーハンドリング (error-handling-guidelines.mdc 参照)
    throw new Error('カテゴリ一覧の取得に失敗しました。');
  }

  return data || [];
}
