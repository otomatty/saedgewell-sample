'use client';

import { Badge } from '@kit/ui/badge';
import { Card } from '@kit/ui/card';
import type { WorkWithRelations } from '@kit/types';
import { motion } from 'motion/react';

interface WorkCardProps {
  work: WorkWithRelations;
}

/**
 * 実績カードコンポーネント
 * 縦長のサムネイル画像を中心に表示し、タイトルと技術スタックを下部に配置
 */
export const WorkCard = ({ work }: WorkCardProps) => {
  // work_technologiesが存在し、かつ配列であることを確認
  const validTechnologies = Array.isArray(work?.work_technologies)
    ? work.work_technologies.filter(
        (tech) => tech?.technology?.id && tech?.technology?.name
      )
    : [];

  return (
    <div className="h-full space-y-3">
      {/* カード（画像のみ） */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card className="overflow-hidden group cursor-pointer">
          <div className="relative aspect-3/4">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <img
              src={work.thumbnail_url || ''}
              alt={work.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </Card>
      </motion.div>

      {/* タイトルと技術スタック */}
      <div className="space-y-2">
        <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
          {work.title}
        </h3>
        <div className="flex flex-wrap gap-1">
          {validTechnologies.slice(0, 3).map((tech) => (
            <Badge
              key={tech.technology.id}
              variant="outline"
              className="text-xs bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground border-primary"
            >
              {tech.technology.name}
            </Badge>
          ))}
          {validTechnologies.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground border-primary"
            >
              +{validTechnologies.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
