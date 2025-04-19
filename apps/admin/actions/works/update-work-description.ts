'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

/**
 * 実績の説明文を更新する
 * @param workId 実績ID
 * @param description 新しい説明文
 * @returns 更新結果
 */
export async function updateWorkDescription(
  workId: string,
  description: string
) {
  const supabase = getSupabaseServerClient();

  // 実績の説明文を更新
  const { error } = await supabase
    .from('works')
    .update({ description })
    .eq('id', workId);

  if (error) {
    console.error('実績の説明文更新に失敗しました:', error);
    throw new Error(`実績の説明文更新に失敗しました: ${error.message}`);
  }

  // キャッシュをクリア
  revalidatePath(`/works/${workId}`);
  revalidatePath('/works');

  return { success: true };
}
