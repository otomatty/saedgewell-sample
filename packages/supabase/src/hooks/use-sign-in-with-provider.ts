/**
 * use-sign-in-with-provider.ts
 *
 * このファイルはOAuthプロバイダー（Google、GitHub、Facebookなど）を使用した
 * ユーザー認証のためのカスタムフックを提供します。
 *
 * 主な機能:
 * - 外部OAuthプロバイダーによるサインイン処理
 * - React QueryのuseMutationを使用した状態管理
 * - エラーハンドリング
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. mutationFn内でclient.auth.signInWithOAuth()を呼び出してOAuth認証処理を実行
 * 3. エラーが発生した場合は例外をスロー
 * 4. 成功した場合はレスポンスデータを返す
 *
 * 特記事項:
 * - このフックは外部プロバイダーへのリダイレクトを開始するだけで、認証完了後の
 *   コールバック処理は別途必要です
 * - React QueryのuseMutationを使用することで、ローディング状態やエラー状態の管理が容易に
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const signInWithProviderMutation = useSignInWithProvider();
 *
 * const handleGoogleSignIn = async () => {
 *   try {
 *     await signInWithProviderMutation.mutateAsync({
 *       provider: 'google',
 *       options: {
 *         redirectTo: `${window.location.origin}/auth/callback`,
 *         scopes: 'email profile'
 *       }
 *     });
 *     // リダイレクトが開始されるため、通常ここには到達しません
 *   } catch (error) {
 *     // リダイレクト開始前のエラー処理
 *   }
 * };
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - 使用するOAuthプロバイダーはSupabaseダッシュボードで事前に設定する必要があります
 * - リダイレクト後のコールバック処理は、auth-callback.service.tsなどで別途処理する必要があります
 */
import type { SignInWithOAuthCredentials } from '@supabase/supabase-js';

import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

/**
 * @name useSignInWithProvider
 * @description Use Supabase to sign in a user with a provider in a React component
 */
export function useSignInWithProvider() {
  const client = useSupabase();
  const mutationKey = ['auth', 'sign-in-with-provider'];

  const mutationFn = async (credentials: SignInWithOAuthCredentials) => {
    const response = await client.auth.signInWithOAuth(credentials);

    if (response.error) {
      throw response.error.message;
    }

    return response.data;
  };

  return useMutation({
    mutationFn,
    mutationKey,
  });
}
