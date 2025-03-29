'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { formatTimerDisplay } from '@kit/shared/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useEffect, useRef } from 'react';
import { useConfetti } from '@kit/hooks/use-confetti';

interface FocusSession {
  startedAt: Date;
  endedAt: Date | null;
  duration: number; // 秒単位
}

interface FocusTimelineProps {
  sessions: FocusSession[];
  currentSession: FocusSession | null;
}

export default function FocusTimeline({
  sessions,
  currentSession,
}: FocusTimelineProps) {
  const { fireConfetti } = useConfetti();
  const prevSessionsLength = useRef(sessions.length);

  useEffect(() => {
    if (sessions.length > prevSessionsLength.current) {
      fireConfetti();
    }
    prevSessionsLength.current = sessions.length;
  }, [sessions.length, fireConfetti]);

  const completedSessions = sessions.filter(
    (session): session is FocusSession & { endedAt: Date } =>
      session.endedAt !== null
  );

  if (!currentSession && completedSessions.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">集中レコード</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {completedSessions.map((session) => (
            <div
              key={session.startedAt.getTime()}
              className="flex items-center gap-4 text-sm border-l-2 border-primary pl-4"
            >
              <div className="flex-1">
                <div className="font-medium">
                  {format(session.startedAt, 'HH:mm', { locale: ja })} -{' '}
                  {format(session.endedAt, 'HH:mm', { locale: ja })}
                </div>
                <div className="text-muted-foreground">
                  {formatTimerDisplay(session.duration)}の集中
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
