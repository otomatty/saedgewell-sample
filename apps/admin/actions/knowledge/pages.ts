'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Database } from '../../lib/database.types';

type KnowledgePage = Database['public']['Tables']['knowledge_pages']['Row'];
type KnowledgePageWithDetails = KnowledgePage & {
  project_name: string;
  collaborators: {
    name: string;
    display_name: string;
    photo_url: string | null;
    is_last_editor: boolean;
  }[];
};

/**
 * ナレッジページの一覧を取得する
 * @param params 検索パラメータ
 * @returns ナレッジページの一覧
 */
export async function getKnowledgePages(params?: {
  projectId?: string;
  query?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await getSupabaseServerClient();
  const { projectId, query, limit = 10, offset = 0 } = params || {};

  let baseQuery = supabase
    .from('knowledge_pages')
    .select(
      `
      *,
      knowledge_projects (
        project_name
      ),
      knowledge_page_collaborators (
        knowledge_users (
          name,
          display_name,
          photo_url
        ),
        is_last_editor
      )
    `
    )
    .eq('persistent', true)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (projectId) {
    baseQuery = baseQuery.eq('project_id', projectId);
  }

  if (query) {
    baseQuery = baseQuery.or(
      `title.ilike.%${query}%,descriptions.cs.{${query}}`
    );
  }

  const { data: pages, error } = await baseQuery;

  if (error) {
    throw new Error(`Failed to fetch knowledge pages: ${error.message}`);
  }

  return pages.map((page) => ({
    ...page,
    project_name: page.knowledge_projects?.project_name,
    collaborators: page.knowledge_page_collaborators?.map((collaborator) => ({
      name: collaborator.knowledge_users?.name,
      display_name: collaborator.knowledge_users?.display_name,
      photo_url: collaborator.knowledge_users?.photo_url,
      is_last_editor: collaborator.is_last_editor,
    })),
  })) as KnowledgePageWithDetails[];
}

/**
 * ナレッジページの詳細を取得する
 * @param pageId ページID
 * @returns ナレッジページの詳細
 */
export async function getKnowledgePageDetail(pageId: string) {
  const supabase = await getSupabaseServerClient();

  const { data: page, error } = await supabase
    .from('knowledge_pages')
    .select(
      `
      *,
      knowledge_projects (
        project_name
      ),
      knowledge_page_details (
        lines,
        icons,
        files
      ),
      knowledge_page_collaborators (
        knowledge_users (
          name,
          display_name,
          photo_url
        ),
        is_last_editor
      )
    `
    )
    .eq('id', pageId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch knowledge page detail: ${error.message}`);
  }

  return {
    ...page,
    project_name: page.knowledge_projects?.project_name,
    details: page.knowledge_page_details,
    collaborators: page.knowledge_page_collaborators?.map((collaborator) => ({
      name: collaborator.knowledge_users?.name,
      display_name: collaborator.knowledge_users?.display_name,
      photo_url: collaborator.knowledge_users?.photo_url,
      is_last_editor: collaborator.is_last_editor,
    })),
  };
}

/**
 * ナレッジページのリンク関係を取得する
 * @param pageId ページID
 * @returns リンク元とリンク先のページ一覧
 */
export async function getKnowledgePageLinks(pageId: string) {
  const supabase = await getSupabaseServerClient();

  const [incomingLinks, outgoingLinks, relatedPages] = await Promise.all([
    // リンク元を取得
    supabase
      .from('knowledge_page_links')
      .select(
        `
        source_page:knowledge_pages!knowledge_page_links_source_page_id_fkey (
          id,
          title,
          knowledge_projects (
            project_name
          )
        )
      `
      )
      .eq('target_page_id', pageId)
      .eq('hop_level', 1),

    // リンク先を取得
    supabase
      .from('knowledge_page_links')
      .select(
        `
        target_page:knowledge_pages!knowledge_page_links_target_page_id_fkey (
          id,
          title,
          knowledge_projects (
            project_name
          )
        )
      `
      )
      .eq('source_page_id', pageId)
      .eq('hop_level', 1),

    // 2-hopのページを取得
    supabase
      .from('knowledge_page_links')
      .select(
        `
        target_page:knowledge_pages!knowledge_page_links_target_page_id_fkey (
          id,
          title,
          knowledge_projects (
            project_name
          )
        )
      `
      )
      .eq('source_page_id', pageId)
      .eq('hop_level', 2),
  ]);

  if (incomingLinks.error) {
    throw new Error(
      `Failed to fetch incoming links: ${incomingLinks.error.message}`
    );
  }

  if (outgoingLinks.error) {
    throw new Error(
      `Failed to fetch outgoing links: ${outgoingLinks.error.message}`
    );
  }

  if (relatedPages.error) {
    throw new Error(
      `Failed to fetch related pages: ${relatedPages.error.message}`
    );
  }

  return {
    incomingLinks: incomingLinks.data.map((link) => ({
      id: link.source_page.id,
      title: link.source_page.title,
      project_name: link.source_page.knowledge_projects?.project_name,
    })),
    outgoingLinks: outgoingLinks.data.map((link) => ({
      id: link.target_page.id,
      title: link.target_page.title,
      project_name: link.target_page.knowledge_projects?.project_name,
    })),
    relatedPages: relatedPages.data.map((link) => ({
      id: link.target_page.id,
      title: link.target_page.title,
      project_name: link.target_page.knowledge_projects?.project_name,
    })),
  };
}

/**
 * ナレッジページの検索を行う
 * @param query 検索クエリ
 * @returns 検索結果
 */
export async function searchKnowledgePages(query: string) {
  const supabase = await getSupabaseServerClient();

  const { data: pages, error } = await supabase
    .from('knowledge_pages')
    .select(
      `
      *,
      knowledge_projects (
        project_name
      )
    `
    )
    .or(`title.ilike.%${query}%,descriptions.cs.{${query}}`)
    .eq('persistent', true)
    .order('page_rank', { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(`Failed to search knowledge pages: ${error.message}`);
  }

  return pages.map((page) => ({
    id: page.id,
    title: page.title,
    project_name: page.knowledge_projects?.project_name,
    page_rank: page.page_rank,
  }));
}
