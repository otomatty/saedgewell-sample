'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string | null;
  emoji?: string | null;
}

export function ProjectCard({
  id,
  name,
  description,
  emoji,
}: ProjectCardProps) {
  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Link href={`/projects/${id}`} className="flex-1">
            <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
              {emoji && <span>{emoji}</span>}
              <span>{name}</span>
            </CardTitle>
          </Link>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        {description && (
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
    </Card>
  );
}
