'use client';

import { cn } from '../../lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface NotePatternProps {
  className?: string;
  color?: string;
}

export function NotePattern({
  className,
  color = '#987D00',
}: NotePatternProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300',
        mounted && 'opacity-100',
        className
      )}
    >
      <svg
        viewBox="-20 -20 140 140"
        className="absolute inset-0 h-full w-full"
        style={{ color: color }}
        aria-hidden="true"
      >
        <path
          d="M30 35 L70 35 L70 65 L30 65 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.4"
        />
        <path
          d="M50 35 L50 65"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.4"
        />
        <path
          d="M35 42 L45 42 M35 48 L45 48 M35 54 L45 54 M35 60 L45 60"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.4"
        />
        <path
          d="M55 42 L65 42 M55 48 L65 48 M55 54 L65 54 M55 60 L65 60"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
