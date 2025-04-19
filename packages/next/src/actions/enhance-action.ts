import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import type { ZodType, z } from 'zod';
import { verifyCaptchaToken } from '@kit/auth/captcha/server';
import {
  requireUser,
  type UserRequireClient,
} from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { zodParseFactory } from '../utils';

/**
 * @name enhanceAction
 * @description サーバーアクションを拡張し、CAPTCHA検証、スキーマ検証、認証チェックを追加します
 *
 * この関数は、Next.jsのサーバーアクションに以下の機能を追加します：
 * 1. 認証チェック: ユーザーが認証されているか確認し、未認証の場合はリダイレクト
 * 2. CAPTCHA検証: ボット対策のためのCAPTCHAトークン検証
 * 3. スキーマ検証: Zodを使用した入力データの型と値の検証
 *
 * これにより、各サーバーアクションで共通の検証ロジックを繰り返し実装する必要がなくなります。
 */
export function enhanceAction<
  Args,
  Response,
  Config extends {
    auth?: boolean;
    captcha?: boolean;
    schema?: z.ZodType<
      Config['captcha'] extends true ? Args & { captchaToken: string } : Args,
      z.ZodTypeDef
    >;
  },
>(
  fn: (
    params: Config['schema'] extends ZodType ? z.infer<Config['schema']> : Args,
    user: Config['auth'] extends false ? undefined : User
  ) => Response | Promise<Response>,
  config: Config
) {
  return async (
    params: Config['schema'] extends ZodType ? z.infer<Config['schema']> : Args
  ) => {
    type UserParam = Config['auth'] extends false ? undefined : User;

    // 認証が必要かどうかを設定から取得（デフォルトはtrue）
    const requireAuth = config.auth ?? true;
    let user: UserParam = undefined as UserParam;

    // 設定でスキーマが指定されている場合、入力データを検証
    const data = config.schema
      ? zodParseFactory(config.schema)(params)
      : params;

    // CAPTCHAトークンの検証が必要かどうかを設定から取得（デフォルトはfalse）
    const verifyCaptcha = config.captcha ?? false;

    // CAPTCHAトークンの検証が必要な場合、トークンを検証
    if (verifyCaptcha) {
      const token = (data as Args & { captchaToken: string }).captchaToken;

      // CAPTCHAトークンを検証。トークンが無効な場合はエラーをスロー
      await verifyCaptchaToken(token);
    }

    // 認証が必要な場合、ユーザーが認証されているか確認
    if (requireAuth) {
      try {
        // Supabaseクライアントを使用してユーザー認証情報を取得
        const auth = await requireUser(
          getSupabaseServerClient() as unknown as UserRequireClient
        );

        // ユーザーが認証されていない場合、指定されたURLにリダイレクト
        if (!auth.data) {
          redirect(auth.redirectTo);
        }

        // 認証済みの場合、ユーザー情報を user 変数に格納
        user = auth.data as unknown as UserParam;
      } catch (error) {
        // エラー処理...
      }
    }

    // すべての検証が成功したら、元の関数を実行して結果を返す
    return fn(data, user);
  };
}
