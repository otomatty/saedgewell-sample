/**
 * use-user.ts
 *
 * このファイルは現在のユーザー情報を取得するためのカスタムフックを提供します。
 *
 * 主な機能:
 * - 現在のユーザー情報の取得
 * - React QueryのuseQueryを使用したキャッシュと状態管理
 * - 初期データのサポート
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. queryFn内でclient.auth.getUser()を呼び出してユーザー情報を取得
 * 3. エラーが発生した場合はundefinedを返す（ユーザーが未ログインの場合など）
 * 4. ユーザー情報が存在する場合はそれを返す
 * 5. 予期しない形式の場合はエラーをスロー
 *
 * 特記事項:
 * - React QueryのuseQueryを使用することで、ユーザー情報のキャッシュと再取得の制御が容易に
 * - refetchInterval, refetchOnMount, refetchOnWindowFocusをfalseに設定し、
 *   不要な再取得を防止
 * - 初期データをオプションで受け取ることができ、SSRなどで事前に取得したデータを渡せる
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const { data: user, isLoading, error } = useUser();
 *
 * if (isLoading) {
 *   return <div>ローディング中...</div>;
 * }
 *
 * if (error) {
 *   return <div>エラーが発生しました</div>;
 * }
 *
 * if (!user) {
 *   return <div>ログインしていません</div>;
 * }
 *
 * return <div>こんにちは、{user.email}さん</div>;
 * ```
 *
 * // 初期データを使用する場合
 * ```
 * // サーバーサイドで事前に取得したユーザー情報を渡す
 * const { data: user } = useUser(initialUser);
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - ユーザーが未ログインの場合はundefinedが返されます
 * - useAuthChangeListenerフックと併用することで、認証状態の変更を検知できます
 */
import type { User } from '@supabase/supabase-js';

import { useQuery } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

const queryKey = ['supabase:user'];

/**
 * @name useUser
 * @description Use Supabase to get the current user in a React component
 * @param initialData
 */
export function useUser(initialData?: User | null) {
  const client = useSupabase();

  const queryFn = async () => {
    const response = await client.auth.getUser();

    // this is most likely a session error or the user is not logged in
    if (response.error) {
      return undefined;
    }

    if (response.data?.user) {
      return response.data.user;
    }

    return Promise.reject(new Error('Unexpected result format'));
  };

  return useQuery({
    queryFn,
    queryKey,
    initialData,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
