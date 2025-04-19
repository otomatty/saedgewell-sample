/**
 * use-sign-up-with-email-password.ts
 *
 * このファイルはメールアドレスとパスワードを使用したユーザー登録のための
 * カスタムフックを提供します。
 *
 * 主な機能:
 * - メールアドレスとパスワードによるユーザー登録処理
 * - メール確認リダイレクトURLの設定
 * - CAPTCHA対応
 * - React QueryのuseMutationを使用した状態管理
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. mutationFn内でclient.auth.signUp()を呼び出してユーザー登録処理を実行
 * 3. emailRedirectToとcaptchaTokenをオプションとして渡す
 * 4. エラーが発生した場合は例外をスロー
 * 5. ユーザーのidentitiesが空の場合（メールアドレスが既に登録されている場合）は例外をスロー
 * 6. 成功した場合はレスポンスデータを返す
 *
 * 特記事項:
 * - Credentialsインターフェースで必要なパラメータを定義
 * - ユーザーのidentitiesが空の場合、そのメールアドレスは既に登録されていると判断
 * - React QueryのuseMutationを使用することで、ローディング状態やエラー状態の管理が容易に
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const signUpMutation = useSignUpWithEmailAndPassword();
 *
 * const handleSubmit = async (formData) => {
 *   try {
 *     await signUpMutation.mutateAsync({
 *       email: formData.email,
 *       password: formData.password,
 *       emailRedirectTo: `${window.location.origin}/auth/callback`,
 *       captchaToken: captchaToken // オプション
 *     });
 *     // 登録成功時の処理
 *   } catch (error) {
 *     // エラー処理
 *   }
 * };
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - emailRedirectToパラメータは必須で、認証メールのリダイレクト先を指定します
 * - captchaTokenはオプションですが、スパム防止のために使用することを推奨します
 */
import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

interface Credentials {
  email: string;
  password: string;
  emailRedirectTo: string;
  captchaToken?: string;
}

/**
 * @name useSignUpWithEmailAndPassword
 * @description Use Supabase to sign up a user with email and password in a React component
 */
export function useSignUpWithEmailAndPassword() {
  const client = useSupabase();
  const mutationKey = ['auth', 'sign-up-with-email-password'];

  const mutationFn = async (params: Credentials) => {
    const { emailRedirectTo, captchaToken, ...credentials } = params;

    const response = await client.auth.signUp({
      ...credentials,
      options: {
        emailRedirectTo,
        captchaToken,
      },
    });

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

  return useMutation({
    mutationKey,
    mutationFn,
  });
}
