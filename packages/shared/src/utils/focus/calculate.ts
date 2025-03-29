import type { FocusSession } from '@kit/types';

/**
 * セッションの合計フォーカス時間を計算する（秒単位）
 */
export function calculateTotalFocusTime(sessions: FocusSession[]): number {
  return sessions.reduce((total, session) => {
    if (session.ended_at) {
      return (
        total +
        (new Date(session.ended_at).getTime() -
          new Date(session.started_at).getTime()) /
          1000
      );
    }
    return total;
  }, 0);
}

/**
 * セッションの経過時間を計算する（秒単位）
 */
export function calculateSessionDuration(session: FocusSession): number {
  const endTime = session.ended_at ? new Date(session.ended_at) : new Date();
  return (endTime.getTime() - new Date(session.started_at).getTime()) / 1000;
}
