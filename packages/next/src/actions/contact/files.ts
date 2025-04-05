'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { File } from '@kit/types/contact';

/**
 * ファイルをアップロードする
 */
export async function uploadFile(
  messageId: string,
  file: Blob,
  fileName: string
): Promise<File> {
  const supabase = getSupabaseServerClient();

  // ファイルをStorageにアップロード
  const { data: storageData, error: storageError } = await supabase.storage
    .from('chat-files')
    .upload(`${messageId}/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (storageError) {
    console.error('Error uploading file:', storageError);
    throw new Error('ファイルのアップロードに失敗しました');
  }

  // ファイルのURLを取得
  const { data: urlData } = await supabase.storage
    .from('chat-files')
    .getPublicUrl(storageData.path);

  // ファイル情報をデータベースに保存
  const { data, error } = await supabase
    .from('files')
    .insert({
      message_id: messageId,
      file_name: fileName,
      file_url: urlData.publicUrl,
      file_size: file.size,
      mime_type: file.type,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating file record:', error);
    throw new Error('ファイル情報の保存に失敗しました');
  }

  return data as unknown as File;
}

/**
 * ファイルを取得する
 */
export async function getFile(id: string): Promise<File | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching file:', error);
    throw new Error('ファイルの取得に失敗しました');
  }

  return data as unknown as File | null;
}

/**
 * メッセージに紐づくファイル一覧を取得する
 */
export async function getMessageFiles(messageId: string): Promise<File[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('message_id', messageId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching message files:', error);
    throw new Error('ファイル一覧の取得に失敗しました');
  }

  return (data as unknown as File[]) ?? [];
}
