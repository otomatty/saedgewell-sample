/**
 * フォーカスセッションの型定義
 */
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

/**
 * フォーカスセッションのステータス
 */
export type FocusStatus = 'active' | 'completed' | 'cancelled';

/**
 * フォーカススコア
 */
export type FocusScore = 1 | 2 | 3 | 4 | 5;

/**
 * インターバルのタイプ
 */
export type IntervalType = 'focus' | 'break' | 'long_break';
