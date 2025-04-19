/**
 * use-sign-in-with-email-password.ts
 *
 * このファイルはメールアドレスとパスワードを使用したユーザー認証のための
 * カスタムフックを提供します。
 *
 * 主な機能:
 * - メールアドレスとパスワードによるサインイン処理
 * - React QueryのuseMutationを使用した状態管理
 * - エラーハンドリングとユーザー検証
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. mutationFn内でclient.auth.signInWithPassword()を呼び出してサインイン処理を実行
 * 3. エラーが発生した場合は例外をスロー
 * 4. ユーザーのidentitiesが空の場合（メールアドレスが既に登録されている場合）は例外をスロー
 * 5. 成功した場合はレスポンスデータを返す
 *
 * 特記事項:
 * - ユーザーのidentitiesが空の場合、そのメールアドレスは既に登録されていると判断
 * - React QueryのuseMutationを使用することで、ローディング状態やエラー状態の管理が容易に
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const signInMutation = useSignInWithEmailPassword();
 *
 * const handleSubmit = async (credentials) => {
 *   try {
 *     const data = await signInMutation.mutateAsync({
 *       email: credentials.email,
 *       password: credentials.password
 *     });
 *     // サインイン成功時の処理
 *   } catch (error) {
 *     // エラー処理
 *   }
 * };
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - サインイン処理は非同期で行われるため、適切なエラーハンドリングが必要です
 */
import type { SignInWithPasswordCredentials } from '@supabase/supabase-js';

import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

/**
 * @name useSignInWithEmailPassword
 * @description Use Supabase to sign in a user with email and password in a React component
 */
export function useSignInWithEmailPassword() {
  const client = useSupabase();
  const mutationKey = ['auth', 'sign-in-with-email-password'];

  const mutationFn = async (credentials: SignInWithPasswordCredentials) => {
    const response = await client.auth.signInWithPassword(credentials);

    if (response.error) {
      throw response.error.message;
    }

    const user = response.data?.user;
    const identities = user?.identities ?? [];

    // if the user has no identities, it means that the email is taken
    if (identities.length === 0) {
      throw new Error('User already registered');
    }

    return response.data;
  };

  return useMutation({ mutationKey, mutationFn });
}
