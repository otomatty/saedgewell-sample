'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import type { Database } from '@kit/supabase/database';

type Project = Database['public']['Tables']['knowledge_projects']['Row'];
type ProjectStats = Awaited<
  ReturnType<typeof import('~/actions/knowledge').getProjectStats>
>;

interface ProjectOverviewProps {
  project: Project;
  stats: ProjectStats;
}

export function ProjectOverview({ project, stats }: ProjectOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
          <CardDescription>プロジェクトの基本的な情報</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                プロジェクト名
              </dt>
              <dd className="text-lg">{project.project_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                作成日時
              </dt>
              <dd>{new Date(project.created_at).toLocaleString('ja-JP')}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                最終更新
              </dt>
              <dd>{new Date(project.updated_at).toLocaleString('ja-JP')}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ページ統計</CardTitle>
          <CardDescription>ページに関する統計情報</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                総ページ数
              </dt>
              <dd className="text-lg">{stats.totalPages}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                最終同期
              </dt>
              <dd>
                {stats.latestSync
                  ? new Date(
                      stats.latestSync.sync_completed_at ?? ''
                    ).toLocaleString('ja-JP')
                  : '未同期'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                同期状態
              </dt>
              <dd>
                {!stats.latestSync
                  ? '未同期'
                  : stats.latestSync.status === 'completed'
                    ? '同期完了'
                    : '同期中'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>同期情報</CardTitle>
          <CardDescription>最後の同期に関する情報</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.latestSync ? (
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  処理ページ数
                </dt>
                <dd className="text-lg">{stats.latestSync.pages_processed}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  更新ページ数
                </dt>
                <dd>{stats.latestSync.pages_updated}</dd>
              </div>
              {stats.latestSync.error_message && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    エラー
                  </dt>
                  <dd className="text-red-500">
                    {stats.latestSync.error_message}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-muted-foreground">同期履歴がありません</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
