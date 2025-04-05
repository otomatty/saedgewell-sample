'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

interface WorkLinksData {
  github_url?: string | null;
  website_url?: string | null;
}

/**
 * 実績の外部リンクを更新する
 * @param workId 実績ID
 * @param data 更新するリンクデータ
 * @returns 更新結果
 */
export async function updateWorkLinks(workId: string, data: WorkLinksData) {
  const supabase = getSupabaseServerClient();

  // リンク情報を更新
  const { error } = await supabase.from('works').update(data).eq('id', workId);

  if (error) {
    console.error('実績のリンク更新に失敗しました:', error);
    throw new Error(`実績のリンク更新に失敗しました: ${error.message}`);
  }

  // キャッシュをクリア
  revalidatePath(`/works/${workId}`);
  revalidatePath('/works');

  return { success: true };
}
