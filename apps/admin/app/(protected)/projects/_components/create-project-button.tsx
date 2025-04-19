import { createProject } from '@kit/next/actions';
import { revalidatePath } from 'next/cache';
import { CreateProjectButtonClient } from './create-project-button-client';

// Server Actionの型定義 (クライアントと共有)
interface CreateProjectActionParams {
  name: string;
  description: string;
  emoji: string;
}

export function CreateProjectButton() {
  // プロジェクト作成のServer Action
  async function handleCreateProject(params: CreateProjectActionParams) {
    'use server';
    try {
      const { name, description, emoji } = params;

      // サーバーサイドでのバリデーションも追加可能
      if (!name) {
        throw new Error('プロジェクト名は必須です。');
      }

      const { error } = await createProject({ name, description, emoji });

      if (error) {
        throw error;
      }

      // プロジェクト一覧ページを再検証
      revalidatePath('/projects'); // 実際のパスに合わせて調整
      return { success: true };
    } catch (error) {
      console.error('プロジェクト作成エラー[Server Action]:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  // クライアントコンポーネントにアクションを渡す
  return (
    <CreateProjectButtonClient createProjectAction={handleCreateProject} />
  );
}
