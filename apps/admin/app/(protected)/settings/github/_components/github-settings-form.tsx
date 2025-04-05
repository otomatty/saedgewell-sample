import { saveGitHubSettings, syncGitHubContributions } from '@kit/next/actions';
import { revalidatePath } from 'next/cache';
import { GitHubSettingsFormClient } from './github-settings-form-client';
import * as z from 'zod';

// Zodスキーマはサーバーとクライアントで共有可能
const formSchema = z.object({
  username: z.string().min(1, 'ユーザー名を入力してください'),
  accessToken: z.string().min(1, 'アクセストークンを入力してください'),
  autoSync: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export async function GitHubSettingsForm() {
  // 設定保存のServer Action
  async function handleSaveSettings(data: FormData) {
    'use server';
    try {
      // サーバーサイドでのバリデーションも行うとより安全
      const validatedData = formSchema.parse(data);

      const result = await saveGitHubSettings({
        username: validatedData.username,
        accessToken: validatedData.accessToken,
        autoSync: validatedData.autoSync,
      });

      if (!result.success) {
        throw result.error;
      }

      // 関連するパスを再検証
      revalidatePath('/settings/github'); // 必要に応じてパスを調整
      return { success: true };
    } catch (error) {
      console.error('設定保存エラー[Server Action]:', error);
      // ZodErrorの場合、詳細なエラー情報を返すことも可能
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  // 同期のServer Action
  async function handleSyncAction() {
    'use server';
    try {
      const result = await syncGitHubContributions();
      if (!result.success) {
        throw result.error;
      }
      // 同期が成功したら関連パスを再検証
      revalidatePath('/settings/github'); // 必要に応じてパスを調整
      return { success: true };
    } catch (error) {
      console.error('同期エラー[Server Action]:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  // クライアントコンポーネントにアクションを渡す
  return (
    <GitHubSettingsFormClient
      saveSettingsAction={handleSaveSettings}
      syncAction={handleSyncAction}
    />
  );
}
