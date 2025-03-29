'use client';

import { cn } from '../../lib/utils';
import { useEffect, useState } from 'react';

interface InterestPatternProps {
  className?: string;
  color?: string;
}

export function InterestPattern({
  className,
  color = '#987D00',
}: InterestPatternProps) {
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
          d="M30 50 L70 50 M40 40 L60 40 M35 45 L65 45 M45 35 L55 35"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.4"
        />
        <path
          d="M40 55 C40 65, 60 65, 60 55"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.4"
        />
        <circle
          cx="50"
          cy="50"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
