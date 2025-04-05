'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

interface DeleteWorkResponse {
  success: boolean;
  message: string;
}

/**
 * 実績データを削除するためのServer Action
 * @param id 削除する実績のID (UUID)
 * @returns 削除結果のレスポンス
 */
export async function deleteWork(id: string): Promise<DeleteWorkResponse> {
  try {
    if (!id) {
      return {
        success: false,
        message: '削除対象のIDが指定されていません。',
      };
    }

    const supabase = getSupabaseServerClient();

    // 関連データの削除（外部キー制約がある場合）
    // works テーブルに紐づく子テーブルのデータを削除
    // 注: CASCADE制約が設定されている場合は不要
    const tablesWithForeignKeys = [
      'work_challenges',
      'work_details',
      'work_images',
      'work_responsibilities',
      'work_results',
      'work_solutions',
      'work_technologies',
      'work_skills',
    ] as const;

    // すべての関連テーブルのデータを削除
    for (const table of tablesWithForeignKeys) {
      const { error } = await supabase.from(table).delete().eq('work_id', id);
      if (error) {
        console.warn(`関連テーブル ${table} の削除でエラーが発生:`, error);
        // エラーがあっても処理を続行（メインテーブルの削除を試みる）
      }
    }

    // メインの実績データを削除
    const { error } = await supabase.from('works').delete().eq('id', id);

    if (error) {
      console.error('実績の削除中にエラーが発生:', error);
      return {
        success: false,
        message: `実績の削除に失敗しました: ${error.message}`,
      };
    }

    // キャッシュの再検証（実績一覧ページを更新）
    revalidatePath('/works');

    return {
      success: true,
      message: '実績が正常に削除されました',
    };
  } catch (error) {
    // 予期せぬエラーのハンドリング
    console.error('実績削除中に予期せぬエラーが発生:', error);
    return {
      success: false,
      message: `予期せぬエラーが発生しました: ${(error as Error).message}`,
    };
  }
}
