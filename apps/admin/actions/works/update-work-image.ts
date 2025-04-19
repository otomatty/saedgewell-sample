'use server';

import { z } from 'zod';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

// 入力スキーマ
const UpdateWorkImageSchema = z.object({
  workId: z.string().uuid(),
  imageId: z.string().uuid(),
  alt: z.string().optional(),
  caption: z.string().optional().nullable(),
  sort_order: z.number().optional(),
});

type UpdateWorkImageInput = z.infer<typeof UpdateWorkImageSchema>;

/**
 * 実績画像情報を更新する
 */
export async function updateWorkImageAction(input: UpdateWorkImageInput) {
  try {
    // 入力をバリデーション
    const validatedInput = UpdateWorkImageSchema.parse(input);
    const supabase = getSupabaseServerClient();

    // 更新するデータを準備（undefinedのフィールドは除外）
    const updateData: Partial<{
      alt: string;
      caption: string | null;
      sort_order: number;
    }> = {};

    if (validatedInput.alt !== undefined) {
      updateData.alt = validatedInput.alt;
    }

    if (validatedInput.caption !== undefined) {
      updateData.caption = validatedInput.caption;
    }

    if (validatedInput.sort_order !== undefined) {
      updateData.sort_order = validatedInput.sort_order;
    }

    // 更新するデータがない場合は早期リターン
    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        error: '更新するデータが指定されていません',
      };
    }

    // work_imagesテーブルの画像情報を更新
    const { data: updatedImage, error: updateError } = await supabase
      .from('work_images')
      .update(updateData)
      .eq('id', validatedInput.imageId)
      .eq('work_id', validatedInput.workId)
      .select()
      .single();

    if (updateError) {
      console.error('画像情報更新エラー:', updateError);
      return {
        success: false,
        error: `画像情報の更新に失敗しました: ${updateError.message}`,
      };
    }

    return { success: true, data: updatedImage };
  } catch (error) {
    console.error('画像更新エラー:', error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? `入力値が不正です: ${error.errors.map((e) => e.message).join(', ')}`
          : '予期せぬエラーが発生しました',
    };
  }
}
