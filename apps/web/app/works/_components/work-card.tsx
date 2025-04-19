'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardFooter } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import type { Work } from '@kit/types/works';

export function WorkCard(work: Work) {
  // デフォルトのサムネイル画像へのパス
  const defaultThumbnail = '/images/default-thumbnail.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full">
          <Image
            src={work.thumbnail_url || defaultThumbnail}
            alt={work.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold">{work.title}</h3>
              <p className="text-sm text-muted-foreground">
                {work.description}
              </p>
            </div>
            <div className="flex gap-2">
              {work.github_url && (
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href={work.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              {work.website_url && (
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href={work.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {/* work_technologiesプロパティはここでは表示しない */}
          </div>
          <Button asChild className="w-full">
            <Link href={`/works/${work.slug}`}>詳細を見る</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
