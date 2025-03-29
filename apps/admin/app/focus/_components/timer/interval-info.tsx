'use client';

import { Progress } from '@kit/ui/progress';
import { TIMER_SETTINGS } from '@kit/types';

export default function IntervalInfo({
  completedIntervals,
}: {
  completedIntervals: number;
}) {
  const totalIntervals = TIMER_SETTINGS.intervalsUntilLongBreak;
  const currentInterval = completedIntervals % totalIntervals;
  const progress = (currentInterval * 100) / totalIntervals;

  return (
    <div className="mt-6 w-full max-w-sm">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>次の長時間休憩まで</span>
        <span>{totalIntervals - currentInterval}セッション</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
