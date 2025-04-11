/**
 * use-update-user-mutation.ts
 *
 * このファイルはユーザー情報の更新を行うためのカスタムフックを提供します。
 *
 * 主な機能:
 * - ユーザープロファイルの更新（メールアドレス、パスワード、メタデータなど）
 * - メール確認のためのリダイレクトURL設定
 * - React QueryのuseMutationを使用した状態管理
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. mutationFn内でclient.auth.updateUser()を呼び出してユーザー情報を更新
 * 3. redirectToパラメータをemailRedirectToオプションとして渡す
 * 4. エラーが発生した場合は例外をスロー
 * 5. 成功した場合はレスポンスデータを返す
 *
 * 特記事項:
 * - Paramsタイプは@supabase/supabase-jsのUserAttributes型を拡張し、redirectToプロパティを追加
 * - React QueryのuseMutationを使用することで、ローディング状態やエラー状態の管理が容易に
 * - mutationKeyは['supabase:user']で、useUserフックと同じキーを使用しているため、
 *   ユーザー情報の更新後に自動的にuseUserのキャッシュが無効化される
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const updateUserMutation = useUpdateUser();
 *
 * // メールアドレスの更新
 * const handleUpdateEmail = async (newEmail) => {
 *   try {
 *     await updateUserMutation.mutateAsync({
 *       email: newEmail,
 *       redirectTo: `${window.location.origin}/auth/callback`
 *     });
 *     // 更新成功時の処理
 *     showSuccessMessage('確認メールを送信しました');
 *   } catch (error) {
 *     // エラー処理
 *     showErrorMessage('メールアドレスの更新に失敗しました');
 *   }
 * };
 *
 * // パスワードの更新
 * const handleUpdatePassword = async (newPassword) => {
 *   try {
 *     await updateUserMutation.mutateAsync({
 *       password: newPassword,
 *       redirectTo: `${window.location.origin}/auth/callback`
 *     });
 *     // 更新成功時の処理
 *     showSuccessMessage('パスワードを更新しました');
 *   } catch (error) {
 *     // エラー処理
 *     showErrorMessage('パスワードの更新に失敗しました');
 *   }
 * };
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - メールアドレスを更新する場合、新しいメールアドレスの確認が必要です
 * - redirectToパラメータは必須で、メール確認後のリダイレクト先を指定します
 * - メタデータの更新など、一部の更新はリダイレクトが不要ですが、インターフェースの一貫性のために
 *   redirectToパラメータは常に必要です
 */
import type { UserAttributes } from '@supabase/supabase-js';

import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

type Params = UserAttributes & { redirectTo: string };

/**
 * @name useUpdateUser
 * @description Use Supabase to update the current user in a React component
 */
export function useUpdateUser() {
  const client = useSupabase();
  const mutationKey = ['supabase:user'];

  const mutationFn = async (attributes: Params) => {
    const { redirectTo, ...params } = attributes;

    const response = await client.auth.updateUser(params, {
      emailRedirectTo: redirectTo,
    });

    if (response.error) {
      throw response.error;
    }

    return response.data;
  };

  return useMutation({
    mutationKey,
    mutationFn,
  });
}
