/**
 * require-user.ts
 *
 * このファイルは保護されたルートやAPIエンドポイントで認証済みユーザーを要求するための
 * ユーティリティ関数を提供します。
 *
 * 主な機能:
 * - 現在のセッションからユーザー情報の取得と検証
 * - 未認証ユーザーの検出とサインインページへのリダイレクト情報の提供
 * - 多要素認証（MFA）が必要なユーザーの検出とMFA検証ページへのリダイレクト情報の提供
 *
 * 処理の流れ:
 * 1. Supabaseクライアントからユーザー情報を取得
 * 2. ユーザーが存在しない場合、AuthenticationErrorをスローし、サインインページへの
 *    リダイレクト情報を返す
 * 3. ユーザーが存在する場合、多要素認証が必要かどうかを確認
 * 4. 多要素認証が必要な場合、MultiFactorAuthErrorをスローし、MFA検証ページへの
 *    リダイレクト情報を返す
 * 5. すべての条件を満たす場合、ユーザー情報を返す
 *
 * 特記事項:
 * - AuthenticationErrorとMultiFactorAuthErrorの2つのカスタムエラークラスを定義
 * - check-requires-mfa.tsと連携して多要素認証の要件を確認
 *
 * 使用例:
 * ```
 * // 保護されたルートやAPIエンドポイントで
 * const supabase = getSupabaseServerClient();
 * const { data: user, error, redirectTo } = await requireUser(supabase);
 *
 * if (error) {
 *   // ユーザーを適切なページにリダイレクト
 *   redirect(redirectTo);
 * }
 *
 * // 認証済みユーザーとしての処理を続行
 * ```
 *
 * 注意点:
 * - このファイルはサーバーサイドでのみ使用することを想定しています
 * - 認証が必要なページやAPIエンドポイントの入り口で使用し、未認証ユーザーのアクセスを防ぎます
 * - リダイレクトパスは定数として定義されており、必要に応じてカスタマイズできます
 */
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from './database';

import {
  checkRequiresMultiFactorAuthentication,
  type MfaCheckerClient,
} from './check-requires-mfa';

// カスタム型の代わりに標準のSupabaseClientを拡張した型を使用
export type UserRequireClient = SupabaseClient<Database> & {
  auth: SupabaseClient<Database>['auth'] & MfaCheckerClient['auth'];
};

const MULTI_FACTOR_AUTH_VERIFY_PATH = '/';
const SIGN_IN_PATH = '/';

/**
 * @name requireUser
 * @description Require a session to be present in the request
 * @param client - SupabaseClient型のクライアント
 */
export async function requireUser(client: SupabaseClient<Database>): Promise<
  | {
      error: null;
      data: User;
    }
  | (
      | {
          error: AuthenticationError;
          data: null;
          redirectTo: string;
        }
      | {
          error: MultiFactorAuthError;
          data: null;
          redirectTo: string;
        }
    )
> {
  const { data, error } = await client.auth.getUser();

  // User型のチェック
  if (!data.user || error) {
    return {
      data: null,
      error: new AuthenticationError(),
      redirectTo: SIGN_IN_PATH,
    };
  }

  // client型をMfaCheckerClientの要件を満たすように調整
  const mfaClient = client as unknown as MfaCheckerClient;
  const requiresMfa = await checkRequiresMultiFactorAuthentication(mfaClient);

  // If the user requires multi-factor authentication,
  // redirect them to the page where they can verify their identity.
  if (requiresMfa) {
    return {
      data: null,
      error: new MultiFactorAuthError(),
      redirectTo: MULTI_FACTOR_AUTH_VERIFY_PATH,
    };
  }

  return {
    error: null,
    data: data.user, // 認証済みユーザーデータを返す (User型)
  };
}

class AuthenticationError extends Error {
  constructor() {
    super('Authentication required');
  }
}

class MultiFactorAuthError extends Error {
  constructor() {
    super('Multi-factor authentication required');
  }
}
