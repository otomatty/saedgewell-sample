'use client';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { RefreshCw, Settings, Trash2 } from 'lucide-react';
import type { Database } from '@kit/supabase/database';

type Project = Database['public']['Tables']['knowledge_projects']['Row'];
type ProjectStats = Awaited<
  ReturnType<typeof import('~/actions/knowledge').getProjectStats>
>;

interface ProjectHeaderProps {
  project: Project;
  stats: ProjectStats;
}

export function ProjectHeader({ project, stats }: ProjectHeaderProps) {
  const status = !stats.latestSync
    ? 'error'
    : stats.latestSync.status === 'completed'
      ? 'active'
      : 'syncing';

  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{project.project_name}</h1>
          <Badge
            variant={
              status === 'active'
                ? 'default'
                : status === 'syncing'
                  ? 'secondary'
                  : 'destructive'
            }
          >
            {status === 'active'
              ? '有効'
              : status === 'syncing'
                ? '同期中'
                : 'エラー'}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          最終同期:{' '}
          {project.last_synced_at
            ? new Date(project.last_synced_at).toLocaleString('ja-JP')
            : '未同期'}
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
