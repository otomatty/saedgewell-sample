import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { getPageStats } from '~/actions/knowledge';
import type { Database } from '@kit/supabase/database';

type Project = Database['public']['Tables']['knowledge_projects']['Row'];

interface PageStatsProps {
  projects: Project[];
}

export async function PageStats({ projects }: PageStatsProps) {
  // 全プロジェクトの統計を取得
  const projectStats = await Promise.all(
    projects.map(async (project) => {
      const stats = await getPageStats(project.id);
      return {
        projectName: project.project_name,
        ...stats,
      };
    })
  );

  // 全体の統計を計算
  const totalStats = projectStats.reduce(
    (acc, stats) => {
      acc.totalViews += stats.totalViews;
      acc.totalLinks += stats.totalLinks;
      acc.averagePageRank += stats.averagePageRank;
      return acc;
    },
    { totalViews: 0, totalLinks: 0, averagePageRank: 0 }
  );

  if (projects.length > 0) {
    totalStats.averagePageRank /= projects.length;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ページ統計</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">
              総閲覧数
            </h3>
            <p className="text-2xl font-bold">
              {totalStats.totalViews.toLocaleString()}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">
              総リンク数
            </h3>
            <p className="text-2xl font-bold">
              {totalStats.totalLinks.toLocaleString()}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">
              平均ページランク
            </h3>
            <p className="text-2xl font-bold">
              {totalStats.averagePageRank.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
