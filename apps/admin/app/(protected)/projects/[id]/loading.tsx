import { Skeleton } from '@kit/ui/skeleton';
import { Card, CardContent, CardHeader } from '@kit/ui/card';

const SKELETON_ITEMS = {
  milestones: Array.from(
    { length: 3 },
    (_, i) => `milestone-skeleton-${i + 1}`
  ),
  tasks: Array.from({ length: 4 }, (_, i) => `task-skeleton-${i + 1}`),
  logs: Array.from({ length: 5 }, (_, i) => `log-skeleton-${i + 1}`),
};

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="container">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* マイルストーンのスケルトン */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {SKELETON_ITEMS.milestones.map((id) => (
                    <div key={id} className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* タスクのスケルトン */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {SKELETON_ITEMS.tasks.map((id) => (
                    <div key={id} className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* 進捗ログのスケルトン */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {SKELETON_ITEMS.logs.map((id) => (
                  <div key={id} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
