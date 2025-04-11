'use client';

import { motion } from 'motion/react';
import { Badge } from '@kit/ui/badge';

export interface ProcessCardProps {
  step: number;
  title: string;
  description: string;
  duration: string;
  isLast?: boolean;
}

export const ProcessCard = ({
  step,
  title,
  description,
  duration,
  isLast = false,
}: ProcessCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: step * 0.1 }}
      viewport={{ once: true }}
      className="relative pl-8 pb-8"
    >
      {/* タイムラインの線 */}
      {!isLast && (
        <div className="absolute left-[11px] top-[30px] w-[2px] h-full bg-border" />
      )}

      {/* ステップ番号の円 */}
      <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
        {step}
      </div>

      {/* コンテンツ */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{duration}</Badge>
        </div>
      </div>
    </motion.div>
  );
};
