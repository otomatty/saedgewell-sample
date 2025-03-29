import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Skeleton } from '@kit/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { getProject, getProjectStats } from '~/actions/knowledge';
import { ProjectHeader } from './_components/project-header';
import { ProjectOverview } from './_components/project-overview';
import { ProjectPages } from './_components/project-pages';
import { ProjectSync } from './_components/project-sync';
import { ProjectSettings } from './_components/project-settings';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function ProjectContainer({ projectId }: { projectId: string }) {
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const stats = await getProjectStats(projectId);

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} stats={stats} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="pages">ページ一覧</TabsTrigger>
          <TabsTrigger value="sync">同期管理</TabsTrigger>
          <TabsTrigger value="settings">設定</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <ProjectOverview project={project} stats={stats} />
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <ProjectPages projectId={projectId} />
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <ProjectSync projectId={projectId} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <ProjectSettings projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  return (
    <div className="container py-8 space-y-8">
      <Suspense fallback={<Skeleton className="h-[600px]" />}>
        <ProjectContainer projectId={id} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return {
      title: 'プロジェクトが見つかりません',
    };
  }

  return {
    title: `${project.project_name} - プロジェクト詳細`,
    description: `${project.project_name}の詳細情報を表示します。`,
  };
}
