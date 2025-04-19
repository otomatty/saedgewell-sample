import { PageHeader } from '@kit/ui/page-header';
import { Skeleton } from '@kit/ui/skeleton';
import { Card, CardContent, CardHeader } from '@kit/ui/card';

const SKELETON_ITEMS = {
  projects: Array.from({ length: 3 }, (_, i) => `project-skeleton-${i + 1}`),
  stats: Array.from({ length: 4 }, (_, i) => `stat-skeleton-${i + 1}`),
  pages: Array.from({ length: 5 }, (_, i) => `page-skeleton-${i + 1}`),
};

export default function Loading() {
  return (
    <div className="space-y-4">
      <PageHeader title="ナレッジ管理" />
      <div className="container">
        <div className="space-y-6">
          {/* プロジェクトとステータスのグリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* プロジェクト概要のスケルトン */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {SKELETON_ITEMS.projects.map((id) => (
                  <div key={id} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 統計情報のスケルトン */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {SKELETON_ITEMS.stats.map((id) => (
                  <div key={id} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 最近のページのスケルトン */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {SKELETON_ITEMS.pages.map((id) => (
                <div key={id} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
