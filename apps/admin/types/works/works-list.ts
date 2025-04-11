import type { Database } from '@kit/supabase/database'; // 生成されたsupabaseの型をインポート

/**
 * 実績の公開ステータスを表す型
 * Supabase の work_status ENUM 型を参照
 */
export type WorkStatus = Database['public']['Enums']['work_status'];
// export type WorkStatus = 'draft' | 'published' | 'archived' | string; // 古い定義を削除

/**
 * 実績一覧で表示するためのデータ型
 */
export interface WorkListItem {
  id: string; // uuid
  title: string;
  status: WorkStatus;
  category: string; // カテゴリ名
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  thumbnail_url: string | null;
}

/**
 * getWorksList Server Action のレスポンス型
 * データと総件数を含む
 */
export interface WorksListResponse {
  data: WorkListItem[];
  count: number;
}

/**
 * getWorksList Server Action のオプション
 */
export interface GetWorksListOptions {
  /** ソート対象カラム ('category' は work_categories.name を指す) */
  sortBy?:
    | 'title'
    | 'status'
    | 'published_at'
    | 'created_at'
    | 'updated_at'
    | 'category';
  sortDirection?: 'asc' | 'desc';
  filterByTitle?: string;
  filterByCategoryName?: string; // カテゴリ名でフィルター
  filterByCategoryId?: string; // カテゴリIDでフィルター（内部使用）
  filterByStatus?: WorkStatus; // ステータスでフィルター
  page?: number;
  pageSize?: number;
}
