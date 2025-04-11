'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

const WORKS_BUCKET = 'works';

/**
 * Supabase Storageから画像を削除する
 * @param url 削除する画像のURL
 * @returns 削除が成功したかどうか
 */
export async function deleteImage(url: string): Promise<boolean> {
  try {
    // URLからファイルパスを抽出
    const supabase = getSupabaseServerClient();

    // URLからパスを取得
    // 例: https://xxx.supabase.co/storage/v1/object/public/works/abc-123/image.png
    // → works/abc-123/image.png
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex((part) => part === WORKS_BUCKET);

    if (bucketIndex === -1 || bucketIndex >= urlParts.length - 1) {
      throw new Error('無効な画像URLです');
    }

    const filePath = urlParts.slice(bucketIndex + 1).join('/');

    // クエリパラメータがある場合は除去
    const cleanPath = filePath.split('?')[0];

    if (!cleanPath) {
      throw new Error('有効なファイルパスが取得できませんでした');
    }

    // ファイルを削除
    const { error } = await supabase.storage
      .from(WORKS_BUCKET)
      .remove([cleanPath]);

    if (error) {
      console.error('削除エラー:', error);
      throw new Error(`画像の削除に失敗しました: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('画像削除エラー:', error);
    return false;
  }
}
