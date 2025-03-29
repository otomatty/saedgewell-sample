/**
 * use-user-factors-mutation-key.ts
 *
 * このファイルはユーザーの多要素認証（MFA）ファクターに関連するReact Queryの
 * キャッシュキーを生成するためのユーティリティフックを提供します。
 *
 * 主な機能:
 * - ユーザーIDに基づくMFAファクター用のクエリ/ミューテーションキーの生成
 *
 * 処理の流れ:
 * 1. ユーザーIDを引数として受け取る
 * 2. ['mfa-factors', userId]形式のキーを返す
 *
 * 特記事項:
 * - このフックは、MFAファクターに関連する複数のクエリとミューテーションで
 *   一貫したキャッシュキーを使用するために設計されています
 * - useFetchAuthFactorsフックなどで使用され、キャッシュの一貫性を確保します
 *
 * 使用例:
 * ```
 * // クエリフック内で
 * const queryKey = useFactorsMutationKey(userId);
 * return useQuery({ queryKey, queryFn });
 *
 * // ミューテーションフック内で
 * const mutationKey = useFactorsMutationKey(userId);
 * return useMutation({ mutationKey, mutationFn });
 * ```
 *
 * 注意点:
 * - このフックは単純なユーティリティ関数ですが、MFAファクターに関連する
 *   キャッシュの一貫性を確保するために重要です
 * - React Queryのキャッシュ無効化やリフェッチを適切に行うために、
 *   関連するすべてのフックで同じキー生成ロジックを使用することが重要です
 */

/**
 * @name useFactorsMutationKey
 * @description This hook returns the mutation key for the useUserFactorsMutation hook
 * Useful to reuse in both query and mutation hooks
 * @param userId
 */
export function useFactorsMutationKey(userId: string) {
  return ['mfa-factors', userId];
}
