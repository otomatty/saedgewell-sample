'use client';

import { useEffect, useState } from 'react';
import { formatTimerDisplay } from '@kit/utils';
import { TIMER_SETTINGS, type IntervalType } from '@kit/types';

export default function TimerDisplay({
  time,
  intervalType,
  totalTime,
}: {
  time: number;
  intervalType: IntervalType;
  totalTime: number;
}) {
  // 進捗率を計算（0-100）
  const progress = ((totalTime - time) / totalTime) * 100;

  // SVGの設定
  const size = 300;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      {/* SVG Circle */}
      <svg
        aria-label="Timer Progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        role="timer"
        width={size}
        height={size}
        className="-rotate-90"
      >
        {/* 背景の円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* プログレス円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>

      {/* 時間表示 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-mono font-bold mb-2">
          {formatTimerDisplay(time)}
        </div>
        <div className="text-lg font-semibold text-muted-foreground capitalize">
          {intervalType.replace('_', ' ')}
        </div>
      </div>
    </div>
  );
}
