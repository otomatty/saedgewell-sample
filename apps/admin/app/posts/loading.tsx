import { PageHeader } from '@kit/ui/page-header';
import { Skeleton } from '@kit/ui/skeleton';
import { Card, CardContent } from '@kit/ui/card';

const SKELETON_ITEMS = {
  stats: Array.from({ length: 4 }, (_, i) => `stats-skeleton-${i + 1}`),
  posts: Array.from({ length: 5 }, (_, i) => `post-skeleton-${i + 1}`),
};

export default function Loading() {
  return (
    <div className="space-y-4">
      <PageHeader title="ブログ管理" />
      <div className="container">
        <div className="space-y-8">
          {/* 統計カードのグリッド */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SKELETON_ITEMS.stats.map((id) => (
              <Card key={id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between space-x-4">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                  <Skeleton className="mt-3 h-6 w-[60px]" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ブログ記事リスト */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
              {SKELETON_ITEMS.posts.map((id) => (
                <Card key={id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
