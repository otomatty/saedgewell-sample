'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { revalidatePath } from 'next/cache';
import type { UserRole } from '@kit/types/auth';
import type { ProfileWithRole } from '@kit/types/profile';

/**
 * 現在のユーザーのロールを取得します
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('roles (name)')
    .eq('id', user.id)
    .single();

  return (profile?.roles?.[0]?.name as UserRole) ?? 'user';
}

/**
 * ユーザープロフィールを作成または更新します
 */
export async function upsertProfile(userId: string, email: string) {
  const supabase = await getSupabaseServerClient();

  // トランザクションを開始
  const { error: transactionError } = await supabase.rpc('handle_new_user', {
    p_user_id: userId,
    p_email: email,
  });

  if (transactionError) {
    throw transactionError;
  }

  revalidatePath('/', 'layout');
}

/**
 * 現在のユーザーが管理者かどうかを確認します
 */
export async function checkIsAdmin(): Promise<boolean> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.rpc('check_is_admin');

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Unexpected error in checkIsAdmin:', error);
    return false;
  }
}

/**
 * 認証状態とプロフィール情報を取得します
 * @returns {Promise<{ isAuthenticated: boolean; profile: ProfileWithRole | null }>}
 */
export async function getAuthState() {
  try {
    const supabase = await getSupabaseServerClient();

    // レスポンスのキャッシュを無効化
    const response = new Response();
    response.headers.set('Cache-Control', 'no-store');

    // ユーザー情報を取得
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        isAuthenticated: false,
        profile: null,
      };
    }

    // プロフィール情報のみを取得
    const { data: profileOnly, error: profileOnlyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileOnlyError || !profileOnly) {
      return {
        isAuthenticated: true,
        profile: null,
      };
    }

    // ユーザーロールの存在確認
    const { data: userRolesData } = await supabase
      .from('user_roles')
      .select('*, roles(name)')
      .eq('user_id', user.id);

    const hasUserRoles = userRolesData && userRolesData.length > 0;

    // 管理者権限を確認
    const { data: isAdmin } = await supabase.rpc('check_is_admin');

    // ロール情報を処理
    const userRoles: UserRole[] = ['user'];

    // ユーザーロールがある場合は取得する
    if (hasUserRoles) {
      try {
        userRolesData.forEach((ur, index) => {
          if (ur?.roles?.name) {
            const roleName = ur.roles.name;
            if (roleName === 'user' || roleName === 'client') {
              userRoles[index] = roleName as UserRole;
            }
          }
        });
      } catch (e) {
        console.error('ロール変換エラー:', e);
      }
    }

    // デフォルトロールを設定（最初のロールをメインロールとして使用）
    const defaultRole = userRoles[0] ?? 'user';

    // ProfileWithRole型に変換
    const profileWithRole: ProfileWithRole = {
      id: profileOnly.id,
      email: profileOnly.email,
      fullName: profileOnly.full_name ?? null,
      avatarUrl: profileOnly.avatar_url ?? null,
      createdAt: profileOnly.created_at,
      updatedAt: profileOnly.updated_at,
      role: defaultRole,
      isAdmin: !!isAdmin,
      roles: userRoles,
    };

    return {
      isAuthenticated: true,
      profile: profileWithRole,
    };
  } catch (error) {
    console.error('認証状態の取得に失敗しました:', error);
    return {
      isAuthenticated: false,
      profile: null,
    };
  }
}
