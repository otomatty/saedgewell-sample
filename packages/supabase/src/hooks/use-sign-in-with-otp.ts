/**
 * use-sign-in-with-otp.ts
 *
 * このファイルはワンタイムパスワード（OTP）を使用したユーザー認証のための
 * カスタムフックを提供します。メールリンクやSMSによるパスワードレス認証に使用されます。
 *
 * 主な機能:
 * - メールまたは電話番号によるOTP認証処理
 * - React QueryのuseMutationを使用した状態管理
 * - 開発環境でのSMSプロバイダーエラーの特別処理
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. mutationFn内でclient.auth.signInWithOtp()を呼び出してOTP認証処理を実行
 * 3. エラーが発生した場合、特定のエラー（SMSプロバイダーが設定されていないエラーなど）は
 *    開発環境では無視し、それ以外のエラーは例外をスロー
 * 4. 成功した場合はレスポンスデータを返す
 *
 * 特記事項:
 * - 開発環境でのSMSプロバイダーエラーを特別に処理するためのヘルパー関数を含む
 * - shouldIgnoreError関数とisSmsProviderNotSetupError関数でエラーの種類を判断
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const signInWithOtpMutation = useSignInWithOtp();
 *
 * // メールリンクでの認証
 * const handleEmailSignIn = async (email) => {
 *   try {
 *     await signInWithOtpMutation.mutateAsync({
 *       email,
 *       options: {
 *         emailRedirectTo: `${window.location.origin}/auth/callback`
 *       }
 *     });
 *     // OTP送信成功時の処理
 *   } catch (error) {
 *     // エラー処理
 *   }
 * };
 *
 * // SMS認証
 * const handlePhoneSignIn = async (phone) => {
 *   try {
 *     await signInWithOtpMutation.mutateAsync({ phone });
 *     // OTP送信成功時の処理
 *   } catch (error) {
 *     // エラー処理
 *   }
 * };
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - SMS認証を使用する場合は、Supabaseでプロバイダーの設定が必要です
 * - 開発環境ではSMSプロバイダーが設定されていなくてもエラーが無視されますが、
 *   本番環境では適切に設定する必要があります
 */
import type { SignInWithPasswordlessCredentials } from '@supabase/supabase-js';

import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

/**
 * @name useSignInWithOtp
 * @description Use Supabase to sign in a user with an OTP in a React component
 */
export function useSignInWithOtp() {
  const client = useSupabase();
  const mutationKey = ['auth', 'sign-in-with-otp'];

  const mutationFn = async (credentials: SignInWithPasswordlessCredentials) => {
    const result = await client.auth.signInWithOtp(credentials);

    if (result.error) {
      if (shouldIgnoreError(result.error.message)) {
        console.warn(
          `Ignoring error during development: ${result.error.message}`
        );

        return {} as never;
      }

      throw result.error.message;
    }

    return result.data;
  };

  return useMutation({
    mutationFn,
    mutationKey,
  });
}

function shouldIgnoreError(error: string) {
  return isSmsProviderNotSetupError(error);
}

function isSmsProviderNotSetupError(error: string) {
  return error.includes('sms Provider could not be found');
}
