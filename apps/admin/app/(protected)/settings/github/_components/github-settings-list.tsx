import { getGitHubSettings, syncGitHubContributions } from '@kit/next/actions';
import type { GitHubSettings } from '@kit/types';
import { snakeToCamel } from '@kit/shared/utils';
import { GitHubSettingsListClient } from './github-settings-list-client';
import { revalidatePath } from 'next/cache';

// DBからのデータ型をフロントエンドで使いやすい形式に変換するヘルパー関数
// （クライアントコンポーネントから移動）
function transformSettingData(
  dbSetting: Record<string, unknown>
): GitHubSettings {
  return {
    ...(snakeToCamel(dbSetting) as Omit<
      GitHubSettings,
      'lastSyncedAt' | 'createdAt' | 'updatedAt'
    >),
    lastSyncedAt:
      dbSetting.last_synced_at instanceof Date
        ? dbSetting.last_synced_at
        : typeof dbSetting.last_synced_at === 'string'
          ? new Date(dbSetting.last_synced_at)
          : null,
    createdAt:
      dbSetting.created_at instanceof Date
        ? dbSetting.created_at
        : new Date((dbSetting.created_at as string | undefined) ?? ''),
    updatedAt:
      dbSetting.updated_at instanceof Date
        ? dbSetting.updated_at
        : new Date((dbSetting.updated_at as string | undefined) ?? ''),
  };
}

export async function GitHubSettingsList() {
  // サーバーサイドでデータを直接取得
  const settingsResult = await getGitHubSettings();

  if (!settingsResult.success) {
    // エラーハンドリング: エラーメッセージを表示するか、ログに記録
    console.error('設定の取得に失敗しました:', settingsResult.error);
    // ここでエラーコンポーネントを返すか、空のリストを表示するかを決定
    return <div>設定の取得中にエラーが発生しました。</div>;
  }

  // 取得したデータをフロントエンドに適した形式に変換
  const initialSettings = settingsResult.data?.map(transformSettingData) ?? [];

  // Server Actionの定義
  async function handleSyncAction() {
    'use server';
    try {
      const result = await syncGitHubContributions();
      if (!result.success) {
        throw result.error;
      }
      // 成功した場合、関連するパスを再検証してデータを更新
      revalidatePath('/settings/github'); // パスは実際の状況に合わせてください
      return { success: true };
    } catch (error) {
      console.error('同期に失敗しました:', error);
      // エラー情報をクライアントに返す
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  // クライアントコンポーネントにデータとアクションを渡す
  return (
    <GitHubSettingsListClient
      initialSettings={initialSettings}
      syncAction={handleSyncAction}
    />
  );
}
