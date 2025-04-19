/**
 * マイルストーンの型定義
 */
export interface Milestone {
	id: string;
	title: string;
	description: string;
	dueDate: string;
	status: "not_started" | "in_progress" | "completed" | "delayed";
	progress: number;
}

/**
 * コミュニケーションメッセージの型定義
 */
export interface Message {
	id: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	content: string;
	createdAt: string;
	readBy: string[];
}

/**
 * ドキュメントの型定義
 */
export interface Document {
	id: string;
	title: string;
	description: string;
	type: "document" | "spreadsheet" | "presentation";
	updatedAt: string;
	updatedBy: {
		id: string;
		name: string;
		avatar?: string;
	};
	status: "draft" | "review" | "approved";
}
