'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Database } from '@kit/supabase/database';
import type { ChatMessage } from '@kit/types/contact';

type DbResult<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
type ChatMessageRow = DbResult<'contact_chat_messages'>;

/**
 * チャットメッセージを作成する
 */
export async function createChatMessage(
  chatId: string,
  messageText: string,
  senderType: 'user' | 'assistant' | 'admin',
  faqId?: string,
  isEscalationRequest = false
): Promise<ChatMessage> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('contact_chat_messages')
    .insert({
      chat_id: chatId,
      message_text: messageText,
      sender_type: senderType,
      faq_id: faqId,
      is_escalation_request: isEscalationRequest,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating chat message:', error);
    throw new Error('メッセージの送信に失敗しました');
  }

  return data as ChatMessageRow;
}

export async function sendMessage(
  chatId: string,
  messageText: string,
  senderType: 'user' | 'assistant' | 'admin',
  faqId?: string,
  isEscalationRequest = false
): Promise<ChatMessage> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('contact_chat_messages')
    .insert({
      chat_id: chatId,
      message_text: messageText,
      sender_type: senderType,
      faq_id: faqId,
      is_escalation_request: isEscalationRequest,
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw new Error('メッセージの送信に失敗しました');
  }

  return data as ChatMessageRow;
}

/**
 * チャットメッセージ一覧を取得する
 */
export async function getChatMessages(chatId: string): Promise<ChatMessage[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('contact_chat_messages')
    .select(`
      *,
      files (*)
    `)
    .eq('chat_id', chatId)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching chat messages:', error);
    throw new Error('メッセージの取得に失敗しました');
  }

  return (data as ChatMessageRow[]) ?? [];
}

/**
 * チャットメッセージを取得する
 */
export async function getChatMessage(id: string): Promise<ChatMessage | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('contact_chat_messages')
    .select(`
      *,
      files (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching chat message:', error);
    throw new Error('メッセージの取得に失敗しました');
  }

  return data as ChatMessageRow | null;
}
