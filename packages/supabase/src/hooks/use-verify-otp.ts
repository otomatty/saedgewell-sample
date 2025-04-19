/**
 * use-verify-otp.ts
 *
 * このファイルはワンタイムパスワード（OTP）の検証を行うためのカスタムフックを提供します。
 *
 * 主な機能:
 * - OTPの検証処理
 * - React QueryのuseMutationを使用した状態管理
 * - エラーハンドリング
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. mutationFn内でclient.auth.verifyOtp()を呼び出してOTPを検証
 * 3. エラーが発生した場合は例外をスロー
 * 4. 成功した場合はレスポンスデータを返す
 *
 * 特記事項:
 * - @supabase/supabase-jsのVerifyOtpParams型を使用してパラメータの型を定義
 * - React QueryのuseMutationを使用することで、ローディング状態やエラー状態の管理が容易に
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const verifyOtpMutation = useVerifyOtp();
 *
 * // メールOTPの検証
 * const handleVerifyEmailOtp = async (email, token) => {
 *   try {
 *     await verifyOtpMutation.mutateAsync({
 *       email,
 *       token,
 *       type: 'email'
 *     });
 *     // 検証成功時の処理
 *     showSuccessMessage('メールアドレスが確認されました');
 *   } catch (error) {
 *     // エラー処理
 *     showErrorMessage('検証に失敗しました');
 *   }
 * };
 *
 * // 電話番号OTPの検証
 * const handleVerifyPhoneOtp = async (phone, token) => {
 *   try {
 *     await verifyOtpMutation.mutateAsync({
 *       phone,
 *       token,
 *       type: 'sms'
 *     });
 *     // 検証成功時の処理
 *     showSuccessMessage('電話番号が確認されました');
 *   } catch (error) {
 *     // エラー処理
 *     showErrorMessage('検証に失敗しました');
 *   }
 * };
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - OTPの検証には、送信されたトークンと、送信先のメールアドレスまたは電話番号が必要です
 * - typeパラメータには'email'、'sms'、'recovery'などの値を指定できます
 * - OTPの有効期限は通常短いため、ユーザーには速やかに入力するよう促す必要があります
 */
import type { VerifyOtpParams } from '@supabase/supabase-js';

import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

/**
 * @name useVerifyOtp
 * @description Use Supabase to verify an OTP in a React component
 */
export function useVerifyOtp() {
  const client = useSupabase();

  const mutationKey = ['verify-otp'];

  const mutationFn = async (params: VerifyOtpParams) => {
    const { data, error } = await client.auth.verifyOtp(params);

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
