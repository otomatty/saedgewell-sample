'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { revalidatePath } from 'next/cache';
import { GmailClient, generateAuthUrl } from '~/lib/server/gmail';

/**
 * メール一覧を取得する
 * @param page ページ番号（1から開始）
 * @param limit 1ページあたりの件数
 * @returns メール一覧とページング情報
 */
export async function getEmails(page = 1, limit = 20) {
  const supabase = await getSupabaseServerClient();
  const offset = (page - 1) * limit;

  const {
    data: emails,
    error,
    count,
  } = await supabase
    .from('emails')
    .select('*, email_attachments(*)', { count: 'exact' })
    .order('received_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`メールの取得に失敗しました: ${error.message}`);
  }

  return {
    emails,
    totalCount: count ?? 0,
    currentPage: page,
    totalPages: count ? Math.ceil(count / limit) : 0,
  };
}

/**
 * メールの詳細を取得する
 * @param emailId メールID
 * @returns メールの詳細情報
 */
export async function getEmailDetail(emailId: string) {
  const supabase = await getSupabaseServerClient();

  const { data: email, error } = await supabase
    .from('emails')
    .select('*, email_attachments(*), email_replies(*)')
    .eq('id', emailId)
    .single();

  if (error) {
    throw new Error(`メールの詳細取得に失敗しました: ${error.message}`);
  }

  return email;
}

/**
 * メールを既読にする
 * @param emailId メールID
 */
export async function markEmailAsRead(emailId: string) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from('emails')
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq('id', emailId);

  if (error) {
    throw new Error(`メールの既読設定に失敗しました: ${error.message}`);
  }

  revalidatePath('/admin/emails');
}

/**
 * メールをアーカイブする
 * @param emailId メールID
 */
export async function archiveEmail(emailId: string) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from('emails')
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq('id', emailId);

  if (error) {
    throw new Error(`メールのアーカイブに失敗しました: ${error.message}`);
  }

  revalidatePath('/admin/emails');
}

/**
 * メールにスターを付ける/外す
 * @param emailId メールID
 * @param starred スターを付ける場合はtrue
 */
export async function toggleEmailStar(emailId: string, starred: boolean) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from('emails')
    .update({ is_starred: starred, updated_at: new Date().toISOString() })
    .eq('id', emailId);

  if (error) {
    throw new Error(`メールのスター設定に失敗しました: ${error.message}`);
  }

  revalidatePath('/admin/emails');
}

/**
 * メールを送信する
 * @param data メール送信データ
 */
export async function sendEmail(data: {
  to_email: string[];
  cc_email?: string[];
  bcc_email?: string[];
  subject: string;
  body_text: string;
  body_html?: string;
  original_email_id?: string;
}) {
  const supabase = await getSupabaseServerClient();

  // Gmail APIを使用してメールを送信する処理（実装は別途必要）
  // const gmailResponse = await sendGmailEmail(data);

  // 送信したメールの情報を保存
  const { error } = await supabase.from('email_replies').insert({
    original_email_id: data.original_email_id,
    gmail_message_id: 'dummy_id', // Gmail APIからの応答で置き換える
    from_email: 'your-email@example.com', // 認証済みユーザーのメールアドレスを使用
    to_email: data.to_email,
    cc_email: data.cc_email,
    bcc_email: data.bcc_email,
    subject: data.subject,
    body_text: data.body_text,
    body_html: data.body_html,
    sent_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`メールの送信に失敗しました: ${error.message}`);
  }

  revalidatePath('/admin/emails');
}

/**
 * メール設定を取得する
 */
export async function getEmailSettings() {
  const supabase = await getSupabaseServerClient();

  const { data: settings, error } = await supabase
    .from('email_settings')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116: データが存在しない
    throw new Error(`メール設定の取得に失敗しました: ${error.message}`);
  }

  return settings;
}

/**
 * メール設定を更新する
 * @param data 更新するメール設定データ
 */
export async function updateEmailSettings(data: {
  auto_archive_after_days?: number | null;
  signature?: string;
  notification_enabled?: boolean;
}) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from('email_settings').upsert({
    ...data,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`メール設定の更新に失敗しました: ${error.message}`);
  }

  revalidatePath('/admin/settings');
}

/**
 * Gmail認証情報を保存する
 * @param credentials Gmail認証情報
 */
export async function saveGmailCredentials(credentials: {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expiry_date: string;
}) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from('gmail_credentials').upsert({
    ...credentials,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Gmail認証情報の保存に失敗しました: ${error.message}`);
  }
}

/**
 * Gmail認証情報を取得する
 */
export async function getGmailCredentials() {
  const supabase = await getSupabaseServerClient();

  const { data: credentials, error } = await supabase
    .from('gmail_credentials')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Gmail認証情報の取得に失敗しました: ${error.message}`);
  }

  return credentials;
}

/**
 * メールの添付ファイルをダウンロードする
 */
export async function downloadEmailAttachment(
  emailId: string,
  attachmentId: string
) {
  const supabase = await getSupabaseServerClient();
  const client = await GmailClient.create();

  // 添付ファイルの情報を取得
  const { data: attachment, error: fetchError } = await supabase
    .from('email_attachments')
    .select('*, emails!inner(gmail_message_id)')
    .eq('id', attachmentId)
    .single();

  if (fetchError || !attachment) {
    console.error('Failed to fetch attachment info:', fetchError?.message);
    return null;
  }

  // Gmail APIから添付ファイルを取得
  const buffer = await client.getAttachment(
    attachment.emails?.gmail_message_id ?? '',
    attachment.attachment_id ?? ''
  );

  if (!buffer) {
    console.error('Failed to fetch attachment from Gmail API');
    return null;
  }

  // Supabase Storageに保存
  const { error: uploadError } = await supabase.storage
    .from('email-attachments')
    .upload(attachment.file_path ?? '', buffer, {
      upsert: true,
    });

  if (uploadError) {
    console.error('Failed to upload attachment:', uploadError.message);
    return null;
  }

  // ダウンロード済みフラグを更新
  await supabase
    .from('email_attachments')
    .update({
      is_downloaded: true,
      downloaded_at: new Date().toISOString(),
    })
    .eq('id', attachmentId);

  // 署名付きURLを生成
  const { data } = await supabase.storage
    .from('email-attachments')
    .createSignedUrl(attachment.file_path ?? '', 60); // 60秒間有効

  if (!data) return null;
  return data.signedUrl;
}

/**
 * Gmail認証を開始する
 */
export async function startGmailAuth() {
  try {
    const authUrl = generateAuthUrl();
    return { url: authUrl };
  } catch (error) {
    return {
      error: `Gmail認証の開始に失敗しました: ${(error as Error).message}`,
    };
  }
}

/**
 * Gmail認証状態を確認する
 */
export async function checkGmailAuthStatus() {
  try {
    const credentials = await getGmailCredentials();
    return {
      authenticated: !!credentials,
      error: null,
    };
  } catch (error) {
    return {
      authenticated: false,
      error: `認証状態の確認に失敗しました: ${(error as Error).message}`,
    };
  }
}
