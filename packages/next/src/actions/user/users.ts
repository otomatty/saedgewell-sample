/**
 * ユーザー管理に関するServer Actions
 * @module
 */
import { getSupabaseServerClient } from '@kit/supabase/server-client';

/**
 * ユーザー一覧を取得する
 */
export async function getUsers(params: {
  page: number;
  limit: number;
  search?: string;
  role?: string;
}) {
  'use server';

  const supabase = await getSupabaseServerClient();

  // プロフィールとロール情報を結合して取得
  let query = supabase.from('profiles').select(
    `
      *,
      user_roles!inner (
        role:roles (
          *
        )
      )
    `,
    { count: 'exact' }
  );

  // 検索条件の適用
  if (params.search) {
    query = query.or(
      `email.ilike.%${params.search}%,full_name.ilike.%${params.search}%`
    );
  }

  if (params.role) {
    query = query.eq('user_roles.roles.name', params.role);
  }

  // ページネーション
  const from = (params.page - 1) * params.limit;
  query = query
    .range(from, from + params.limit - 1)
    .order('created_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) throw error;

  // レスポンスデータの整形
  const users = data.map((profile) => ({
    ...profile,
    roles: profile.user_roles.map((ur) => ur.role),
  }));

  return {
    users,
    total: count ?? 0,
    page: params.page,
    limit: params.limit,
  };
}

/**
 * ユーザーのロールを更新する
 */
export async function updateUserRoles(userId: string, roleIds: string[]) {
  'use server';

  const supabase = await getSupabaseServerClient();

  // トランザクション的な処理
  // 1. 既存のロールを削除
  const { error: deleteError } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId);

  if (deleteError) throw deleteError;

  // 2. 新しいロールを追加
  const { error: insertError } = await supabase.from('user_roles').insert(
    roleIds.map((roleId) => ({
      user_id: userId,
      role_id: roleId,
    }))
  );

  if (insertError) throw insertError;
}

/**
 * 利用可能なロール一覧を取得する
 */
export async function getRoles() {
  'use server';

  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('name');

  if (error) throw error;

  return data;
}
