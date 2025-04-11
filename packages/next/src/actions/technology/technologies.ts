'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Database } from '@kit/supabase/database';

type Technology = Database['public']['Tables']['technologies']['Row'];
type TechnologyCategory = NonNullable<Technology['category']>;

/**
 * 全ての技術スタックを取得
 */
export async function getTechnologies() {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch technologies: ${error.message}`);
  }

  return data as Technology[];
}

/**
 * カテゴリー別の技術スタックを取得
 */
export async function getTechnologiesByCategory(category: TechnologyCategory) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .eq('category', category)
    .order('name');

  if (error) {
    throw new Error(
      `Failed to fetch technologies by category: ${error.message}`
    );
  }

  return data as Technology[];
}

/**
 * 特定の技術スタックを取得
 */
export async function getTechnologyById(id: string) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch technology: ${error.message}`);
  }

  return data as Technology;
}
