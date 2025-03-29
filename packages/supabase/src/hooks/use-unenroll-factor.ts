/**
 * use-unenroll-factor.ts
 *
 * このファイルは多要素認証（MFA）ファクターの登録解除を行うためのカスタムフックを提供します。
 *
 * 主な機能:
 * - MFAファクター（TOTP認証器など）の登録解除処理
 * - ファクターIDによる特定のファクターの削除
 * - React QueryのuseMutationを使用した状態管理
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. useFactorsMutationKeyフックを使用してユーザーIDに基づくミューテーションキーを生成
 * 3. mutationFn内でclient.auth.mfa.unenroll()を呼び出してファクターの登録解除を実行
 * 4. エラーが発生した場合は例外をスロー
 * 5. 成功した場合はレスポンスデータを返す
 *
 * 特記事項:
 * - useFactorsMutationKeyフックを使用して、クエリキーとミューテーションキーの一貫性を確保
 * - onSuccessコールバックでuseFetchAuthFactorsのクエリを無効化し、最新のMFAファクター情報を取得
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const { data: user } = useUser();
 * const { data: factors } = useFetchAuthFactors(user?.id);
 * const unenrollFactorMutation = useUnenrollFactor(user?.id);
 *
 * const handleUnenroll = async (factorId) => {
 *   try {
 *     await unenrollFactorMutation.mutateAsync(factorId);
 *     // 登録解除成功時の処理
 *     showSuccessMessage('多要素認証が正常に解除されました');
 *   } catch (error) {
 *     // エラー処理
 *     showErrorMessage('登録解除に失敗しました');
 *   }
 * };
 *
 * return (
 *   <div>
 *     <h2>登録済みMFAファクター</h2>
 *     <ul>
 *       {factors?.totp.map(factor => (
 *         <li key={factor.id}>
 *           {factor.friendly_name}
 *           <button
 *             onClick={() => handleUnenroll(factor.id)}
 *             disabled={unenrollFactorMutation.isPending}
 *           >
 *             解除
 *           </button>
 *         </li>
 *       ))}
 *     </ul>
 *   </div>
 * );
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - ユーザーIDが必要なため、認証済みユーザーのコンテキストでのみ使用できます
 * - すべてのMFAファクターを解除すると、アカウントは標準的な認証方法のみに戻ります
 * - 最後のMFAファクターを解除する前に、ユーザーに確認を求めることを検討してください
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';
import { useFactorsMutationKey } from './use-user-factors-mutation-key';

// ... existing code ...
