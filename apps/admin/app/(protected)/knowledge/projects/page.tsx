import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Skeleton } from '@kit/ui/skeleton';
import { ProjectList } from './_components/project-list';
import { ProjectSettings } from './_components/project-settings';
import { getProjects, deleteProject } from '@kit/next/actions';
import { getProjectStats } from '~/actions/knowledge';
import type { Database } from '@kit/supabase/database';

type Project = Database['public']['Tables']['projects']['Row'];
type KnowledgeProject =
  Database['public']['Tables']['knowledge_projects']['Row'];
type KnowledgeSyncLog =
  Database['public']['Tables']['knowledge_sync_logs']['Row'];

async function ProjectListContainer() {
  // プロジェクト一覧を取得
  const { data: projects } = await getProjects();
  if (!projects) return null;

  // 各プロジェクトの統計情報を取得
  const projectsWithStats = await Promise.all(
    projects.map(async (project: Project) => {
      const stats = await getProjectStats(project.id);
      return {
        id: project.id,
        project_name: project.name,
        total_pages: 0,
        is_private: false,
        auto_sync_enabled: false,
        last_synced_at: project.last_activity_at,
        scrapbox_cookie: null,
        created_at: project.created_at,
        updated_at: project.updated_at,
        stats,
      } as KnowledgeProject & {
        stats: {
          totalPages: number;
          latestSync: KnowledgeSyncLog | null;
        };
      };
    })
  );

  // Server Actionをラップした関数を作成
  async function handleDeleteProject(projectId: string) {
    'use server';
    const result = await deleteProject(projectId);
    return {
      success: !result.error,
      error: result.error ? String(result.error) : undefined,
    };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>プロジェクト一覧</CardTitle>
      </CardHeader>
      <CardContent>
        <ProjectList
          projects={projectsWithStats}
          onDeleteProject={handleDeleteProject}
        />
      </CardContent>
    </Card>
  );
}

export default async function KnowledgeProjectsPage() {
  return (
    <div className="container space-y-8 py-8">
      <h1 className="text-3xl font-bold">プロジェクト管理</h1>

      <div className="grid gap-6">
        <Suspense fallback={<Skeleton className="h-[400px]" />}>
          <ProjectListContainer />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[400px]" />}>
          <Card>
            <CardHeader>
              <CardTitle>プロジェクト設定</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectSettings />
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'プロジェクト管理 - ナレッジベース',
  description: 'Scrapboxプロジェクトの管理と設定を行います。',
};
