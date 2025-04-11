/**
 * 管理画面で使用する型定義
 * @module
 */

/**
 * 管理画面の統計情報
 */
export interface AdminStats {
	totalUsers: number;
	newUsers: {
		count: number;
		trend: number;
	};
	activeUsers: {
		count: number;
		trend: number;
	};
	pendingContacts: number;
}

/**
 * アクティビティログの種類
 */
export type ActivityType =
	| "user_login"
	| "user_register"
	| "content_update"
	| "contact_received";

/**
 * アクティビティログ
 */
export interface ActivityLog {
	id: string;
	type: ActivityType;
	userId?: string;
	description: string;
	metadata?: Record<string, unknown>;
	createdAt: string;
}

/**
 * 統計カードのプロパティ
 */
export interface StatsCardProps {
	title: string;
	value: string | number;
	description?: string;
	icon?: React.ReactNode;
	trend?: {
		value: number;
		isPositive: boolean;
	};
}

/**
 * ユーザー統計グラフのデータポイント
 */
export interface UserStatsDataPoint {
	date: string;
	totalUsers: number;
	activeUsers: number;
	newUsers: number;
}

/**
 * アクティビティグラフのデータポイント
 */
export interface ActivityStatsDataPoint {
	date: string;
	logins: number;
	registrations: number;
	contacts: number;
}

/**
 * グラフデータを含む管理画面の統計情報
 */
export interface AdminStatsWithGraphs extends AdminStats {
	graphs: {
		userStats: UserStatsDataPoint[];
		activityStats: ActivityStatsDataPoint[];
	};
}
