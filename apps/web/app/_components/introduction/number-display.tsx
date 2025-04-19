'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { NumberTicker } from '@kit/ui/number-ticker';
import { cn } from '@kit/ui/utils';

interface NumberDisplayProps {
  value: number;
  unit: string;
}

/**
 * 数値表示カードの背景コンポーネント
 */
export const NumberDisplay = ({ value, unit }: NumberDisplayProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute top-6 left-6 flex items-end justify-center z-20">
      <div
        className={cn('text-8xl font-bold transition-colors duration-200', {
          'text-primary': mounted,
          'opacity-0': !mounted,
          'opacity-100': mounted,
        })}
      >
        <NumberTicker value={value} className="text-inherit" />
      </div>
      <span className="text-2xl text-muted-foreground font-bold">{unit}</span>
    </div>
  );
};
