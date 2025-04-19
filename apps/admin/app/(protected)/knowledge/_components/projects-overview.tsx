import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { getProjectStats } from '~/actions/knowledge';
import type { Database } from '@kit/supabase/database';

type Project = Database['public']['Tables']['knowledge_projects']['Row'];

interface ProjectsOverviewProps {
  projects: Project[];
}

export async function ProjectsOverview({ projects }: ProjectsOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>プロジェクト一覧</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map(async (project) => {
          const stats = await getProjectStats(project.id);
          return (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{project.project_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.totalPages}ページ
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                最終同期:{' '}
                {stats.latestSync
                  ? new Date(
                      stats.latestSync.sync_completed_at ?? ''
                    ).toLocaleString('ja-JP')
                  : '未同期'}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
