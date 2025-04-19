'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { cache } from 'react';
import { headers } from 'next/headers';

/**
 * ユーザーのロールを取得します
 */
export const getUserRoles = cache(async (userId: string): Promise<string[]> => {
  const supabase = getSupabaseServerClient();

  const { data: roles } = await supabase
    .from('roles')
    .select(`
      name,
      user_roles!inner(
        user_id
      )
    `)
    .eq('user_roles.user_id', userId);

  return roles?.map((r) => r.name) ?? [];
});

/**
 * 管理者権限を確認します (ミドルウェアで設定されたヘッダーを利用)
 * @returns {Promise<boolean>} 管理者権限を持っているかどうか
 */
export const isAdmin = cache(async (): Promise<boolean> => {
  // ヘッダーから管理者ステータスを取得
  const headerList = await headers();
  const isAdminHeader = headerList.get('x-is-admin');

  // ヘッダーが存在し、その値が 'true' であれば管理者と判断
  return isAdminHeader === 'true';
});

/**
 * 管理者一覧を取得します
 */
export async function getAdminUsers() {
  try {
    const supabase = await getSupabaseServerClient();

    // セッション情報のログ
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase.rpc('get_admin_users');

    if (error) {
      console.error('Error in getAdminUsers:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(`管理者一覧の取得に失敗しました: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in getAdminUsers:', error);
    throw error;
  }
}

/**
 * 管理者を追加します
 * @param userId 追加する管理者のユーザーID
 */
export async function addAdmin(userId: string) {
  try {
    const supabase = await getSupabaseServerClient();

    // セッション情報のログ
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.rpc('add_admin_user', {
      target_user_id: userId,
    });

    if (error) {
      console.error('Error in addAdmin:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(`管理者の追加に失敗しました: ${error.message}`);
    }
  } catch (error) {
    console.error('Unexpected error in addAdmin:', error);
    throw error;
  }
}

/**
 * 管理者を削除します
 * @param userId 削除する管理者のユーザーID
 */
export async function removeAdmin(userId: string) {
  try {
    const supabase = await getSupabaseServerClient();

    // セッション情報のログ
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.rpc('remove_admin_user', {
      target_user_id: userId,
    });

    if (error) {
      console.error('Error in removeAdmin:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(`管理者の削除に失敗しました: ${error.message}`);
    }

    console.log('Successfully removed admin:', { targetUserId: userId });
  } catch (error) {
    console.error('Unexpected error in removeAdmin:', error);
    throw error;
  }
}

/**
 * 管理者ページへのアクセスを制御します
 * @throws {Error} 管理者権限がない場合
 */
export async function requireAdmin() {
  // 修正された isAdmin 関数を呼び出す
  const isUserAdmin = await isAdmin();

  if (!isUserAdmin) {
    console.log('Access denied: User is not an admin (checked via header)');
    throw new Error('管理者権限がありません');
  }
}

/**
 * 管理者権限チェックをデバッグするための関数
 * この関数を使用して管理者権限の詳細な情報を取得できます
 */
export async function debugAdminPermissions() {
  try {
    const supabase = await getSupabaseServerClient();

    // 現在のセッション情報を取得
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        isAuthenticated: false,
        user: null,
        roles: [],
        adminRpcResult: null,
        error: userError ? userError.message : 'No user found',
      };
    }

    // ユーザーのロールを取得
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*, roles(name)')
      .eq('user_id', user.id);

    // admin RPCの実行
    const { data: isAdmin, error: adminError } =
      await supabase.rpc('check_is_admin');

    // データベースから直接admin_usersテーブルをチェック
    const { data: adminCheck, error: adminCheckError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id);

    // ユーザーメタデータからロール情報を取得
    const userMetadataRole = user.user_metadata?.role;

    return {
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email,
        userMetadata: user.user_metadata,
        appMetadata: user.app_metadata,
      },
      roles: userRoles || [],
      adminRpcResult: isAdmin,
      adminRpcError: adminError ? adminError.message : null,
      adminTableCheck: adminCheck || [],
      adminTableError: adminCheckError ? adminCheckError.message : null,
      userMetadataRole,
      errors: {
        roles: rolesError ? rolesError.message : null,
        admin: adminError ? adminError.message : null,
        adminCheck: adminCheckError ? adminCheckError.message : null,
      },
    };
  } catch (error) {
    console.error('Error in debugAdminPermissions:', error);
    return {
      isAuthenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorObject: error,
    };
  }
}
