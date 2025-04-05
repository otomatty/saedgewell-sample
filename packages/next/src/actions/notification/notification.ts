'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { revalidatePath } from 'next/cache';
import type {
  Notification,
  UpdateNotificationSettings,
} from '@kit/types/notification';
import { snakeToCamel } from '@kit/shared/utils';

/**
 * 通知一覧を取得
 */
export async function getNotifications() {
  try {
    const supabase = await getSupabaseServerClient();

    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return notifications.map((notification) =>
      snakeToCamel(notification)
    ) as Notification[];
  } catch (error) {
    console.error('通知一覧の取得に失敗しました:', error);
    throw new Error('通知一覧の取得に失敗しました');
  }
}

/**
 * 通知を既読にする
 */
export async function markNotificationsAsRead(notificationIds: string[]) {
  try {
    const supabase = await getSupabaseServerClient();

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', notificationIds);

    if (error) {
      throw error;
    }

    revalidatePath('/app/dashboard');
  } catch (error) {
    console.error('通知の既読化に失敗しました:', error);
    throw new Error('通知の既読化に失敗しました');
  }
}

/**
 * 通知を作成
 */
export async function createNotification(
  notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    const supabase = await getSupabaseServerClient();

    const { error } = await supabase.from('notifications').insert([
      {
        user_id: notification.userId,
        title: notification.title,
        content: notification.content,
        type: notification.type,
        link: notification.link,
        is_read: notification.isRead,
      },
    ]);

    if (error) {
      throw error;
    }

    revalidatePath('/app/dashboard');
  } catch (error) {
    console.error('通知の作成に失敗しました:', error);
    throw new Error('通知の作成に失敗しました');
  }
}

/**
 * 通知設定を取得
 */
export async function getNotificationSettings() {
  try {
    const supabase = await getSupabaseServerClient();

    const { data: settings, error } = await supabase
      .from('notification_settings')
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return snakeToCamel(settings);
  } catch (error) {
    console.error('通知設定の取得に失敗しました:', error);
    throw new Error('通知設定の取得に失敗しました');
  }
}

/**
 * 通知設定を更新
 */
export async function updateNotificationSettings(
  settings: UpdateNotificationSettings
) {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    const { error } = await supabase
      .from('notification_settings')
      .update({
        project_updates: settings.projectUpdates,
        chat_messages: settings.chatMessages,
        milestones: settings.milestones,
        documents: settings.documents,
        system_notifications: settings.systemNotifications,
        email_notifications: settings.emailNotifications,
      })
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    revalidatePath('/app/dashboard');
  } catch (error) {
    console.error('通知設定の更新に失敗しました:', error);
    throw new Error('通知設定の更新に失敗しました');
  }
}
