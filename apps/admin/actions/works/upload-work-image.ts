'use server';

import { z } from 'zod';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { uploadImage } from '../storage/upload-image';

// 入力スキーマ
const UploadWorkImageSchema = z.object({
  workId: z.string().uuid(),
  file: z.instanceof(File),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

type UploadWorkImageInput = z.infer<typeof UploadWorkImageSchema>;

/**
 * 実績画像をアップロードし、work_imagesテーブルに追加する
 */
export async function uploadWorkImageAction(formData: FormData) {
  try {
    // FormDataから入力を取得
    const workId = formData.get('workId') as string;
    const file = formData.get('image') as File;
    const altFromForm = formData.get('alt');
    // altが提供されていなければファイル名を使用
    const alt = altFromForm ? String(altFromForm) : file.name;

    // バリデーション
    const validatedInput = UploadWorkImageSchema.parse({
      workId,
      file,
      alt,
    });

    // ファイルをBlobURLに変換（uploadImage関数の要件）
    const blobUrl = URL.createObjectURL(file);

    try {
      // Supabase Storageに画像をアップロード
      const publicUrl = await uploadImage(
        blobUrl,
        validatedInput.workId,
        file.name
      );

      // 新しい画像のsort_orderを決定（既存の最大値 + 1）
      const supabase = getSupabaseServerClient();
      const { data: maxSortOrderData, error: sortOrderError } = await supabase
        .from('work_images')
        .select('sort_order')
        .eq('work_id', validatedInput.workId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();

      let newSortOrder = 0;
      if (!sortOrderError) {
        newSortOrder = (maxSortOrderData?.sort_order || 0) + 1;
      }

      // work_imagesテーブルにレコードを追加
      const { data: imageRecord, error: insertError } = await supabase
        .from('work_images')
        .insert({
          work_id: validatedInput.workId,
          url: publicUrl,
          // altは必須なので、validatedInput.altがundefinedの場合は空文字列とする
          alt: validatedInput.alt || '',
          caption: validatedInput.caption || null,
          sort_order: newSortOrder,
        })
        .select()
        .single();

      if (insertError) {
        console.error('データベース挿入エラー:', insertError);
        return {
          success: false,
          error: `画像情報の保存に失敗しました: ${insertError.message}`,
        };
      }

      // BlobURLを解放
      URL.revokeObjectURL(blobUrl);

      return { success: true, data: imageRecord };
    } catch (uploadError) {
      console.error('画像アップロードエラー:', uploadError);
      // BlobURLを解放
      URL.revokeObjectURL(blobUrl);
      return {
        success: false,
        error:
          uploadError instanceof Error
            ? uploadError.message
            : '画像のアップロードに失敗しました',
      };
    }
  } catch (error) {
    console.error('入力バリデーションエラー:', error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? `入力値が不正です: ${error.errors.map((e) => e.message).join(', ')}`
          : '予期せぬエラーが発生しました',
    };
  }
}
