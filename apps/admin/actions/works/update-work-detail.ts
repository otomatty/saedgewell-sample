'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

interface WorkDetailUpdateData {
  overview?: string;
  role?: string;
  period?: string;
  team_size?: string;
  [key: string]: string | undefined;
}

/**
 * 実績の詳細情報を更新する
 * @param workId 実績ID
 * @param data 更新する詳細情報
 * @returns 更新結果
 */
export async function updateWorkDetail(
  workId: string,
  data: WorkDetailUpdateData
) {
  const supabase = getSupabaseServerClient();

  // 詳細情報が既に存在するか確認
  const { data: existingDetail } = await supabase
    .from('work_details')
    .select('*')
    .eq('work_id', workId)
    .single();

  let error: Error | null = null;

  if (existingDetail) {
    // 既存の詳細情報を更新
    const { error: updateError } = await supabase
      .from('work_details')
      .update(data)
      .eq('work_id', workId);

    error = updateError;
  } else {
    // 詳細情報を新規作成
    const { error: insertError } = await supabase.from('work_details').insert({
      work_id: workId,
      overview: data.overview || '',
      role: data.role || '',
      period: data.period || '',
      team_size: data.team_size || '',
      ...data,
    });

    error = insertError;
  }

  if (error) {
    console.error('実績の詳細情報更新に失敗しました:', error);
    throw new Error(`実績の詳細情報更新に失敗しました: ${error.message}`);
  }

  // キャッシュをクリア
  revalidatePath(`/works/${workId}`);

  return { success: true };
}
