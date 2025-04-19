import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Skeleton } from '@kit/ui/skeleton';
import { SyncLogs } from './_components/sync-logs';
import { SyncSettings } from './_components/sync-settings';
import { ManualSync } from './_components/manual-sync';

export default async function KnowledgeSyncPage() {
  return (
    <div className="container space-y-8 py-8">
      <h1 className="text-3xl font-bold">同期管理</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>手動同期</CardTitle>
          </CardHeader>
          <CardContent>
            <ManualSync />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>同期設定</CardTitle>
          </CardHeader>
          <CardContent>
            <SyncSettings />
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px]" />}>
        <Card>
          <CardHeader>
            <CardTitle>同期ログ</CardTitle>
          </CardHeader>
          <CardContent>
            <SyncLogs />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: '同期管理 - ナレッジベース',
  description: 'Scrapboxとの同期を管理します。',
};
