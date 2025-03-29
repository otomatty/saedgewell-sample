'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Faq } from '@kit/types/contact';

/**
 * カテゴリに紐づくFAQ一覧を取得する
 */
export async function getFAQsByCategory(categoryId: string): Promise<Faq[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching FAQs:', error);
    throw new Error('FAQの取得に失敗しました');
  }

  return data;
}

/**
 * FAQを取得する
 */
export async function getFAQ(id: string): Promise<Faq | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching FAQ:', error);
    throw new Error('FAQの取得に失敗しました');
  }

  return data;
}

/**
 * キーワードでFAQを検索する
 */
export async function searchFAQs(keyword: string): Promise<Faq[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .or(`question.ilike.%${keyword}%,answer.ilike.%${keyword}%`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error searching FAQs:', error);
    throw new Error('FAQの検索に失敗しました');
  }

  return data;
}
