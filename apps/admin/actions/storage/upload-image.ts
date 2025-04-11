'use server';

import { v4 as uuid } from 'uuid';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

const WORKS_BUCKET = 'works';

/**
 * 一時URLから画像を取得してSupabase Storageにアップロードする
 * @param tempUrl 一時的なBlobURL
 * @param workId 実績ID
 * @param fileName ファイル名（オプション）
 * @returns アップロードされた画像の永続的なURL
 */
export async function uploadImage(
  tempUrl: string,
  workId: string,
  fileName?: string
): Promise<string> {
  try {
    // BlobURLからファイルを取得
    const response = await fetch(tempUrl);
    if (!response.ok) {
      throw new Error('一時ファイルの取得に失敗しました');
    }

    const blob = await response.blob();
    const fileExt = blob.type.split('/')[1] || 'png';
    const uniqueFileName = fileName || `${uuid()}.${fileExt}`;
    const filePath = `${workId}/${uniqueFileName}`;

    // Supabase Storageにアップロード
    const supabase = getSupabaseServerClient();
    const { error: uploadError } = await supabase.storage
      .from(WORKS_BUCKET)
      .upload(filePath, blob, {
        contentType: blob.type,
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('アップロードエラー:', uploadError);
      throw new Error(
        `画像のアップロードに失敗しました: ${uploadError.message}`
      );
    }

    // 公開URLを取得
    const { data: urlData } = await supabase.storage
      .from(WORKS_BUCKET)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('画像アップロードエラー:', error);
    throw new Error(
      `画像のアップロードに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`
    );
  }
}
