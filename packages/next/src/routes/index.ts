import 'server-only';

import { redirect } from 'next/navigation';
import type { NextRequest, NextResponse } from 'next/server';

import type { User, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@kit/supabase/database';

import type { z } from 'zod';

import { verifyCaptchaToken } from '@kit/auth/captcha/server';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { zodParseFactory } from '../utils';

interface Config<Schema> {
  auth?: boolean;
  captcha?: boolean;
  schema?: Schema;
}

interface HandlerParams<
  Schema extends z.ZodType | undefined,
  RequireAuth extends boolean | undefined,
> {
  request: NextRequest;
  user: RequireAuth extends false ? undefined : User;
  body: Schema extends z.ZodType ? z.infer<Schema> : undefined;
  params: Record<string, string>;
}

/**
 * 拡張されたルートハンドラ関数。
 *
 * この関数はリクエストとパラメータオブジェクトを引数として受け取り、ルートハンドラ関数を返します。
 * 返されたルートハンドラ関数は、HTTPリクエストを処理し、提供されたパラメータに基づいて
 * 追加の機能拡張（認証、CAPTCHA検証、スキーマ検証など）を適用します。
 *
 * 主な機能:
 * 1. 認証チェック: ユーザーが認証されているか確認し、未認証の場合はリダイレクト
 * 2. CAPTCHA検証: ヘッダーからCAPTCHAトークンを取得して検証
 * 3. スキーマ検証: Zodを使用したリクエストボディの検証
 * 4. 型安全性: TypeScriptの型推論を活用した型安全なハンドラ
 *
 * 使用例:
 * export const POST = enhanceRouteHandler(
 *   ({ request, body, user }) => {
 *     return new Response(`こんにちは、${body.name}さん!`);
 *   },
 *   {
 *     schema: z.object({
 *       name: z.string(),
 *     }),
 *   },
 * );
 *
 */
export const enhanceRouteHandler = <
  Body,
  Params extends Config<z.ZodType<Body, z.ZodTypeDef>>,
>(
  // ルートハンドラ関数
  handler:
    | ((
        params: HandlerParams<Params['schema'], Params['auth']>
      ) => NextResponse | Response)
    | ((
        params: HandlerParams<Params['schema'], Params['auth']>
      ) => Promise<NextResponse | Response>),
  // パラメータオブジェクト
  params?: Params
) => {
  /**
   * ルートハンドラ関数。
   *
   * この関数はリクエストオブジェクトを引数として受け取り、レスポンスオブジェクトを返します。
   * Next.jsのAPIルートで使用されるメインの処理関数です。
   */
  return async function routeHandler(
    request: NextRequest,
    routeParams: {
      params: Promise<Record<string, string>>;
    }
  ) {
    type UserParam = Params['auth'] extends false ? undefined : User;

    let user: UserParam = undefined as UserParam;

    // CAPTCHAトークンを検証すべきかどうかを設定から取得（デフォルトはfalse）
    const shouldVerifyCaptcha = params?.captcha ?? false;

    // CAPTCHAトークンの検証が必要かつ設定されている場合、トークンを検証
    if (shouldVerifyCaptcha) {
      const token = captchaTokenGetter(request);

      // CAPTCHAトークンが提供されていない場合、400エラーレスポンスを返す
      if (token) {
        await verifyCaptchaToken(token);
      } else {
        return new Response('CAPTCHAトークンが必要です', { status: 400 });
      }
    }

    // Supabaseクライアントを初期化
    // @ts-ignore
    const client = getSupabaseServerClient();

    // 認証が必要かどうかを設定から取得（デフォルトはtrue）
    const shouldVerifyAuth = params?.auth ?? true;

    // 認証が必要な場合、ユーザーが認証されているか確認
    if (shouldVerifyAuth) {
      // 認証済みユーザーを取得
      const auth = await requireUser(client);

      // ユーザーが認証されていない場合、指定されたURLにリダイレクト
      if (auth.error) {
        return redirect(auth.redirectTo);
      }

      user = auth.data as UserParam;
    }

    let body: Params['schema'] extends z.ZodType
      ? z.infer<Params['schema']>
      : undefined = undefined;

    // スキーマが指定されている場合、リクエストボディを検証
    if (params?.schema) {
      // リクエストをクローンしてボディを読み取り
      // ハンドラに安全に渡せるようにする
      const json = await request.clone().json();

      // Zodスキーマを使用してリクエストボディを検証
      body = zodParseFactory(params.schema)(
        json
      ) as Params['schema'] extends z.ZodType
        ? z.infer<Params['schema']>
        : never;
    }

    // すべての検証が成功したら、ハンドラ関数を実行して結果を返す
    return handler({
      request,
      body,
      user,
      params: await routeParams.params,
    });
  };
};

/**
 * リクエストヘッダーからCAPTCHAトークンを取得します。
 * @param request NextRequestオブジェクト
 * @returns CAPTCHAトークン文字列またはnull
 */
function captchaTokenGetter(request: NextRequest) {
  return request.headers.get('x-captcha-token');
}
