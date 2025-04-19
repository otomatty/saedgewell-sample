import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from './use-local-storage';
// パッケージからIntervalTypeをインポート
import type { IntervalType } from '@kit/types/focus';

// DEFAULT_TIMESに型アノテーションを追加
const DEFAULT_TIMES: Record<IntervalType, number> = {
  focus: 25 * 60, // 25分
  break: 5 * 60, // 5分 (shortBreakから名前変更)
  long_break: 15 * 60, // 15分 (longBreakから名前変更)
};

// 長い休憩までのフォーカス回数
const LONG_BREAK_INTERVAL = 4;

export function useFocusTimer() {
  // 現在のインターバルの種類
  const [intervalType, setIntervalType] = useState<IntervalType>('focus');

  // 完了したインターバル数
  const [completedIntervals, setCompletedIntervals] = useLocalStorage<number>(
    'focus-timer-completed-intervals',
    0
  );

  // タイマーが実行中かどうか
  const [isRunning, setIsRunning] = useState(false);

  // 現在のインターバルの残り時間
  const [time, setTime] = useState(DEFAULT_TIMES.focus);

  // 現在のインターバルの合計時間
  const [totalTime, setTotalTime] = useState(DEFAULT_TIMES.focus);

  // タイマーのインターバル参照
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 現在の時間をリセット
  const resetCurrentTime = useCallback(() => {
    setTime(DEFAULT_TIMES[intervalType]);
    setTotalTime(DEFAULT_TIMES[intervalType]);
  }, [intervalType]);

  // インターバルが完了したときの処理
  const completeInterval = useCallback(() => {
    // オーディオ通知などをここに追加可能

    // フォーカスセッションが完了した場合
    if (intervalType === 'focus') {
      const newCompletedIntervals = completedIntervals + 1;
      setCompletedIntervals(newCompletedIntervals);

      // 長い休憩に入るかどうかをチェック
      if (newCompletedIntervals % LONG_BREAK_INTERVAL === 0) {
        setIntervalType('long_break'); // 'longBreak'から'long_break'に変更
      } else {
        setIntervalType('break'); // 'shortBreak'から'break'に変更
      }
    } else {
      // 休憩が完了したらフォーカスに戻る
      setIntervalType('focus');
    }

    setIsRunning(false);
  }, [intervalType, completedIntervals, setCompletedIntervals]);

  // タイマーの開始/停止切り替え
  const toggleTimer = useCallback(() => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  }, []);

  // タイマーのリセット
  const resetTimer = useCallback(() => {
    // タイマーを停止
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRunning(false);
    setIntervalType('focus');
    setCompletedIntervals(0);
    setTime(DEFAULT_TIMES.focus);
    setTotalTime(DEFAULT_TIMES.focus);
  }, [setCompletedIntervals]);

  // インターバルの種類が変わったときの処理
  useEffect(() => {
    resetCurrentTime();
  }, [resetCurrentTime]);

  // タイマーの実行
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            // タイマーが0になったらインターバルを完了
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            completeInterval();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, completeInterval]);

  return {
    time,
    totalTime,
    intervalType,
    isRunning,
    completedIntervals,
    toggleTimer,
    resetTimer,
  };
}
