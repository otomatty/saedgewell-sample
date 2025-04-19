/**
 * use-challenge-totp.ts
 *
 * このファイルはTOTP（Time-based One-Time Password）認証のチャレンジを開始するための
 * カスタムフックを提供します。多要素認証（MFA）のログインフローで使用されます。
 *
 * 主な機能:
 * - TOTP認証チャレンジの開始処理
 * - ファクターIDによる特定のTOTPファクターのチャレンジ
 * - React QueryのuseMutationを使用した状態管理
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. useFactorsMutationKeyフックを使用してユーザーIDに基づくミューテーションキーを生成
 * 3. mutationFn内でclient.auth.mfa.challenge()を呼び出してTOTPチャレンジを開始
 * 4. エラーが発生した場合は例外をスロー
 * 5. 成功した場合はレスポンスデータを返す（チャレンジID含む）
 *
 * 特記事項:
 * - useFactorsMutationKeyフックを使用して、クエリキーとミューテーションキーの一貫性を確保
 * - チャレンジIDは後続のTOTP検証ステップで必要になります
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const { data: user } = useUser();
 * const challengeTotpMutation = useChallengeTOTP(user?.id);
 *
 * const handleStartChallenge = async (factorId) => {
 *   try {
 *     const { data } = await challengeTotpMutation.mutateAsync(factorId);
 *     // チャレンジIDを保存
 *     setChallengeId(data.id);
 *     // TOTPコード入力フォームを表示
 *     setShowTotpForm(true);
 *   } catch (error) {
 *     // エラー処理
 *     showErrorMessage('認証チャレンジの開始に失敗しました');
 *   }
 * };
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - ユーザーIDが必要なため、認証済みユーザーのコンテキストでのみ使用できます
 * - チャレンジ後、ユーザーは認証アプリからTOTPコードを取得し、
 *   useVerifyTotpChallengeフックを使用して検証する必要があります
 * - チャレンジIDは一時的なもので、短時間で有効期限が切れます
 */
import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';
import { useFactorsMutationKey } from './use-user-factors-mutation-key';

// ... existing code ...
