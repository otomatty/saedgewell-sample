'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { ScrapboxClient } from '../../lib/server/scrapbox';
import type { Database } from '../../lib/database.types';

type KnowledgePage = Database['public']['Tables']['knowledge_pages']['Insert'];

/**
 * プロジェクトの存在確認を行う
 * @param projectName プロジェクト名
 * @returns プロジェクトの情報（存在する場合）
 */
export async function checkProjectExists(projectName: string): Promise<{
  exists: boolean;
  count?: number;
  projectName?: string;
  error?: string;
}> {
  try {
    // 環境変数からScrapboxのcookieを取得
    const scrapboxCookie = process.env.SCRAPBOX_COOKIE;
    if (!scrapboxCookie) {
      return {
        exists: false,
        error: 'Scrapboxの認証情報が設定されていません。',
      };
    }

    const client = new ScrapboxClient({
      cookie: scrapboxCookie,
    });

    const pages = await client.getAllPages(projectName);
    return {
      exists: true,
      count: pages.length,
      projectName: projectName,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return {
          exists: false,
          error: 'プロジェクトが見つかりませんでした。',
        };
      }
      if (error.message.includes('認証')) {
        return {
          exists: false,
          error: error.message,
        };
      }
    }
    throw error;
  }
}

/**
 * プロジェクトを登録する
 * @param projectName プロジェクト名
 * @param totalPages 総ページ数
 */
export async function registerProject(
  projectName: string,
  totalPages: number
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await getSupabaseServerClient();

    // プロジェクトの重複チェック
    const { data: existingProject } = await supabase
      .from('knowledge_projects')
      .select('id')
      .eq('project_name', projectName)
      .single();

    if (existingProject) {
      return {
        success: false,
        error: 'このプロジェクトは既に登録されています。',
      };
    }

    // プロジェクトの登録
    const { data: project, error } = await supabase
      .from('knowledge_projects')
      .insert({
        project_name: projectName,
        total_pages: totalPages,
        last_synced_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `プロジェクトの登録に失敗しました: ${error.message}`,
      };
    }

    // 同期ログの作成
    const { error: syncLogError } = await supabase
      .from('knowledge_sync_logs')
      .insert({
        project_id: project.id,
        sync_started_at: new Date().toISOString(),
        sync_completed_at: new Date().toISOString(),
        status: 'completed',
        pages_processed: 0,
        pages_updated: 0,
      });

    if (syncLogError) {
      return {
        success: false,
        error: `同期ログの作成に失敗しました: ${syncLogError.message}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '不明なエラーが発生しました。',
    };
  }
}

/**
 * 同期ログを取得する
 * @param limit 取得件数
 * @returns 同期ログ一覧
 */
export async function getSyncLogs(limit = 20) {
  const supabase = await getSupabaseServerClient();
  const { data: logs, error } = await supabase
    .from('knowledge_sync_logs')
    .select(`
			*,
			knowledge_projects (
				project_name
			)
		`)
    .order('sync_started_at', { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return logs;
}

/**
 * プロジェクトごとの同期設定を更新する
 * @param projectId プロジェクトID
 * @param settings 同期設定
 */
export async function updateProjectSyncSettings(
  projectId: string,
  settings: {
    scrapbox_cookie?: string;
    auto_sync_enabled?: boolean;
    is_private?: boolean;
  }
): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await getSupabaseServerClient();

  try {
    const { error } = await supabase
      .from('knowledge_projects')
      .update({
        scrapbox_cookie: settings.scrapbox_cookie,
        auto_sync_enabled: settings.auto_sync_enabled,
        is_private: settings.is_private,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    if (error) {
      return {
        success: false,
        error: `同期設定の更新に失敗しました: ${error.message}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '不明なエラーが発生しました。',
    };
  }
}

/**
 * プロジェクトの同期設定を取得する
 * @param projectId プロジェクトID
 */
export async function getProjectSyncSettings(projectId: string): Promise<{
  scrapbox_cookie?: string;
  auto_sync_enabled: boolean;
  is_private: boolean;
  error?: string;
}> {
  const supabase = await getSupabaseServerClient();

  try {
    const { data: project, error } = await supabase
      .from('knowledge_projects')
      .select('scrapbox_cookie, auto_sync_enabled, is_private')
      .eq('id', projectId)
      .single();

    if (error) {
      return {
        auto_sync_enabled: false,
        is_private: false,
        error: `同期設定の取得に失敗しました: ${error.message}`,
      };
    }

    return {
      scrapbox_cookie: project.scrapbox_cookie ?? undefined,
      auto_sync_enabled: project.auto_sync_enabled ?? false,
      is_private: project.is_private ?? false,
    };
  } catch (error) {
    return {
      auto_sync_enabled: false,
      is_private: false,
      error:
        error instanceof Error ? error.message : '不明なエラーが発生しました。',
    };
  }
}

/**
 * プロジェクトの同期を実行する
 * @param projectId プロジェクトID
 * @returns 同期結果
 */
export async function syncProject(projectId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await getSupabaseServerClient();

  try {
    // 1. プロジェクト情報の取得
    const { data: project } = await supabase
      .from('knowledge_projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (!project) {
      return {
        success: false,
        error: 'プロジェクトが見つかりませんでした。',
      };
    }

    // 2. 同期ログの作成（開始）
    const { data: syncLog, error: createLogError } = await supabase
      .from('knowledge_sync_logs')
      .insert({
        project_id: projectId,
        sync_started_at: new Date().toISOString(),
        status: 'processing',
        pages_processed: 0,
        pages_updated: 0,
      })
      .select()
      .single();

    if (createLogError) {
      throw new Error(
        `同期ログの作成に失敗しました: ${createLogError.message}`
      );
    }

    // 3. Scrapboxからページ情報を取得
    const scrapboxCookie = project.is_private
      ? project.scrapbox_cookie || process.env.SCRAPBOX_COOKIE
      : process.env.SCRAPBOX_COOKIE;

    if (!scrapboxCookie) {
      throw new Error('Scrapboxの認証情報が設定されていません。');
    }

    const client = new ScrapboxClient({ cookie: scrapboxCookie });
    const pages = await client.getAllPages(project.project_name);

    // 4. ページ情報の更新
    let updatedCount = 0;
    for (const page of pages) {
      // ページの更新処理
      const { data: existingPage } = await supabase
        .from('knowledge_pages')
        .select('updated_at')
        .eq('project_id', projectId)
        .eq('scrapbox_id', page.id)
        .single();

      if (
        !existingPage ||
        new Date(existingPage.updated_at) < new Date(page.updated)
      ) {
        await supabase
          .from('knowledge_pages')
          .upsert({
            project_id: projectId,
            scrapbox_id: page.id,
            title: page.title,
            views: Number(page.views),
            linked_count: Number(page.linked),
            pin_status: page.pin ? 1 : 0,
            updated_at: new Date(page.updated).toISOString(),
            created_at: new Date().toISOString(),
          } satisfies KnowledgePage)
          .select();
        updatedCount++;
      }
    }

    // 5. 同期ログの更新（完了）
    await supabase
      .from('knowledge_sync_logs')
      .update({
        sync_completed_at: new Date().toISOString(),
        status: 'completed',
        pages_processed: pages.length,
        pages_updated: updatedCount,
      })
      .eq('id', syncLog.id);

    // 6. プロジェクト情報の更新
    await supabase
      .from('knowledge_projects')
      .update({
        last_synced_at: new Date().toISOString(),
        total_pages: pages.length,
      })
      .eq('id', projectId);

    return { success: true };
  } catch (error) {
    // エラー発生時は同期ログを更新
    if (error instanceof Error) {
      await supabase
        .from('knowledge_sync_logs')
        .update({
          sync_completed_at: new Date().toISOString(),
          status: 'error',
          error_message: error.message,
        })
        .eq('project_id', projectId)
        .eq('status', 'processing');
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : '不明なエラーが発生しました。',
    };
  }
}

/**
 * 自動同期が有効なプロジェクトを取得する
 * @returns 自動同期が有効なプロジェクトの一覧
 */
export async function getAutoSyncProjects(): Promise<{
  projects: {
    id: string;
    project_name: string;
    last_synced_at: string;
    scrapbox_cookie?: string;
    is_private: boolean;
  }[];
  error?: string;
}> {
  const supabase = await getSupabaseServerClient();

  try {
    const { data: projects, error } = await supabase
      .from('knowledge_projects')
      .select('id, project_name, last_synced_at, scrapbox_cookie, is_private')
      .eq('auto_sync_enabled', true)
      .order('last_synced_at', { ascending: true });

    if (error) {
      return {
        projects: [],
        error: `プロジェクトの取得に失敗しました: ${error.message}`,
      };
    }

    return {
      projects:
        projects?.map((project) => ({
          ...project,
          scrapbox_cookie: project.scrapbox_cookie ?? undefined,
        })) ?? [],
    };
  } catch (error) {
    return {
      projects: [],
      error:
        error instanceof Error ? error.message : '不明なエラーが発生しました。',
    };
  }
}

/**
 * 自動同期を実行する
 * 1時間以上同期されていないプロジェクトを対象に同期を実行する
 */
export async function runAutoSync(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { projects, error } = await getAutoSyncProjects();
    if (error) {
      throw new Error(error);
    }

    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const projectsToSync = projects.filter(
      (project) => new Date(project.last_synced_at) < oneHourAgo
    );

    for (const project of projectsToSync) {
      try {
        await syncProject(project.id);
      } catch (error) {
        console.error(
          `Failed to sync project ${project.project_name}:`,
          error instanceof Error ? error.message : error
        );
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '不明なエラーが発生しました。',
    };
  }
}
