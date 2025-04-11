'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

/**
 * プロジェクト一覧を取得する
 * @returns プロジェクト一覧
 */
export async function getProjects() {
  const supabase = await getSupabaseServerClient();
  const { data: projects, error } = await supabase
    .from('knowledge_projects')
    .select('*')
    .order('project_name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return projects;
}

/**
 * プロジェクトの統計情報を取得する
 * @param projectId プロジェクトID
 * @returns プロジェクトの統計情報
 */
export async function getProjectStats(projectId: string) {
  const supabase = await getSupabaseServerClient();

  // ページ数を取得
  const { count: totalPages, error: countError } = await supabase
    .from('knowledge_pages')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  if (countError) {
    throw new Error(`Failed to fetch page count: ${countError.message}`);
  }

  // 最新の同期ログを取得
  const { data: latestSync, error: syncError } = await supabase
    .from('knowledge_sync_logs')
    .select('*')
    .eq('project_id', projectId)
    .order('sync_started_at', { ascending: false })
    .limit(1)
    .single();

  if (syncError && syncError.code !== 'PGRST116') {
    // PGRST116: no rows returned
    throw new Error(`Failed to fetch sync log: ${syncError.message}`);
  }

  // プレーンなオブジェクトに変換して返す
  return {
    totalPages: totalPages ?? 0,
    latestSync: latestSync
      ? {
          id: latestSync.id,
          project_id: latestSync.project_id,
          sync_started_at: latestSync.sync_started_at,
          sync_completed_at: latestSync.sync_completed_at,
          status: latestSync.status,
          pages_processed: latestSync.pages_processed,
          pages_updated: latestSync.pages_updated,
          error_message: latestSync.error_message,
          created_at: latestSync.created_at,
        }
      : null,
  };
}

/**
 * 最近更新されたページを取得する
 * @param limit 取得件数
 * @returns 最近更新されたページ一覧
 */
export async function getRecentPages(limit = 10) {
  const supabase = await getSupabaseServerClient();
  const { data: pages, error } = await supabase
    .from('knowledge_pages')
    .select(`
      *,
      knowledge_projects (
        project_name
      )
    `)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch recent pages: ${error.message}`);
  }

  return pages;
}

/**
 * プロジェクトの同期ステータスを取得する
 * @param projectId プロジェクトID
 * @returns 同期ステータス
 */
export async function getSyncStatus(projectId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: syncLogs, error } = await supabase
    .from('knowledge_sync_logs')
    .select('*')
    .eq('project_id', projectId)
    .order('sync_started_at', { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(`Failed to fetch sync status: ${error.message}`);
  }

  return syncLogs;
}

/**
 * プロジェクトのページ統計を取得する（ビュー数、リンク数など）
 * @param projectId プロジェクトID
 * @returns ページ統計
 */
export async function getPageStats(projectId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: pages, error } = await supabase
    .from('knowledge_pages')
    .select('views, linked_count, page_rank')
    .eq('project_id', projectId);

  if (error) {
    throw new Error(`Failed to fetch page stats: ${error.message}`);
  }

  // 統計情報を計算
  const stats = pages.reduce(
    (acc, page) => {
      acc.totalViews += page.views;
      acc.totalLinks += page.linked_count;
      acc.averagePageRank += page.page_rank;
      return acc;
    },
    { totalViews: 0, totalLinks: 0, averagePageRank: 0 }
  );

  if (pages.length > 0) {
    stats.averagePageRank /= pages.length;
  }

  return stats;
}

/**
 * プロジェクトを削除する
 * @param projectId プロジェクトID
 * @returns 削除結果
 */
export async function deleteProject(projectId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await getSupabaseServerClient();

    // プロジェクトの存在確認
    const { data: project, error: fetchError } = await supabase
      .from('knowledge_projects')
      .select('id')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      return {
        success: false,
        error: 'プロジェクトが見つかりませんでした。',
      };
    }

    // 関連する同期ログを削除
    const { error: syncLogDeleteError } = await supabase
      .from('knowledge_sync_logs')
      .delete()
      .eq('project_id', projectId);

    if (syncLogDeleteError) {
      return {
        success: false,
        error: `同期ログの削除に失敗しました: ${syncLogDeleteError.message}`,
      };
    }

    // 関連するページを削除
    const { error: pagesDeleteError } = await supabase
      .from('knowledge_pages')
      .delete()
      .eq('project_id', projectId);

    if (pagesDeleteError) {
      return {
        success: false,
        error: `ページの削除に失敗しました: ${pagesDeleteError.message}`,
      };
    }

    // プロジェクトを削除
    const { error: projectDeleteError } = await supabase
      .from('knowledge_projects')
      .delete()
      .eq('id', projectId);

    if (projectDeleteError) {
      return {
        success: false,
        error: `プロジェクトの削除に失敗しました: ${projectDeleteError.message}`,
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
 * プロジェクトを取得する
 * @param projectId プロジェクトID
 * @returns プロジェクト情報
 */
export async function getProject(projectId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: project, error } = await supabase
    .from('knowledge_projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  // プレーンなオブジェクトに変換して返す
  return {
    id: project.id,
    project_name: project.project_name,
    total_pages: project.total_pages,
    last_synced_at: project.last_synced_at,
    created_at: project.created_at,
    updated_at: project.updated_at,
    auto_sync_enabled: project.auto_sync_enabled,
    is_private: project.is_private,
    scrapbox_cookie: project.scrapbox_cookie,
  };
}

/**
 * プロジェクトのページ一覧を取得する
 * @param projectId プロジェクトID
 * @param page ページ番号
 * @param limit 1ページあたりの件数
 * @returns ページ一覧
 */
export async function getProjectPages(projectId: string, page = 1, limit = 10) {
  const supabase = await getSupabaseServerClient();
  const offset = (page - 1) * limit;

  const { data: pages, error } = await supabase
    .from('knowledge_pages')
    .select(`
      *,
      knowledge_page_collaborators (
        knowledge_users (
          name,
          display_name
        )
      )
    `)
    .eq('project_id', projectId)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch project pages: ${error.message}`);
  }

  return pages;
}

/**
 * プロジェクトの同期ログを取得する
 * @param projectId プロジェクトID
 * @param limit 取得件数
 * @returns 同期ログ一覧
 */
export async function getProjectSyncLogs(projectId: string, limit = 5) {
  const supabase = await getSupabaseServerClient();
  const { data: logs, error } = await supabase
    .from('knowledge_sync_logs')
    .select('*')
    .eq('project_id', projectId)
    .order('sync_started_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch sync logs:', error);
    return [];
  }

  // データをプレーンなオブジェクトに変換
  return (
    logs?.map((log) => ({
      id: log.id,
      project_id: log.project_id,
      sync_started_at: log.sync_started_at,
      sync_completed_at: log.sync_completed_at,
      status: log.status,
      pages_processed: log.pages_processed,
      pages_updated: log.pages_updated,
      error_message: log.error_message,
    })) ?? []
  );
}
