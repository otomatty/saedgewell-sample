'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Database } from '../../lib/database.types';

type Technology = Database['public']['Tables']['technologies']['Row'];

/**
 * 全ての技術スタックを取得
 * @returns 技術スタックの配列
 */
export async function getTechnologies() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .order('name');

  if (error) {
    console.error('技術スタック取得エラー:', error);
    throw new Error(`技術スタックの取得に失敗しました: ${error.message}`);
  }

  return data as Technology[];
}

/**
 * 技術スタックをIDで取得
 * @param id 技術スタックのID
 * @returns 技術スタック情報
 */
export async function getTechnologyById(id: string) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('技術スタック取得エラー:', error);
    throw new Error(`技術スタックの取得に失敗しました: ${error.message}`);
  }

  return data as Technology;
}

/**
 * 技術スタックをスラッグで取得
 * @param slug 技術スタックのスラッグ
 * @returns 技術スタック情報
 */
export async function getTechnologyBySlug(slug: string) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('技術スタック取得エラー:', error);
    throw new Error(`技術スタックの取得に失敗しました: ${error.message}`);
  }

  return data as Technology;
}
