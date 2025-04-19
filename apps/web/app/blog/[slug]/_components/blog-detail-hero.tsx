'use client';

import { Badge } from '@kit/ui/badge';
import { BasicHero } from '@kit/ui/basic-hero';
import { formatDate } from '@kit/shared/utils';

interface BlogDetailHeroProps {
  title: string;
  description: string;
  publishedAt: string;
  categories: string[];
  estimatedReadingTime: number;
}

export const BlogDetailHero = ({
  title,
  description,
  publishedAt,
  categories,
  estimatedReadingTime,
}: BlogDetailHeroProps) => {
  return (
    <BasicHero title={title} description={description} pattern="dots" size="lg">
      <div className="flex flex-col items-center gap-4 mt-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          <span>•</span>
          <span>{estimatedReadingTime}分で読めます</span>
        </div>
      </div>
    </BasicHero>
  );
};
