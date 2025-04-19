/**
 * use-enroll-totp.ts
 *
 * このファイルはTOTP（Time-based One-Time Password）認証器を登録するための
 * カスタムフックを提供します。多要素認証（MFA）の設定に使用されます。
 *
 * 主な機能:
 * - TOTP認証器の登録開始処理
 * - QRコードとシークレットキーの取得
 * - React QueryのuseMutationを使用した状態管理
 *
 * 処理の流れ:
 * 1. useSupabaseフックを使用してSupabaseクライアントを取得
 * 2. useFactorsMutationKeyフックを使用してユーザーIDに基づくミューテーションキーを生成
 * 3. mutationFn内でclient.auth.mfa.enroll()を呼び出してTOTP登録を開始
 * 4. エラーが発生した場合は例外をスロー
 * 5. 成功した場合はレスポンスデータを返す（QRコードURLとシークレットキーを含む）
 *
 * 特記事項:
 * - useFactorsMutationKeyフックを使用して、クエリキーとミューテーションキーの一貫性を確保
 * - 登録完了には別途、生成されたTOTPコードを使用して検証する必要があります
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const { data: user } = useUser();
 * const enrollTotpMutation = useEnrollTotp(user?.id);
 *
 * const handleStartEnrollment = async () => {
 *   try {
 *     const data = await enrollTotpMutation.mutateAsync();
 *     // QRコードとシークレットキーを表示
 *     setQrCodeUrl(data.totp.qr_code);
 *     setSecretKey(data.totp.secret);
 *     // 次のステップ（検証）に進む
 *   } catch (error) {
 *     // エラー処理
 *   }
 * };
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - ユーザーIDが必要なため、認証済みユーザーのコンテキストでのみ使用できます
 * - 登録プロセスを完了するには、生成されたTOTPコードを使用して検証する必要があります
 *   （useVerifyTotpフックを使用）
 * - QRコードはユーザーに表示し、Google AuthenticatorやAurhyなどのアプリでスキャンできるようにします
 * - シークレットキーはQRコードをスキャンできない場合の代替手段として提供します
 */
import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';
import { useFactorsMutationKey } from './use-user-factors-mutation-key';

// ... existing code ...
