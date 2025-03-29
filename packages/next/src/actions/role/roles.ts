'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { cache } from 'react';

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
 * 管理者権限を確認します
 * @returns {Promise<boolean>} 管理者権限を持っているかどうか
 */
export const isAdmin = cache(async (): Promise<boolean> => {
  try {
    const supabase = await getSupabaseServerClient();

    // 現在のセッション情報を取得
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting user:', userError);
      return false;
    }

    if (!user) {
      console.log('No user session found');
      return false;
    }

    // RPCの実行と結果のログ（最大3回リトライ）
    let retryCount = 0;
    const maxRetries = 3;
    let lastError = null;

    while (retryCount < maxRetries) {
      try {
        const { data, error } = await supabase.rpc('check_is_admin');

        if (error) {
          console.error(
            `Error checking admin status (attempt ${retryCount + 1}):`,
            {
              message: error.message,
              code: error.code,
              details: error.details,
              hint: error.hint,
            }
          );
          lastError = error;
          retryCount++;
          if (retryCount < maxRetries) {
            // 指数バックオフで待機
            await new Promise((resolve) =>
              setTimeout(resolve, 2 ** retryCount * 1000)
            );
            continue;
          }
        }

        return !!data;
      } catch (error) {
        console.error(
          `Unexpected error in isAdmin (attempt ${retryCount + 1}):`,
          error
        );
        lastError = error;
        retryCount++;
        if (retryCount < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, 2 ** retryCount * 1000)
          );
        }
      }
    }

    console.error('Failed to check admin status after all retries:', lastError);
    return false;
  } catch (error) {
    console.error('Critical error in isAdmin:', error);
    return false;
  }
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
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      console.log('Access denied: User is not an admin');
      throw new Error('管理者権限がありません');
    }
  } catch (error) {
    console.error('Error in requireAdmin:', error);
    throw new Error(
      '管理者権限の確認中にエラーが発生しました。しばらく待ってから再度お試しください。'
    );
  }
}
