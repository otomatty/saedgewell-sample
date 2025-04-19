import type { FocusSession } from '@kit/types';

/**
 * 今日のフォーカス時間を計算する
 * @param sessions フォーカスセッションの配列
 * @returns 合計フォーカス時間（秒）
 */
export function calculateTodaysFocusTime(sessions: FocusSession[]): number {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // 今日のセッションのみをフィルタリング
  const todaySessions = sessions.filter((session) => {
    const sessionDate = new Date(session.started_at)
      .toISOString()
      .split('T')[0];
    return sessionDate === todayStr;
  });

  return todaySessions.reduce((total, session) => {
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
