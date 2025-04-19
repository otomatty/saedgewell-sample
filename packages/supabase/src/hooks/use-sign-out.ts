/**
 * use-sign-out.ts
 *
 * このファイルはユーザーのサインアウト処理のためのカスタムフックを提供します。
 *
 * 主な機能:
 * - ユーザーのサインアウト処理
 * - React QueryのuseMutationを使用した状態管理
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. mutationFn内でclient.auth.signOut()を呼び出してサインアウト処理を実行
 * 3. 処理結果を返す
 *
 * 特記事項:
 * - シンプルな実装ながら、React QueryのuseMutationを使用することで、
 *   ローディング状態やエラー状態の管理が容易に
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const signOutMutation = useSignOut();
 *
 * const handleSignOut = async () => {
 *   try {
 *     await signOutMutation.mutateAsync();
 *     // サインアウト成功時の処理（例：ログインページへのリダイレクト）
 *   } catch (error) {
 *     // エラー処理
 *   }
 * };
 *
 * return (
 *   <button
 *     onClick={handleSignOut}
 *     disabled={signOutMutation.isPending}
 *   >
 *     {signOutMutation.isPending ? 'サインアウト中...' : 'サインアウト'}
 *   </button>
 * );
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - サインアウト後は通常、ユーザーをログインページなどにリダイレクトする処理が必要です
 * - useAuthChangeListenerフックと併用することで、サインアウト後の状態変更を検知できます
 */
import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

/**
 * @name useSignOut
 * @description Use Supabase to sign out a user in a React component
 */
export function useSignOut() {
  const client = useSupabase();

  return useMutation({
    mutationFn: () => {
      return client.auth.signOut();
    },
  });
}
