import { atom } from 'jotai';
import type {
  Notification,
  NotificationSettings,
} from '@kit/types/notification';

/**
 * 通知一覧を管理するアトム
 */
export const notificationsAtom = atom<Notification[]>([]);

/**
 * 未読通知数を管理するアトム
 */
export const unreadCountAtom = atom((get) => {
  const notifications = get(notificationsAtom);
  return notifications.filter((notification) => !notification.isRead).length;
});

/**
 * 通知設定を管理するアトム
 */
export const notificationSettingsAtom = atom<NotificationSettings | null>(null);
