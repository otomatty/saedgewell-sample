import 'server-only';

import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

import { getSupabaseClientKeys } from './get-supabase-client-keys'; // パッケージ内部から参照
import {
  createAuthCallbackService,
  type AuthClientInterface,
} from './auth-callback.service'; // 同じディレクトリ内か確認

/**
 * 認証コールバック処理を表す型
 */
export type HandleCallbackResult =
  | { type: 'success'; nextPath: string }
  | {
      type: 'error';
      errorType: string;
      errorMessage: string;
      nextPath: string; // エラーページへのパス
    };

/**
 * ホスト名から適切なCookieドメインを取得します。
 * 環境変数 `COOKIE_DOMAIN` が設定されていればそれを優先します。
 * 開発環境 (`.saedgewell.test`)、localhost、または本番環境のホスト名に基づいて、
 * サブドメイン間で共有可能なドメイン（先頭にドットが付く）を返します。
 * 例:
 * - host='web.saedgewell.test' -> '.saedgewell.test'
 * - host='saedgewell.net' -> '.saedgewell.net'
 * - host='admin.saedgewell.com' -> '.saedgewell.com'
 * - host='localhost' -> 'localhost' (ドメイン属性なし)
 *
 * @param host リクエストのホスト名 (例: 'web.saedgewell.test', 'saedgewell.net', 'localhost')
 * @returns Cookieに設定するドメイン文字列。localhostの場合はホスト名をそのまま返す。
 */
function getCookieDomain(host: string): string {
  // 環境変数で明示的に設定されている場合はそれを使用
  if (process.env.COOKIE_DOMAIN) {
    console.log(
      `[getCookieDomain] Using COOKIE_DOMAIN env var: ${process.env.COOKIE_DOMAIN}`
    );
    return process.env.COOKIE_DOMAIN;
  }

  // 開発環境の場合
  if (host.includes('.saedgewell.test')) {
    console.log(
      `[getCookieDomain] Development host detected: ${host}, returning: .saedgewell.test`
    );
    return '.saedgewell.test';
  }

  // localhost の場合 (ポート番号が含まれる可能性も考慮)
  if (host === 'localhost' || host.startsWith('localhost:')) {
    console.log(
      `[getCookieDomain] Localhost detected: ${host}, returning host directly.`
    );
    return host; // ドメイン属性を設定しない
  }

  const parts = host.split('.');
  // example.com や saedgewell.net のようなドメイン (パーツが2つ)
  if (parts.length === 2) {
    const domain = `.${host}`;
    console.log(
      `[getCookieDomain] Two-part host detected: ${host}, returning: ${domain}`
    );
    return domain; // .example.com や .saedgewell.net
  }
  // sub.example.com のようなドメイン (パーツが3つ以上)
  if (parts.length >= 3) {
    // 最初のサブドメインを除いた部分をドメインとする
    const domain = `.${parts.slice(1).join('.')}`;
    console.log(
      `[getCookieDomain] Multi-part host detected: ${host}, returning: ${domain}`
    );
    return domain; // .example.com
  }

  // 通常は発生しないはずだが、フォールバック
  console.warn(
    `[getCookieDomain] Unexpected host format: ${host}, returning host directly.`
  );
  return host;
}

/**
 * 認証コールバックを処理し、リダイレクト先のパスまたはエラー情報を返します。
 * @param request NextRequestオブジェクト
 * @param defaultRedirectPath 認証成功時のデフォルトリダイレクト先
 * @returns HandleCallbackResult
 */
export async function handleAuthCallback(
  request: NextRequest,
  defaultRedirectPath: string
): Promise<HandleCallbackResult> {
  const cookieStore = await cookies();
  const keys = getSupabaseClientKeys();

  // リクエストURLを正しく構築
  const host = request.headers.get('host') || 'web.saedgewell.test'; // デフォルト値は環境に応じて変更するべき
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const correctUrl = `${protocol}://${host}${path}${search}`;
  const requestUrl = new URL(correctUrl);

  // ホスト名から適切なCookieドメインを取得
  const cookieDomain = getCookieDomain(host);
  console.log(
    `[handleAuthCallback] Setting cookies for domain: ${cookieDomain}, host: ${host}`
  );

  // Cookie オプションを定義 (これがサブドメイン共有の鍵！)
  const cookieOptions: CookieOptions = {
    domain: cookieDomain,
    path: '/',
    secure: true, // HTTPS必須
    sameSite: 'none', // クロスサイト送信許可
    httpOnly: true, // JavaScriptからのアクセス防止
    maxAge: 60 * 60 * 24 * 7, // 例: 7日間
  };

  // createServerClient (新しい推奨シグネチャを使用)
  const supabaseClient = createServerClient(keys.url, keys.anonKey, {
    cookies: {
      async getAll() {
        const cookies = await cookieStore.getAll();
        return cookies;
      },
      async setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            await cookieStore.set({
              name,
              value,
              ...cookieOptions,
              ...options,
            });
          }
        } catch (error) {
          console.error('[handleAuthCallback] Error setting cookies:', error);
        }
      },
    },
  });

  const service = createAuthCallbackService(
    supabaseClient as unknown as AuthClientInterface
  );

  try {
    let nextPath: string;
    if (requestUrl.searchParams.get('code')) {
      console.log('[handleAuthCallback] Exchanging code for session...');
      const { nextPath: resultPath } = await service.exchangeCodeForSession(
        new Request(correctUrl), // Requestオブジェクトを渡す
        {
          redirectPath: defaultRedirectPath,
        }
      );
      console.log(
        '[handleAuthCallback] Exchange successful, nextPath:',
        resultPath
      );
      nextPath = resultPath;
    } else {
      // 古いバージョンの verifyTokenHash の可能性もあるため、存在確認
      if (typeof service.verifyTokenHash === 'function') {
        console.log('[handleAuthCallback] Verifying token hash...');
        const url = await service.verifyTokenHash(new Request(correctUrl), {
          redirectPath: defaultRedirectPath,
        });
        console.log(
          '[handleAuthCallback] Verification successful, nextPath:',
          url.pathname + url.search
        );
        nextPath = url.pathname + url.search;
      } else {
        console.warn(
          '[handleAuthCallback] service.verifyTokenHash is not available. Assuming code exchange flow.'
        );
        // verifyTokenHash がない場合、エラーとするか、デフォルトパスにリダイレクトするか検討
        throw new Error(
          'Invalid callback request: No code found and verifyTokenHash not available.'
        );
      }
    }
    return { type: 'success', nextPath };
  } catch (error) {
    console.error(
      '[handleAuthCallback] Error during callback processing:',
      error
    );
    const errorType =
      error instanceof Error ? error.constructor.name : typeof error;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorRedirectPath = `/auth/callback/error?error=${encodeURIComponent('認証処理中にエラーが発生しました')}&error_type=${encodeURIComponent(errorType)}&error_message=${encodeURIComponent(errorMessage)}`;

    return {
      type: 'error',
      errorType,
      errorMessage,
      nextPath: errorRedirectPath,
    };
  }
}
