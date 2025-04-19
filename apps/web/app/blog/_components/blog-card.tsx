'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import { formatDate } from '@kit/shared/utils';

interface BlogCardProps {
  title: string;
  description: string;
  slug: string;
  thumbnail: string;
  publishedAt: string;
  categories: string[];
  estimatedReadingTime: number;
}

export const BlogCard = ({
  title,
  description,
  slug,
  thumbnail,
  publishedAt,
  categories,
  estimatedReadingTime,
}: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Link href={`/blog/${slug}`} className="block h-full hover:no-underline">
        <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48 w-full">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardHeader className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-bold line-clamp-2">{title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                {description}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
              <span>{estimatedReadingTime}分で読めます</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
