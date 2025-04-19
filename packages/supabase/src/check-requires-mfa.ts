/**
 * check-requires-mfa.ts
 *
 * このファイルはユーザーが多要素認証（MFA）を必要とするかどうかを確認するための
 * ユーティリティ関数を提供します。
 *
 * 主な機能:
 * - 現在のセッションが多要素認証を必要とするかどうかの判定
 * - 認証保証レベル（Authentication Assurance Level: AAL）の確認
 *
 * 処理の流れ:
 * 1. Supabaseクライアントから現在の認証保証レベル（AAL）を取得
 * 2. 次の認証保証レベルがAAL2（多要素認証）であり、かつ現在のレベルがそれと
 *    異なる場合、MFAが必要と判断
 *
 * 特記事項:
 * - Supabase認証のバグを回避するための一時的なワークアラウンドが含まれています
 *   （suppressGetSessionWarningフラグの設定と解除）
 * - 認証保証レベルの取得中にエラーが発生した場合は例外をスローします
 *
 * 使用例:
 * ```
 * const supabase = getSupabaseServerClient();
 * const requiresMfa = await checkRequiresMultiFactorAuthentication(supabase);
 *
 * if (requiresMfa) {
 *   // ユーザーをMFA検証ページにリダイレクト
 *   redirect('/auth/verify');
 * }
 * ```
 *
 * 注意点:
 * - この関数は通常、require-user.tsと連携して使用されます
 * - MFAが必要な場合、ユーザーは適切な検証ページにリダイレクトされるべきです
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database';

// checkRequiresMultiFactorAuthentication が必要とする最低限のクライアントインターフェース
export interface MfaCheckerClient {
  auth: {
    mfa: {
      getAuthenticatorAssuranceLevel(): Promise<{
        data: {
          currentLevel: string | null;
          nextLevel: string | null;
        };
        error: Error | null;
      }>;
    };
    // suppressGetSessionWarning のための型定義 (オプショナル)
    suppressGetSessionWarning?: boolean;
  };
}

const ASSURANCE_LEVEL_2 = 'aal2';

/**
 * @name checkRequiresMultiFactorAuthentication
 * @description Checks if the current session requires multi-factor authentication.
 * We do it by checking that the next assurance level is AAL2 and that the current assurance level is not AAL2.
 * @param client - MfaCheckerClient 型のクライアント
 */
export async function checkRequiresMultiFactorAuthentication(
  client: MfaCheckerClient
) {
  // Suppress the getSession warning. Remove when the issue is fixed.
  // https://github.com/supabase/auth-js/issues/873
  if ('suppressGetSessionWarning' in client.auth) {
    client.auth.suppressGetSessionWarning = true;
  }

  const assuranceLevel = await client.auth.mfa.getAuthenticatorAssuranceLevel();

  if ('suppressGetSessionWarning' in client.auth) {
    client.auth.suppressGetSessionWarning = false;
  }

  if (assuranceLevel.error) {
    throw new Error(assuranceLevel.error.message);
  }

  const { nextLevel, currentLevel } = assuranceLevel.data;

  return nextLevel === ASSURANCE_LEVEL_2 && nextLevel !== currentLevel;
}
