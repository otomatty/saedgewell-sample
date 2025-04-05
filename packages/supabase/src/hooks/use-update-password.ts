/**
 * use-update-password.ts
 *
 * このファイルはユーザーのパスワード更新を行うためのカスタムフックを提供します。
 * パスワードリセットフローの最終ステップで使用されます。
 *
 * 主な機能:
 * - パスワードの更新処理
 * - React QueryのuseMutationを使用した状態管理
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. mutationFn内でclient.auth.updateUser()を呼び出してパスワードを更新
 * 3. エラーが発生した場合は例外をスロー
 * 4. 成功した場合はレスポンスデータを返す
 *
 * 特記事項:
 * - React QueryのuseMutationを使用することで、ローディング状態やエラー状態の管理が容易に
 * - mutationKeyは['supabase:user']で、useUserフックと同じキーを使用しているため、
 *   パスワード更新後に自動的にuseUserのキャッシュが無効化される
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const updatePasswordMutation = useUpdatePassword();
 *
 * const handleUpdatePassword = async (newPassword) => {
 *   try {
 *     await updatePasswordMutation.mutateAsync(newPassword);
 *     // パスワード更新成功時の処理
 *     showSuccessMessage('パスワードが正常に更新されました');
 *     // ログインページなどにリダイレクト
 *     router.push('/auth/signin');
 *   } catch (error) {
 *     // エラー処理
 *     showErrorMessage('パスワードの更新に失敗しました');
 *   }
 * };
 *
 * return (
 *   <form onSubmit={(e) => {
 *     e.preventDefault();
 *     handleUpdatePassword(newPassword);
 *   }}>
 *     <input
 *       type="password"
 *       value={newPassword}
 *       onChange={(e) => setNewPassword(e.target.value)}
 *       placeholder="新しいパスワード"
 *     />
 *     <button
 *       type="submit"
 *       disabled={updatePasswordMutation.isPending}
 *     >
 *       {updatePasswordMutation.isPending ? '更新中...' : 'パスワードを更新'}
 *     </button>
 *   </form>
 * );
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - パスワードリセットフローの一部として使用する場合、通常はリセットリンクからのリダイレクト後に
 *   使用されます
 * - パスワードの強度要件を満たしていない場合、Supabaseはエラーを返します
 * - パスワード更新後、ユーザーは新しいパスワードでログインする必要があります
 */
import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';

// ... existing code ...
