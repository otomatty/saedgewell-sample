import { Suspense } from 'react';
import { Card, CardContent } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Skeleton } from '@kit/ui/skeleton';
import { getUsersForDataTable } from '@kit/next/actions';
import { getAdminStats } from '~/actions/site';
import { DataTable } from '@kit/ui/data-table';
import { UserFilter } from '../../_components/user-filter';
import { columns } from '../../_components/columns';
import { StatsCard } from '../../_components/stats-card';
import { StatsGraph } from '../../_components/stats-graph';
import {
  Users,
  UserPlus,
  UserCheck,
  MessageSquare,
  Settings,
  PlusCircle,
} from 'lucide-react';
import { PageHeader } from '@kit/ui/page-header';

export default async function AdminHomePage() {
  const [initialData, stats] = await Promise.all([
    getUsersForDataTable({
      page: 1,
      limit: 10,
      search: '',
      role: '',
    }),
    getAdminStats(),
  ]);

  return (
    <>
      <div className="container">
        <PageHeader
          title="管理者ダッシュボード"
          description="サイトの管理を行います"
          variant="gradient"
          pattern="waves"
          breadcrumbs={[
            { href: '/dashboard', label: 'ダッシュボード' },
            { href: '/home', label: '管理者' },
          ]}
          actions={
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                設定
              </Button>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                新規作成
              </Button>
            </div>
          }
        />
      </div>

      <div className="container space-y-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<Skeleton className="h-32" />}>
            <StatsCard
              title="総ユーザー数"
              value={stats.totalUsers}
              icon={<Users />}
            />
          </Suspense>
          <StatsCard
            title="新規ユーザー"
            value={stats.newUsers.count}
            description="今月の新規登録"
            icon={<UserPlus />}
            trend={{
              value: stats.newUsers.trend,
              isPositive: stats.newUsers.trend > 0,
            }}
          />
          <StatsCard
            title="アクティブユーザー"
            value={stats.activeUsers.count}
            description="過去30日間"
            icon={<UserCheck />}
            trend={{
              value: stats.activeUsers.trend,
              isPositive: stats.activeUsers.trend > 0,
            }}
          />
          <StatsCard
            title="未対応のお問い合わせ"
            value={stats.pendingContacts}
            icon={<MessageSquare />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <StatsGraph
              title="ユーザー統計"
              data={stats.graphs.userStats}
              type="users"
            />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <StatsGraph
              title="アクティビティ統計"
              data={stats.graphs.activityStats}
              type="activity"
            />
          </Suspense>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">ユーザー管理</h2>
            <UserFilter />
          </div>

          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <Card>
              <CardContent className="pt-6">
                <DataTable columns={columns} data={initialData.users} />
              </CardContent>
            </Card>
          </Suspense>
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: '管理者ダッシュボード',
  description: 'サイトの管理を行います。',
};
