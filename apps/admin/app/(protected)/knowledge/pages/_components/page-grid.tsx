'use client';

import { Card, CardContent, CardHeader } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Eye, Link2, Star } from 'lucide-react';
import type { KnowledgePage } from './page-list';
import { useRouter } from 'next/navigation';

interface PageGridProps {
  data: KnowledgePage[];
}

export function PageGrid({ data }: PageGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((page) => (
        <Card
          key={page.id}
          className="group hover:bg-accent/50 transition-colors cursor-pointer relative"
          onClick={() => router.push(`/admin/knowledge/pages/${page.id}`)}
        >
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {page.pin_status > 0 && (
                  <Star className="h-4 w-4 text-yellow-500" />
                )}
                <h3 className="font-semibold">{page.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                title="詳細を表示"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            <div className="text-sm text-muted-foreground">
              {page.project_name}
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div>閲覧数: {page.views}</div>
                <div className="flex items-center space-x-1">
                  <Link2 className="h-4 w-4" />
                  <span>{page.linked_count}</span>
                </div>
              </div>
              <div className="text-muted-foreground">
                {new Date(page.updated_at).toLocaleString('ja-JP')}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
