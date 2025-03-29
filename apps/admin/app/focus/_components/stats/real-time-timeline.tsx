'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, subHours, addHours } from 'date-fns';
import { ja } from 'date-fns/locale';
import { formatTimerDisplay } from '~/utils';

interface FocusSession {
  startedAt: Date;
  endedAt: Date | null;
  duration: number;
}

interface RealTimeTimelineProps {
  currentSession: FocusSession | null;
  previousSessions: FocusSession[];
}

export function RealTimeTimeline({
  currentSession,
  previousSessions,
}: RealTimeTimelineProps) {
  const [now, setNow] = useState(() => new Date());

  // 3時間前から3時間後までの時間範囲を生成
  const timeRange = useMemo(() => {
    const start = subHours(now, 3);
    const end = addHours(now, 3);
    const hours: Date[] = [];
    let current = start;

    while (current <= end) {
      hours.push(new Date(current));
      current = addHours(current, 1);
    }
    return hours;
  }, [now]);

  // 1分ごとに現在時刻を更新
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // タイムライン上の位置を計算する関数
  const calculatePosition = (time: Date) => {
    const start = subHours(now, 3).getTime();
    const end = addHours(now, 3).getTime();
    const total = end - start;
    const position = ((time.getTime() - start) / total) * 100;
    return Math.max(0, Math.min(100, position));
  };

  return (
    <div className="relative w-full h-[300px]">
      {/* 時間軸 */}
      <div className="absolute h-full w-1 bg-muted left-8 transform">
        {timeRange.map((time) => (
          <div
            key={time.getTime()}
            className="absolute transform -translate-y-1/2 -left-2"
            style={{ top: `${calculatePosition(time)}%` }}
          >
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-2 bg-muted-foreground" />
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {format(time, 'HH:mm', { locale: ja })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 過去のセッション */}
      {previousSessions.map((session) => (
        <div key={session.startedAt.getTime()} className="group relative">
          <div
            className="absolute h-2 bg-primary/30 rounded-full left-6"
            style={{
              top: `${calculatePosition(session.startedAt)}%`,
              height: `${
                calculatePosition(session.endedAt || session.startedAt) -
                calculatePosition(session.startedAt)
              }%`,
              width: '4px',
            }}
          />
          {/* セッションログ */}
          <div
            className="absolute left-12 bg-card rounded-md p-2 shadow-xs border text-xs"
            style={{
              top: `${calculatePosition(session.startedAt)}%`,
              transform: 'translateY(-50%)',
            }}
          >
            <div className="font-medium">
              {format(session.startedAt, 'HH:mm', { locale: ja })} -{' '}
              {format(session.endedAt || now, 'HH:mm', { locale: ja })}
            </div>
            <div className="text-muted-foreground">
              {formatTimerDisplay(session.duration)}の集中
            </div>
          </div>
        </div>
      ))}

      {/* 現在のセッション */}
      {currentSession && (
        <div className="group relative">
          <div
            className="absolute bg-primary animate-pulse rounded-full left-6"
            style={{
              top: `${calculatePosition(currentSession.startedAt)}%`,
              height: `${calculatePosition(now) - calculatePosition(currentSession.startedAt)}%`,
              width: '4px',
            }}
          />
          {/* 現在のセッションログ */}
          <div
            className="absolute left-12 bg-card rounded-md p-2 shadow-xs border text-xs"
            style={{
              top: `${calculatePosition(currentSession.startedAt)}%`,
              transform: 'translateY(-50%)',
            }}
          >
            <div className="font-medium">
              {format(currentSession.startedAt, 'HH:mm', { locale: ja })} -
              集中中
            </div>
            <div className="text-muted-foreground">
              {formatTimerDisplay(currentSession.duration)}経過
            </div>
          </div>
        </div>
      )}

      {/* 現在時刻のインジケーター */}
      <div
        className="absolute h-0.5 w-4 bg-primary left-6 transform -translate-x-0"
        style={{ top: '50%' }}
      >
        <div className="absolute left-full ml-2 transform -translate-y-1/2">
          <div className="text-xs font-medium text-primary">現在</div>
        </div>
      </div>
    </div>
  );
}
