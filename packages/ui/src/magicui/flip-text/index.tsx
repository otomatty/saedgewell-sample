'use client';

import { AnimatePresence, motion, type Variants } from 'motion/react';

import { cn } from '../../lib/utils';

interface FlipTextProps {
  word: string;
  duration?: number;
  delayMultiple?: number;
  framerProps?: Variants;
  className?: string;
}

export function FlipText({
  word,
  duration = 0.5,
  delayMultiple = 0.08,
  framerProps = {
    hidden: { rotateX: -90, opacity: 0 },
    visible: { rotateX: 0, opacity: 1 },
  },
  className,
}: FlipTextProps) {
  return (
    <div className="flex justify-center space-x-2">
      <AnimatePresence mode="wait">
        {word.split('').map((char, i) => (
          <motion.span
            // biome-ignore lint/suspicious/noArrayIndexKey: 文字配列で安定したインデックスキーを使用
            key={i}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={framerProps}
            transition={{ duration, delay: i * delayMultiple }}
            className={cn('origin-center drop-shadow-xs', className)}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
