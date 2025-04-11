'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

/**
 * 実績の使用技術を更新する
 * @param workId 実績ID
 * @param technologyIds 技術IDの配列
 * @returns 更新結果
 */
export async function updateWorkTechnologies(
  workId: string,
  technologyIds: string[]
) {
  const supabase = getSupabaseServerClient();

  try {
    // トランザクション的に処理するため、まず現在の関連を削除
    const { error: deleteError } = await supabase
      .from('work_technologies')
      .delete()
      .eq('work_id', workId);

    if (deleteError) {
      throw new Error(
        `既存の技術関連の削除に失敗しました: ${deleteError.message}`
      );
    }

    // 新しい関連を追加（技術IDが空の配列の場合はスキップ）
    if (technologyIds.length > 0) {
      const workTechnologies = technologyIds.map((technologyId) => ({
        work_id: workId,
        technology_id: technologyId,
      }));

      const { error: insertError } = await supabase
        .from('work_technologies')
        .insert(workTechnologies);

      if (insertError) {
        throw new Error(
          `新しい技術関連の追加に失敗しました: ${insertError.message}`
        );
      }
    }

    // キャッシュをクリア
    revalidatePath(`/works/${workId}`);

    return { success: true };
  } catch (error) {
    console.error('実績の技術更新に失敗しました:', error);
    throw error;
  }
}
