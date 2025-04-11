/**
 * ユーザー管理に関するServer Actions
 * @module
 */
'use server';

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
 * 管理者ダッシュボードのユーザーテーブル用に最適化されたユーザー一覧を取得する
 */
export async function getUsersForDataTable(params: {
  page: number;
  limit: number;
  search?: string;
  role?: string;
}) {
  const supabase = await getSupabaseServerClient();

  // プロフィールとロール情報を結合して取得 (必要なカラムのみ)
  let query = supabase.from('profiles').select(
    ` id, email, full_name, avatar_url, created_at,
      user_roles!inner (
        role:roles ( id, name )
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

  // user_roles と role の型を仮定（Database 型から取得するのが望ましい）
  type UserRoleWithRole = {
    role: {
      id: string;
      name: string;
    };
  };

  // レスポンスデータの整形 (getUsers と同じ構造にする)
  const users = data.map((profile) => ({
    // 取得したカラムのみを明示的に含める
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    created_at: profile.created_at,
    // last_sign_in_at など、他のプロパティは含めない
    roles: profile.user_roles.map((ur: UserRoleWithRole) => ur.role),
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
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('name');

  if (error) throw error;

  return data;
}
