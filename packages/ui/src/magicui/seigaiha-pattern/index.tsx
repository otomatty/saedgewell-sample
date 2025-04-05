'use client';

import { cn } from '../../lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface SeigaihaPatternProps {
  className?: string;
  color?: string;
  size?: number;
  backgroundColor?: string;
  strokeWidth?: number;
}

export function SeigaihaPattern({
  className,
  color = '#987D00',
  backgroundColor,
  size = 120,
  strokeWidth = 1,
}: SeigaihaPatternProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // マウント前は何も表示しない
  if (!mounted) {
    return null;
  }

  const bgColor =
    backgroundColor ?? (resolvedTheme === 'dark' ? '#182e12' : '#fafbf3');

  const start = 14;
  const lineWidth = strokeWidth;
  const gap = 1;

  const style = {
    backgroundSize: `${size}px ${size / 2}px`,
    backgroundImage: `
      radial-gradient(circle farthest-side at 100% 150%, 
        ${bgColor} ${start}%, 
        ${color} ${start + gap}%, 
        ${color} ${start + lineWidth}%, 
        ${bgColor} ${start + lineWidth + gap}%, 
        ${bgColor} ${start + 16}%, 
        ${color} ${start + 17}%, 
        ${color} ${start + 17 + lineWidth}%, 
        ${bgColor} ${start + 17 + lineWidth + gap}%, 
        ${bgColor} ${start + 32}%, 
        ${color} ${start + 33}%, 
        ${color} ${start + 33 + lineWidth}%, 
        transparent ${start + 33 + lineWidth + gap}%, 
        transparent
      ),
      radial-gradient(circle farthest-side at 0% 150%, 
        ${bgColor} ${start}%, 
        ${color} ${start + gap}%, 
        ${color} ${start + lineWidth}%, 
        ${bgColor} ${start + lineWidth + gap}%, 
        ${bgColor} ${start + 16}%, 
        ${color} ${start + 17}%, 
        ${color} ${start + 17 + lineWidth}%, 
        ${bgColor} ${start + 17 + lineWidth + gap}%, 
        ${bgColor} ${start + 32}%, 
        ${color} ${start + 33}%, 
        ${color} ${start + 33 + lineWidth}%, 
        transparent ${start + 33 + lineWidth + gap}%, 
        transparent
      ),
      radial-gradient(circle closest-corner at 50% 100%, 
        ${bgColor} ${start + 14}%, 
        ${color} ${start + 16}%, 
        ${color} ${start + 16 + lineWidth}%, 
        ${bgColor} ${start + 16 + lineWidth + gap}%, 
        ${bgColor} ${start + 32}%, 
        ${color} ${start + 34}%, 
        ${color} ${start + 34 + lineWidth}%, 
        ${bgColor} ${start + 34 + lineWidth + gap}%, 
        ${bgColor} ${start + 64}%, 
        ${color} ${start + 66}%, 
        ${color} ${start + 66 + lineWidth}%, 
        transparent ${start + 66 + lineWidth + gap}%, 
        transparent
      ),
      radial-gradient(circle farthest-side at 100% 50%, 
        ${bgColor} ${start}%, 
        ${color} ${start + gap}%, 
        ${color} ${start + lineWidth}%, 
        ${bgColor} ${start + lineWidth + gap}%, 
        ${bgColor} ${start + 16}%, 
        ${color} ${start + 17}%, 
        ${color} ${start + 17 + lineWidth}%, 
        ${bgColor} ${start + 17 + lineWidth + gap}%, 
        ${bgColor} ${start + 32}%, 
        ${color} ${start + 33}%, 
        ${color} ${start + 33 + lineWidth}%, 
        transparent ${start + 33 + lineWidth + gap}%, 
        transparent
      ),
      radial-gradient(circle farthest-side at 0% 50%, 
        ${bgColor} ${start}%, 
        ${color} ${start + gap}%, 
        ${color} ${start + lineWidth}%, 
        ${bgColor} ${start + lineWidth + gap}%, 
        ${bgColor} ${start + 16}%, 
        ${color} ${start + 17}%, 
        ${color} ${start + 17 + lineWidth}%, 
        ${bgColor} ${start + 17 + lineWidth + gap}%, 
        ${bgColor} ${start + 32}%, 
        ${color} ${start + 33}%, 
        ${color} ${start + 33 + lineWidth}%, 
        ${bgColor} ${start + 33 + lineWidth + gap}%, 
        ${bgColor}
      )
    `,
    backgroundRepeat: 'repeat',
  } as const;

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300',
        mounted && 'opacity-100',
        className
      )}
      style={style}
    />
  );
}
