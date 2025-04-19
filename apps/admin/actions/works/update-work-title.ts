'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

/**
 * 実績のタイトルを更新する
 * @param workId 実績ID
 * @param title 新しいタイトル
 * @returns 更新結果
 */
export async function updateWorkTitle(workId: string, title: string) {
  const supabase = getSupabaseServerClient();

  // 実績のタイトルを更新
  const { error } = await supabase
    .from('works')
    .update({ title })
    .eq('id', workId);

  if (error) {
    console.error('実績のタイトル更新に失敗しました:', error);
    throw new Error(`実績のタイトル更新に失敗しました: ${error.message}`);
  }

  // キャッシュをクリア
  revalidatePath(`/works/${workId}`);
  revalidatePath('/works');

  return { success: true };
}
