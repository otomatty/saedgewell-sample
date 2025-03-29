'use client';

import DailyStats from './daily-stats';
import { RealTimeTimeline } from './real-time-timeline';
import { Card } from '@kit/ui/card';

interface FocusSession {
  startedAt: Date;
  endedAt: Date | null;
  duration: number;
}

interface FocusStatsProps {
  todaysSessions: number;
  todaysFocusTime: number;
  currentSession: FocusSession | null;
  previousSessions: FocusSession[];
}

export function FocusStats({
  todaysSessions,
  todaysFocusTime,
  currentSession,
  previousSessions,
}: FocusStatsProps) {
  // タイマーが稼働中かどうかで表示を切り替え
  if (currentSession) {
    return (
      <Card className="p-4">
        <RealTimeTimeline
          currentSession={currentSession}
          previousSessions={previousSessions.filter(
            (session): session is FocusSession & { endedAt: Date } =>
              session.endedAt !== null
          )}
        />
      </Card>
    );
  }

  return (
    <DailyStats
      todaysSessions={todaysSessions}
      todaysFocusTime={todaysFocusTime}
    />
  );
}
