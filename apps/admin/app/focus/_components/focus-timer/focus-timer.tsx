'use client';

import { useEffect, useState } from 'react';
import TimerDisplay from '../timer/timer-display';
import TimerControls from '../timer/timer-controls';
import IntervalInfo from '../timer/interval-info';
import { FocusStats } from '../stats/focus-stats';
import FocusTimeline from '../stats/focus-timeline';
import { useFocusTimer } from '~/hooks/use-focus-timer';
import { Button } from '@kit/ui/button';
import { RotateCcw } from 'lucide-react';
import type { FocusSession } from '~/types/focus';
import { calculateTotalFocusTime } from '~/utils/focus/calculate';
import { calculateTodaysFocusTime } from '~/utils/focus/time-calculator';

interface FocusTimerProps {
  initialSessions: FocusSession[];
}

export default function FocusTimer({ initialSessions }: FocusTimerProps) {
  const {
    time,
    totalTime,
    intervalType,
    isRunning,
    completedIntervals,
    toggleTimer,
    resetTimer,
  } = useFocusTimer();

  const [sessions, setSessions] = useState<FocusSession[]>(initialSessions);
  const [totalFocusTime, setTotalFocusTime] = useState(0);

  useEffect(() => {
    setTotalFocusTime(calculateTotalFocusTime(sessions));
  }, [sessions]);

  // セッションデータの整形
  const timelineSessions = sessions.map((session) => ({
    startedAt: new Date(session.started_at),
    endedAt: session.ended_at ? new Date(session.ended_at) : null,
    duration: session.ended_at
      ? (new Date(session.ended_at).getTime() -
          new Date(session.started_at).getTime()) /
        1000
      : (new Date().getTime() - new Date(session.started_at).getTime()) / 1000,
  }));

  // 現在のセッションを取得
  const currentSession = isRunning
    ? {
        startedAt: new Date(),
        endedAt: null,
        duration: time,
      }
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Timer Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card rounded-lg p-6 shadow-xs flex flex-col items-center">
          <TimerDisplay
            time={time}
            totalTime={totalTime}
            intervalType={intervalType}
          />
          <div className="flex flex-col items-center gap-6 w-full">
            <TimerControls isRunning={isRunning} onToggle={toggleTimer} />
            <IntervalInfo completedIntervals={completedIntervals} />
            {/* リセットボタン */}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={resetTimer}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              リセット
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="space-y-6">
        <div className="bg-card rounded-lg p-6 shadow-xs">
          <h2 className="text-xl font-semibold mb-4">Today&apos;s Focus</h2>
          <FocusStats
            todaysSessions={sessions.length}
            todaysFocusTime={calculateTodaysFocusTime(sessions)}
            currentSession={currentSession}
            previousSessions={timelineSessions}
          />
        </div>

        {/* Focus Timeline */}
        <FocusTimeline
          sessions={timelineSessions}
          currentSession={currentSession}
        />
      </div>
    </div>
  );
}
