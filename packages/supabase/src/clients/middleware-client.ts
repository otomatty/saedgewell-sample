/**
 * middleware-client.ts
 *
 * このファイルはNext.jsのミドルウェア内でSupabaseクライアントを初期化するための
 * 関数を提供します。
 *
 * 主な機能:
 * - ミドルウェア環境に最適化されたSupabaseクライアントの作成
 * - NextRequestとNextResponseオブジェクトを使用したクッキー管理
 * - 型安全なクライアントインスタンスの提供
 *
 * 処理の流れ:
 * 1. 'server-only'パッケージをインポートして、このコードがクライアントサイドに
 *    バンドルされることを防止
 * 2. NextRequestとNextResponseオブジェクトを引数として受け取る
 * 3. getSupabaseClientKeys()関数を呼び出して環境変数からSupabase URLと匿名キーを取得
 * 4. @supabase/ssrパッケージの createServerClient 関数を使用してクライアントを初期化
 * 5. NextRequestとNextResponseオブジェクトを使用してクッキーの取得と設定を行う
 *    カスタムハンドラを提供
 *    - getAll(): requestからすべてのクッキーを取得
 *    - setAll(): 新しいクッキーをrequestとresponseの両方に設定
 * 6. ジェネリック型パラメータを使用して、型安全なクライアントを返す
 *
 * 特記事項:
 * - クッキーの設定は、requestとresponseの両方に対して行われます。これは、
 *   現在のリクエスト処理中にクッキーを読み取れるようにするためと、
 *   レスポンスでクライアントにクッキーを送信するためです。
 * - サブドメイン間でクッキーを共有するために、domain属性を設定しています。
 *   ローカル開発環境では '.localhost' を使用し、本番環境ではトップレベルドメインに設定します。
 * - サブドメイン間でクッキーを共有するために、domain属性を設定しています。
 *   ローカル開発環境では '.localhost' を使用し、本番環境ではトップレベルドメインに設定します。
 *
 * 使用例:
 * ```
 * // middleware.ts内で
 * export async function middleware(request: NextRequest) {
 *   const response = NextResponse.next();
 *   const supabase = createMiddlewareClient(request, response);
 *
 *   // ユーザー情報の確認
 *   const { data: { user } } = await supabase.auth.getUser();
 *   // ユーザー情報の確認
 *   const { data: { user } } = await supabase.auth.getUser();
 *
 *   return response;
 * }
 * ```
 *
 * 注意点:
 * - このクライアントはNext.jsのミドルウェア内でのみ使用することを想定しています
 * - 環境変数 NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY が
 *   設定されている必要があります
 * - サブドメイン間でクッキーを共有するには、同じトップレベルドメインが必要です
 * - サブドメイン間でクッキーを共有するには、同じトップレベルドメインが必要です
 */
import 'server-only';

import type { NextRequest, NextResponse } from 'next/server';

import { createServerClient } from '@supabase/ssr';

import type { Database } from '../database.types';
import { getSupabaseClientKeys } from '../get-supabase-client-keys';

/**
 * Supabase用のミドルウェアクライアントを作成します。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト。
 * @param {NextResponse} response - Next.jsのレスポンスオブジェクト。
 */
export function createMiddlewareClient<GenericSchema = Database>(
  request: NextRequest,
  response: NextResponse
) {
  const keys = getSupabaseClientKeys();

  // 常に getSupabaseClientKeys() から取得した URL を使用
  const url = keys.url;

  // ホスト名からドメイン設定を決定
  const host = request.headers.get('host') || '';
  const referer = request.headers.get('referer') || '';
  const origin = request.headers.get('origin') || '';
  let domain = undefined;

  console.log('[MIDDLEWARE-CLIENT-DEBUG] Creating middleware client');
  console.log('[MIDDLEWARE-CLIENT-DEBUG] Host:', host);
  console.log('[MIDDLEWARE-CLIENT-DEBUG] Referer:', referer);
  console.log('[MIDDLEWARE-CLIENT-DEBUG] Origin:', origin);

  // 開発環境の場合
  if (host.includes('saedgewell.test')) {
    domain = '.saedgewell.test';
    console.log(
      '[MIDDLEWARE-CLIENT-DEBUG] saedgewell.test domain detected, setting domain to:',
      domain
    );
  }
  // 本番環境の場合: トップレベルドメインを抽出（example.comなど）
  else if (host.includes('.')) {
    const parts = host.split('.');
    if (parts.length >= 2) {
      domain = `.${parts.slice(-2).join('.')}`;
      console.log(
        '[MIDDLEWARE-CLIENT-DEBUG] Multi-part domain detected, setting domain to:',
        domain
      );
    }
  } else {
    console.log(
      '[MIDDLEWARE-CLIENT-DEBUG] No specific domain pattern detected, domain remains undefined'
    );
  }

  // 環境変数によるドメイン設定の上書き
  if (process.env.AUTH_COOKIE_DOMAIN) {
    console.log(
      '[MIDDLEWARE-CLIENT-DEBUG] Overriding domain with AUTH_COOKIE_DOMAIN:',
      process.env.AUTH_COOKIE_DOMAIN
    );
    domain = process.env.AUTH_COOKIE_DOMAIN;
  } else if (process.env.COOKIE_DOMAIN) {
    console.log(
      '[MIDDLEWARE-CLIENT-DEBUG] Overriding domain with COOKIE_DOMAIN:',
      process.env.COOKIE_DOMAIN
    );
    domain = process.env.COOKIE_DOMAIN;
  } else if (process.env.SUPABASE_AUTH_COOKIE_DOMAIN) {
    console.log(
      '[MIDDLEWARE-CLIENT-DEBUG] Overriding domain with SUPABASE_AUTH_COOKIE_DOMAIN:',
      process.env.SUPABASE_AUTH_COOKIE_DOMAIN
    );
    domain = process.env.SUPABASE_AUTH_COOKIE_DOMAIN;
  }

  console.log('[MIDDLEWARE-CLIENT-DEBUG] Final domain setting:', domain);

  return createServerClient<GenericSchema>(url, keys.anonKey, {
    cookies: {
      getAll() {
        const allCookies = request.cookies.getAll();
        console.log(
          '[MIDDLEWARE-CLIENT-DEBUG] Getting all cookies, count:',
          allCookies.length
        );

        // 認証関連のCookieを特定してログ出力
        const authCookies = allCookies.filter(
          (cookie) =>
            cookie.name.includes('auth') ||
            cookie.name.includes('supabase') ||
            cookie.name.startsWith('sb-')
        );

        if (authCookies.length > 0) {
          console.log(
            '[MIDDLEWARE-CLIENT-DEBUG] Auth cookies found:',
            authCookies.map((c) => c.name).join(', ')
          );
        } else {
          console.log('[MIDDLEWARE-CLIENT-DEBUG] No auth cookies found');
        }

        return allCookies;
      },
      setAll(cookiesToSet) {
        console.log(
          '[MIDDLEWARE-CLIENT-DEBUG] Setting cookies, count:',
          cookiesToSet.length
        );

        // リクエストにクッキーを設定
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
          console.log(
            `[MIDDLEWARE-CLIENT-DEBUG] Set cookie on request: ${name}`
          );
        }

        // レスポンスにクッキーを設定（ドメイン付き）
        for (const { name, value, options } of cookiesToSet) {
          const cookieOptions = {
            ...options,
            // ドメインが存在する場合のみ設定
            ...(domain ? { domain } : {}),
          };

          response.cookies.set(name, value, cookieOptions);
          console.log(
            `[MIDDLEWARE-CLIENT-DEBUG] Set cookie on response: ${name}, domain: ${domain || 'not set'}`
          );
        }
      },
    },
  });
}
