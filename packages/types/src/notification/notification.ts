/**
 * 通知の種類を定義する型
 */
export type NotificationType =
	| "project_update"
	| "chat_message"
	| "milestone"
	| "document"
	| "system";

/**
 * 通知の型定義
 */
export interface Notification {
	id: string;
	userId: string;
	title: string;
	content: string;
	type: NotificationType;
	link?: string;
	isRead: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * 通知設定の型定義
 */
export interface NotificationSettings {
	id: string;
	userId: string;
	projectUpdates: boolean;
	chatMessages: boolean;
	milestones: boolean;
	documents: boolean;
	systemNotifications: boolean;
	emailNotifications: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * 通知設定の更新用型定義
 */
export type UpdateNotificationSettings = Partial<
	Omit<NotificationSettings, "id" | "userId" | "createdAt" | "updatedAt">
>;
