/**
 * use-verify-totp-challenge.ts
 *
 * このファイルはTOTP（Time-based One-Time Password）チャレンジの検証を行うための
 * カスタムフックを提供します。多要素認証（MFA）のログインフローの完了に使用されます。
 *
 * 主な機能:
 * - TOTPチャレンジの検証処理
 * - チャレンジIDとTOTPコードによる検証
 * - React QueryのuseMutationを使用した状態管理
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. useFactorsMutationKeyフックを使用してユーザーIDに基づくミューテーションキーを生成
 * 3. mutationFn内でclient.auth.mfa.verify()を呼び出してTOTPチャレンジを検証
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
 * const verifyTotpChallengeMutation = useVerifyTotpChallenge(user?.id);
 *
 * const handleVerifyChallenge = async (challengeId, totpCode) => {
 *   try {
 *     await verifyTotpChallengeMutation.mutateAsync({
 *       challengeId,
 *       code: totpCode,
 *     });
 *     // 検証成功時の処理
 *     showSuccessMessage('認証に成功しました');
 *     // ダッシュボードなどにリダイレクト
 *     router.push('/dashboard');
 *   } catch (error) {
 *     // エラー処理
 *     showErrorMessage('認証に失敗しました。正しいコードを入力してください');
 *   }
 * };
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - ユーザーIDが必要なため、認証済みユーザーのコンテキストでのみ使用できます
 * - challengeIdはuseChallengeTOTPフックの応答から取得する必要があります
 * - TOTPコードはユーザーが認証アプリ（Google AuthenticatorやAurhyなど）から取得する必要があります
 * - 検証が成功すると、ユーザーは完全に認証され、保護されたリソースにアクセスできるようになります
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';
import { useFactorsMutationKey } from './use-user-factors-mutation-key';

// ... existing code ...
