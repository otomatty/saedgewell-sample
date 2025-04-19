/**
 * use-fetch-mfa-factors.ts
 *
 * このファイルはユーザーの多要素認証（MFA）ファクターを取得するためのカスタムフックを提供します。
 *
 * 主な機能:
 * - ユーザーのMFAファクター（認証器、リカバリーコードなど）の取得
 * - React QueryのuseQueryを使用したキャッシュと状態管理
 * - ユーザーIDに基づくクエリキーの生成
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. useFactorsMutationKeyフックを使用してユーザーIDに基づくクエリキーを生成
 * 3. queryFn内でclient.auth.mfa.listFactors()を呼び出してMFAファクターを取得
 * 4. エラーが発生した場合は例外をスロー
 * 5. 成功した場合はレスポンスデータを返す
 *
 * 特記事項:
 * - useFactorsMutationKeyフックを使用して、クエリキーとミューテーションキーの一貫性を確保
 * - staleTimeを0に設定し、常に最新のデータを取得するようにしています
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const { data: user } = useUser();
 * const { data: factors, isLoading, error } = useFetchAuthFactors(user?.id);
 *
 * if (isLoading) {
 *   return <div>ローディング中...</div>;
 * }
 *
 * if (error) {
 *   return <div>エラーが発生しました</div>;
 * }
 *
 * return (
 *   <div>
 *     <h2>MFAファクター</h2>
 *     {factors.totp.length > 0 ? (
 *       <ul>
 *         {factors.totp.map(factor => (
 *           <li key={factor.id}>{factor.friendly_name}</li>
 *         ))}
 *       </ul>
 *     ) : (
 *       <p>MFAファクターが設定されていません</p>
 *     )}
 *   </div>
 * );
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - ユーザーIDが必要なため、認証済みユーザーのコンテキストでのみ使用できます
 * - MFAが有効になっていない場合、空のリストが返されます
 */
import { useQuery } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';
import { useFactorsMutationKey } from './use-user-factors-mutation-key';

/**
 * @name useFetchAuthFactors
 * @description Use Supabase to fetch the MFA factors for a user in a React component
 * @param userId
 */
export function useFetchAuthFactors(userId: string) {
  const client = useSupabase();
  const queryKey = useFactorsMutationKey(userId);

  const queryFn = async () => {
    const { data, error } = await client.auth.mfa.listFactors();

    if (error) {
      throw error;
    }

    return data;
  };

  return useQuery({
    queryKey,
    queryFn,
    staleTime: 0,
  });
}
