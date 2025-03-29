// types/focus.ts
export type FocusStatus = "in_progress" | "completed" | "interrupted";
export type IntervalType = "focus" | "short_break" | "long_break";
export type FocusScore = 1 | 2 | 3 | 4 | 5;
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = 0 | 1 | 2 | 3; // 0: なし, 1: 低, 2: 中, 3: 高

export interface FocusSession {
	id: string;
	user_id: string;
	project_id?: string | null;
	task_id?: string | null;
	knowledge_page_id?: string | null;
	started_at: string;
	ended_at?: string | null;
	status: FocusStatus;
	focus_score?: FocusScore | null;
	created_at: string | null;
	updated_at: string | null;
}

export interface FocusInterval {
	id: string;
	session_id: string;
	interval_type: IntervalType;
	started_at: string;
	ended_at?: string | null;
	created_at: string | null;
}

export type CreateFocusSessionInput = {
	project_id?: string;
	task_id?: string;
	knowledge_page_id?: string;
};

export type UpdateFocusSessionInput = {
	ended_at?: string;
	status?: FocusStatus;
	focus_score?: FocusScore;
};

export type CreateFocusIntervalInput = {
	session_id: string;
	interval_type: IntervalType;
};

export type UpdateFocusIntervalInput = {
	ended_at?: string;
};

// タイマー関連の型定義
export interface TimerState {
	isRunning: boolean;
	currentTime: number;
	intervalType: IntervalType;
	completedIntervals: number;
	totalIntervals: number;
}

// 固定値の定数
export const TIMER_SETTINGS = {
	focusDuration: 25 * 60, // 25分
	shortBreakDuration: 5 * 60, // 5分
	longBreakDuration: 30 * 60, // 30分
	intervalsUntilLongBreak: 4, // 4セッション毎に長時間休憩
} as const;

// 通知関連の型定義
export interface NotificationPayload {
	title: string;
	body: string;
	icon?: string;
	sound?: string;
}
