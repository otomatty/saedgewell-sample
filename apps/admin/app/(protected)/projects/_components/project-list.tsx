import { getProjects } from '@kit/next/actions';
import type { Project } from '@kit/types';
import { ProjectListClient } from './project-list-client';

// DBからのデータ型をProject型に変換するヘルパー関数
function transformProjectData(dbProject: Record<string, unknown>): Project {
  return {
    id: dbProject.id as string,
    userId: dbProject.user_id as string,
    name: dbProject.name as string,
    emoji: (dbProject.emoji as string | undefined) || undefined,
    description: (dbProject.description as string | undefined) || undefined,
    isArchived: (dbProject.is_archived as boolean | undefined) || false,
    createdAt:
      dbProject.created_at instanceof Date
        ? dbProject.created_at
        : new Date((dbProject.created_at as string | undefined) || new Date()),
    updatedAt:
      dbProject.updated_at instanceof Date
        ? dbProject.updated_at
        : new Date((dbProject.updated_at as string | undefined) || new Date()),
    lastActivityAt:
      dbProject.last_activity_at instanceof Date
        ? dbProject.last_activity_at
        : new Date(
            (dbProject.last_activity_at as string | undefined) ||
              (dbProject.updated_at as string | undefined) ||
              new Date()
          ),
  };
}

export async function ProjectList() {
  // サーバーサイドでデータを直接取得
  const { data } = await getProjects();

  // データをProject型に変換
  const projects: Project[] = data?.map(transformProjectData) ?? [];

  // サーバーサイドでソート
  const sortedProjects = [...projects].sort((a, b) => {
    // アーカイブされたプロジェクトは後ろに
    if (a.isArchived !== b.isArchived) {
      return a.isArchived ? 1 : -1;
    }
    // 最後のアクティビティ日時で降順ソート
    return b.lastActivityAt.getTime() - a.lastActivityAt.getTime();
  });

  // クライアントコンポーネントにソート済みのデータを渡す
  return <ProjectListClient projects={sortedProjects} />;
}
