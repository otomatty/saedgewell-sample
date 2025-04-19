import { Suspense } from 'react';
import { PageHeader } from '@kit/ui/page-header';
import { ProjectsOverview } from './_components/projects-overview';
import { RecentPages } from './_components/recent-pages';
import { PageStats } from './_components/page-stats';
import { getRecentPages } from '~/actions/knowledge';
import { getProjects } from '@kit/next/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

export const metadata = {
  title: 'ナレッジベース管理',
  description: 'Scrapboxと連携したナレッジベースを管理します。',
};

export default async function KnowledgePage() {
  const [projectsResult, recentPages] = await Promise.all([
    getProjects(),
    getRecentPages(5),
  ]);

  const projects = projectsResult.data ?? [];

  return (
    <div className="space-y-4">
      <PageHeader title="ナレッジ管理" />
      <div className="container">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense
              fallback={
                <Card>
                  <CardHeader>
                    <CardTitle>プロジェクト概要</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-32 bg-muted animate-pulse rounded" />
                  </CardContent>
                </Card>
              }
            >
              <ProjectsOverview projects={projects} />
            </Suspense>

            <Suspense
              fallback={
                <Card>
                  <CardHeader>
                    <CardTitle>統計情報</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-32 bg-muted animate-pulse rounded" />
                  </CardContent>
                </Card>
              }
            >
              <PageStats projects={projects} />
            </Suspense>
          </div>

          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle>最近の更新</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-48 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            }
          >
            <RecentPages pages={recentPages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
