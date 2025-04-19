'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Profile, ProfileWithRole } from '@kit/types/profile';
import type { UserRole } from '@kit/types/auth';
import { headers } from 'next/headers';
/**
 * トップページで使用するプロファイルを取得します
 * (プロファイルが存在しない場合は作成する処理付き)
 * @returns プロファイル情報
 */
export async function getProfileOnTop(): Promise<ProfileWithRole | null> {
  try {
    const supabase = await getSupabaseServerClient();

    // ユーザー情報の取得
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // 未ログイン状態の場合は静かにnullを返す
    if (userError?.message === 'Auth session missing!') {
      return null;
    }

    // その他のエラーの場合はログを出力
    if (userError || !user) {
      console.error('[getCurrentUserProfile] User Error:', userError);
      return null;
    }

    // プロファイル情報の取得
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select()
      .eq('id', user.id)
      .single();

    // プロファイルが存在しない場合は作成
    if (profileError?.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email ?? '',
          full_name: user.user_metadata?.full_name ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error(
          '[getCurrentUserProfile] Create Profile Error:',
          createError
        );
        return null;
      }

      profile = newProfile;

      // デフォルトのユーザーロールを作成
      const { data: defaultRole } = await supabase
        .from('roles')
        .select()
        .eq('name', 'user')
        .single();

      if (defaultRole) {
        await supabase.from('user_roles').insert({
          user_id: user.id,
          role_id: defaultRole.id,
        });
      }
    } else if (profileError) {
      console.error('[getCurrentUserProfile] Profile Error:', profileError);
      return null;
    }

    // ロール情報の取得
    const { data: roleData } = await supabase
      .from('user_roles')
      .select(`
				roles (
					name
				)
			`)
      .eq('user_id', user.id);

    const roles = roleData?.map((r) => r.roles.name as UserRole) ?? [];
    const isAdmin = roles.includes('admin' as UserRole);

    return {
      id: profile?.id ?? '',
      email: profile?.email ?? '',
      fullName: profile?.full_name ?? '',
      avatarUrl: profile?.avatar_url ?? '',
      createdAt: profile?.created_at ?? '',
      updatedAt: profile?.updated_at ?? '',
      roles,
      role: isAdmin ? ('admin' as UserRole) : (roles[0] ?? 'user'),
      isAdmin,
    };
  } catch (error) {
    console.error('[getCurrentUserProfile] Unexpected Error:', error);
    return null;
  }
}

/**
 * プロファイル情報を取得します
 * @returns プロファイル情報
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('[getProfile] Profile Error:', profileError);
    return null;
  }

  // ロール情報の取得
  const { data: roleData } = await supabase
    .from('user_roles')
    .select(`
			roles (
				name
			)
		`)
    .eq('user_id', user.id)
    .single();

  return {
    id: profile?.id ?? '',
    email: profile?.email ?? '',
    fullName: profile?.full_name ?? '',
    avatarUrl: profile?.avatar_url ?? '',
    createdAt: profile?.created_at ?? '',
    updatedAt: profile?.updated_at ?? '',
    role: roleData?.roles?.name as UserRole,
    isAdmin: roleData?.roles?.name === 'admin',
  };
}

/**
 * レイアウト表示用に最適化されたプロファイル情報を取得します
 * (この関数は管理者権限が確認された後に呼び出される想定)
 * @returns レイアウトに必要なプロファイル情報
 */
export async function getProfileForLayout(): Promise<Pick<
  Profile,
  'id' | 'email' | 'fullName' | 'avatarUrl' | 'role' | 'isAdmin'
> | null> {
  const supabase = await getSupabaseServerClient();
  const headerList = await headers();

  // ヘッダーからユーザー情報を取得
  const userId = headerList.get('x-user-id');
  const userEmail = headerList.get('x-user-email');
  // isAdmin は文字列で格納されているので boolean に変換
  const isAdmin = headerList.get('x-is-admin') === 'true';

  // ヘッダーに必要な情報がない場合はエラー（通常はミドルウェアで弾かれるはず）
  if (!userId || !userEmail) {
    console.error('[getProfileForLayout] Missing user info in headers.');
    return null;
  }

  // プロファイル情報取得 (full_name, avatar_url のみ)
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('[getProfileForLayout] Profile fetch error:', profileError);
    // プロファイル情報がなくても最低限の情報を返すことも検討できる
    // return null;
  }

  // isAdmin はヘッダーから取得した値を使用
  // role も isAdmin に基づいて決定

  return {
    id: userId,
    email: userEmail,
    fullName: profileData?.full_name ?? null,
    avatarUrl: profileData?.avatar_url ?? null,
    role: isAdmin ? 'admin' : 'user', // isAdmin が true なら 'admin', そうでなければ 'user' (または他のデフォルト)
    isAdmin,
  };
}
