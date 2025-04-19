import { Suspense } from 'react';
import { ProjectHeaderClient } from './project-header-client';
import { updateProject, deleteProject } from '@kit/next/actions';

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    emoji: string | null;
  };
}

/**
 * プロジェクトヘッダーのサーバーコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Object} props.project - プロジェクト情報
 * @returns {JSX.Element} プロジェクトヘッダーのUI
 */
export async function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectHeaderClient
        project={project}
        onUpdate={async (data) => {
          'use server';
          const { error } = await updateProject(project.id, data);
          if (error) throw error;
        }}
        onDelete={async () => {
          'use server';
          const { error } = await deleteProject(project.id);
          if (error) throw error;
        }}
      />
    </Suspense>
  );
}
