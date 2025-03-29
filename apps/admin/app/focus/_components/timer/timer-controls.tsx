'use client';

import { Button } from '@kit/ui/button';
import { Play, Pause } from 'lucide-react';
import { useSetAtom } from 'jotai';
import { sidebarOpenAtom } from '@kit/store';

export default function TimerControls({
  isRunning,
  onToggle,
}: {
  isRunning: boolean;
  onToggle: () => void;
}) {
  const setSidebarOpen = useSetAtom(sidebarOpenAtom);

  const handleToggle = () => {
    onToggle();
    if (!isRunning) {
      // タイマー開始時にサイドバーを閉じる
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <Button size="lg" className="w-32 gap-2" onClick={handleToggle}>
        {isRunning ? (
          <>
            <Pause className="h-5 w-5" />
            <span>一時停止</span>
          </>
        ) : (
          <>
            <Play className="h-5 w-5" />
            <span>開始</span>
          </>
        )}
      </Button>
    </div>
  );
}
