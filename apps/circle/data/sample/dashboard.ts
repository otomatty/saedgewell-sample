/**
 * ダッシュボード関連のサンプルデータ
 */
import type { Milestone, Message, Document } from "@saedgewell/types";

/**
 * サンプルマイルストーン一覧
 */
export const sampleMilestones: Milestone[] = [
	{
		id: "1",
		title: "要件定義完了",
		description: "プロジェクトの要件定義とスコープの確定",
		dueDate: "2024-01-15",
		status: "completed",
		progress: 100,
	},
	{
		id: "2",
		title: "デザインレビュー",
		description: "UIデザインのレビューと承認",
		dueDate: "2024-02-01",
		status: "in_progress",
		progress: 75,
	},
	{
		id: "3",
		title: "MVP実装完了",
		description: "最小限の機能実装の完了",
		dueDate: "2024-02-15",
		status: "in_progress",
		progress: 45,
	},
	{
		id: "4",
		title: "テスト完了",
		description: "統合テストと受け入れテストの完了",
		dueDate: "2024-03-01",
		status: "not_started",
		progress: 0,
	},
];

/**
 * サンプルメッセージ一覧
 */
export const sampleMessages: Message[] = [
	{
		id: "1",
		userId: "user1",
		userName: "山田太郎",
		userAvatar: "/avatars/user1.png",
		content: "デザインレビューの日程を2/1に設定しました。",
		createdAt: "2024-01-10T10:00:00Z",
		readBy: ["user1", "user2"],
	},
	{
		id: "2",
		userId: "user2",
		userName: "鈴木花子",
		userAvatar: "/avatars/user2.png",
		content: "APIの仕様書を更新しました。確認をお願いします。",
		createdAt: "2024-01-09T15:30:00Z",
		readBy: ["user1"],
	},
	{
		id: "3",
		userId: "user3",
		userName: "佐藤次郎",
		userAvatar: "/avatars/user3.png",
		content: "テスト環境のセットアップが完了しました。",
		createdAt: "2024-01-09T09:15:00Z",
		readBy: ["user1", "user2", "user3"],
	},
];

/**
 * サンプルドキュメント一覧
 */
export const sampleDocuments: Document[] = [
	{
		id: "1",
		title: "プロジェクト計画書",
		description: "プロジェクトの目的、スコープ、スケジュール",
		type: "document",
		updatedAt: "2024-01-10T11:00:00Z",
		updatedBy: {
			id: "user1",
			name: "山田太郎",
			avatar: "/avatars/user1.png",
		},
		status: "approved",
	},
	{
		id: "2",
		title: "API仕様書",
		description: "RESTful APIのエンドポイントとパラメータ",
		type: "spreadsheet",
		updatedAt: "2024-01-09T16:00:00Z",
		updatedBy: {
			id: "user2",
			name: "鈴木花子",
			avatar: "/avatars/user2.png",
		},
		status: "review",
	},
	{
		id: "3",
		title: "デザインガイドライン",
		description: "UIコンポーネントとスタイルガイド",
		type: "presentation",
		updatedAt: "2024-01-08T14:30:00Z",
		updatedBy: {
			id: "user3",
			name: "佐藤次郎",
			avatar: "/avatars/user3.png",
		},
		status: "draft",
	},
];
