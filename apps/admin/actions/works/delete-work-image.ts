'use server';

import { z } from 'zod';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { deleteImage } from '../storage/delete-image';

// 入力スキーマ
const DeleteWorkImageSchema = z.object({
  workId: z.string().uuid(),
  imageId: z.string().uuid(),
});

type DeleteWorkImageInput = z.infer<typeof DeleteWorkImageSchema>;

/**
 * 実績画像を削除する
 * 1. work_imagesテーブルからレコードを取得
 * 2. Supabase Storageから画像を削除
 * 3. work_imagesテーブルからレコードを削除
 */
export async function deleteWorkImageAction(input: DeleteWorkImageInput) {
  try {
    // 入力をバリデーション
    const validatedInput = DeleteWorkImageSchema.parse(input);
    const supabase = getSupabaseServerClient();

    // まず、画像レコードを取得
    const { data: imageRecord, error: fetchError } = await supabase
      .from('work_images')
      .select('*')
      .eq('id', validatedInput.imageId)
      .eq('work_id', validatedInput.workId)
      .single();

    if (fetchError) {
      console.error('画像レコード取得エラー:', fetchError);
      return {
        success: false,
        error: `画像情報の取得に失敗しました: ${fetchError.message}`,
      };
    }

    if (!imageRecord) {
      return {
        success: false,
        error: '該当する画像が見つかりません',
      };
    }

    // Storageから画像を削除
    const storageDeleteSuccess = await deleteImage(imageRecord.url);
    if (!storageDeleteSuccess) {
      console.warn(
        'ストレージからの画像削除に失敗しましたが、処理を続行します'
      );
      // 警告を表示するが処理は続行する（データベースからは削除する）
    }

    // テーブルからレコードを削除
    const { error: deleteError } = await supabase
      .from('work_images')
      .delete()
      .eq('id', validatedInput.imageId)
      .eq('work_id', validatedInput.workId);

    if (deleteError) {
      console.error('画像レコード削除エラー:', deleteError);
      return {
        success: false,
        error: `画像情報の削除に失敗しました: ${deleteError.message}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('画像削除エラー:', error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? `入力値が不正です: ${error.errors.map((e) => e.message).join(', ')}`
          : '予期せぬエラーが発生しました',
    };
  }
}
