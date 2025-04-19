/**
 * アプリケーションのエラーコード
 */
export type ErrorCode =
	| "UNAUTHORIZED"
	| "FORBIDDEN"
	| "NOT_FOUND"
	| "VALIDATION_ERROR"
	| "DATABASE_ERROR"
	| "INTERNAL_ERROR";

/**
 * アプリケーションのエラー型
 */
export interface AppError {
	code: ErrorCode;
	message: string;
	status: number;
	cause?: unknown;
}

/**
 * フォーカスセッション関連のエラーメッセージ
 */
export const FOCUS_ERROR_MESSAGES = {
	UNAUTHORIZED: "認証が必要です",
	FORBIDDEN: "この操作を実行する権限がありません",
	SESSION_NOT_FOUND: "セッションが見つかりません",
	INTERVAL_NOT_FOUND: "インターバルが見つかりません",
	SESSION_CREATE_FAILED: "セッションの作成に失敗しました",
	SESSION_UPDATE_FAILED: "セッションの更新に失敗しました",
	INTERVAL_CREATE_FAILED: "インターバルの作成に失敗しました",
	INTERVAL_UPDATE_FAILED: "インターバルの更新に失敗しました",
} as const;

export interface ApiError {
	message: string;
	status: number;
	details?: unknown;
}
