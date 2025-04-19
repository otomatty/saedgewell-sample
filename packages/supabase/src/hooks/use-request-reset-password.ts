/**
 * use-request-reset-password.ts
 *
 * このファイルはパスワードリセットのリクエストを行うためのカスタムフックを提供します。
 *
 * 主な機能:
 * - パスワードリセットメールの送信リクエスト
 * - リダイレクトURLの指定
 * - CAPTCHA対応
 * - React QueryのuseMutationを使用した状態管理
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. mutationFn内でclient.auth.resetPasswordForEmail()を呼び出してパスワードリセットを要求
 * 3. リダイレクトURLとオプションのCAPTCHAトークンをオプションとして渡す
 * 4. エラーが発生した場合は例外をスロー
 * 5. 成功した場合はレスポンスデータを返す
 *
 * 特記事項:
 * - RequestPasswordResetMutationParamsインターフェースで必要なパラメータを定義
 * - React QueryのuseMutationを使用することで、ローディング状態やエラー状態の管理が容易に
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const resetPasswordMutation = useRequestResetPassword();
 *
 * const handleResetPassword = async (email) => {
 *   try {
 *     await resetPasswordMutation.mutateAsync({
 *       email,
 *       redirectTo: `${window.location.origin}/auth/password-reset`,
 *       captchaToken // オプション
 *     });
 *     // リセットメール送信成功時の処理
 *     showSuccessMessage('パスワードリセットのメールを送信しました');
 *   } catch (error) {
 *     // エラー処理
 *     showErrorMessage('パスワードリセットメールの送信に失敗しました');
 *   }
 * };
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - redirectToパラメータは必須で、パスワードリセットページのURLを指定します
 * - captchaTokenはオプションですが、スパム防止のために使用することを推奨します
 * - パスワードリセットメールが送信されても、ユーザーがそのメールアドレスを持っているかどうかは
 *   セキュリティ上の理由から確認できません（存在しないメールアドレスでもエラーにはなりません）
 */
import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

interface RequestPasswordResetMutationParams {
  email: string;
  redirectTo: string;
  captchaToken?: string;
}

/**
 * @name useRequestResetPassword
 * @description Requests a password reset for a user. This function will
 * trigger a password reset email to be sent to the user's email address.
 * After the user clicks the link in the email, they will be redirected to
 * /password-reset where their password can be updated.
 */
export function useRequestResetPassword() {
  const client = useSupabase();
  const mutationKey = ['auth', 'reset-password'];

  const mutationFn = async (params: RequestPasswordResetMutationParams) => {
    const { error, data } = await client.auth.resetPasswordForEmail(
      params.email,
      {
        redirectTo: params.redirectTo,
        captchaToken: params.captchaToken,
      }
    );

    if (error) {
      throw error;
    }

    return data;
  };

  return useMutation({
    mutationFn,
    mutationKey,
  });
}
