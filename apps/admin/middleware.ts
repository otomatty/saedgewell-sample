/**
 * Next.jsミドルウェアファイル
 *
 * このファイルはリクエストがルートハンドラーに到達する前に実行される処理を定義します。
 * 認証状態の確認、CSRF保護、リクエストIDの設定、国際化などを行い、
 * 適切なリダイレクトやヘッダー設定を行います。
 */

import type { NextRequest } from 'next/server';
import { NextResponse, URLPattern } from 'next/server';
import { headers } from 'next/headers';

import { CsrfError, createCsrfProtect } from '@edge-csrf/nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';

import { createMiddlewareClient } from '@kit/supabase/middleware-client';

import appConfig from '~/config/app.config';
import pathsConfig from '~/config/paths.config';

// import { checkRequiresMultiFactorAuthentication } from '@kit/supabase/check-requires-mfa';
// import createNextIntlMiddleware from 'next-intl/middleware'; // コメントアウト

// CSRFトークンを保存するCookie名
const CSRF_SECRET_COOKIE = 'csrfSecret';
// Next.jsのサーバーアクションを識別するためのヘッダー名
const NEXT_ACTION_HEADER = 'next-action';

/* // コメントアウト開始
// 国際化ミドルウェアの作成
const intlMiddleware = createNextIntlMiddleware({
  // サポートするロケール
  locales: ['ja', 'en'],
  // デフォルトのロケール
  defaultLocale: 'ja',
  // 国際化パスのパターン
  localePrefix: 'as-needed',
});
*/ // コメントアウト終了

/**
 * ミドルウェアが適用されるパスのマッチャー設定
 * 静的ファイルや画像、APIルートなどを除外
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|images|locales|assets|api/*).*)'],
};

/**
 * CSRF保護ミドルウェア
 *
 * @param request - Nextリクエストオブジェクト
 * @param response - Nextレスポンスオブジェクト（デフォルトは新しいレスポンス）
 * @param domain - クッキーのドメイン設定
 * @returns CSRF保護が適用されたレスポンス
 */
async function withCsrfMiddleware(
  request: NextRequest,
  response = new NextResponse(),
  domain = ''
) {
  // CSRF保護の設定
  const csrfProtect = createCsrfProtect({
    cookie: {
      secure: appConfig.production, // 本番環境ではセキュアCookieを使用
      name: CSRF_SECRET_COOKIE, // CSRFシークレットを保存するCookie名
      domain, // サブドメイン間でCookieを共有するためのドメイン設定
    },
    // サーバーアクションの場合はPOSTメソッドをCSRF検証から除外（Next.jsに組み込み保護があるため）
    // それ以外の場合は常にGET、HEAD、OPTIONSメソッドを除外
    ignoreMethods: isServerAction(request)
      ? ['POST']
      : ['GET', 'HEAD', 'OPTIONS'],
  });

  try {
    // リクエストにCSRF保護を適用
    await csrfProtect(request, response);

    return response;
  } catch (error) {
    // CSRFエラーの場合、401（認証エラー）レスポンスを返す
    if (error instanceof CsrfError) {
      return NextResponse.json('Invalid CSRF token', {
        status: 401,
      });
    }

    // その他のエラーは再スロー
    throw error;
  }
}

/**
 * リクエストがサーバーアクションかどうかを判定する関数
 *
 * @param request - Nextリクエストオブジェクト
 * @returns サーバーアクションの場合はtrue
 */
function isServerAction(request: NextRequest) {
  const headers = new Headers(request.headers);

  return headers.has(NEXT_ACTION_HEADER);
}

/**
 * ユーザー情報を取得する関数
 *
 * @param request - Nextリクエストオブジェクト
 * @param response - Nextレスポンスオブジェクト
 * @returns Supabaseから取得したユーザー情報
 */
const getUser = (request: NextRequest, response: NextResponse) => {
  const supabase = createMiddlewareClient(request, response);
  return supabase.auth.getUser();
};

/**
 * メインサイトへのリダイレクトURLを生成してリダイレクトする補助関数
 * @param req - NextRequest
 * @returns NextResponse (リダイレクト)
 */
function redirectToMainSite(req: NextRequest): NextResponse {
  const mainSiteUrl = 'https://saedgewell.test'; // 常にこのURLにリダイレクト
  return NextResponse.redirect(mainSiteUrl);
}

/**
 * 未認証ユーザーを認証案内ページにリダイレクトする補助関数
 * @param req - NextRequest
 * @returns NextResponse (リダイレクト)
 */
function redirectToMustAuthenticatePage(req: NextRequest): NextResponse {
  const redirectUrl = new URL('/auth/must-authenticate', req.nextUrl.origin)
    .href;

  return NextResponse.redirect(redirectUrl);
}

/**
 * リクエストに一意のIDを設定する関数
 *
 * @param request - リクエストオブジェクト
 */
function setRequestId(request: Request) {
  request.headers.set('x-correlation-id', crypto.randomUUID());
}

/**
 * Next.jsミドルウェア関数
 * @param request - Nextリクエストオブジェクト
 * @returns Nextレスポンスオブジェクト
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient(request, response);
  const pathname = request.nextUrl.pathname;

  // 認証セッションを取得（これ自体は必要）
  await supabase.auth.getSession();

  // 各リクエストに一意のIDを設定
  setRequestId(request);

  // 認証が不要なパスはそのまま通す
  const publicPaths = [
    '/', // ルートパス
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/callback',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify',
    '/auth/must-authenticate',
    // 必要に応じて他の公開パスを追加
  ];

  if (publicPaths.includes(pathname) || pathname.startsWith('/api/')) {
    // CSRF 保護は公開パスでも必要に応じて適用 (ここでは省略)
    return response; // 認証不要ならここで終了
  }

  // 未認証ユーザーは認証案内ページへリダイレクト
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return redirectToMustAuthenticatePage(request);
  }

  // === 認証情報と権限の取得 (ここで行う) ===
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  let isAdmin = false;
  let userId: string | undefined = undefined;
  let userEmail: string | undefined = undefined;

  if (user && !userError) {
    userId = user.id;
    userEmail = user.email;
    try {
      const { data: isAdminResult, error: rpcError } =
        await supabase.rpc('check_is_admin');
      if (rpcError) {
        console.error('[ADMIN MIDDLEWARE] check_is_admin RPC Error:', rpcError);
        // RPCエラーの場合は権限なしとして扱う
      } else {
        isAdmin = !!isAdminResult;
      }
    } catch (rpcCatchError) {
      console.error(
        '[ADMIN MIDDLEWARE] check_is_admin RPC Catch Error:',
        rpcCatchError
      );
      // 予期せぬエラーの場合も権限なしとして扱う
    }
  }
  // ===========================================

  // ユーザー未認証の場合
  if (!user) {
    console.log(
      '[ADMIN MIDDLEWARE] User not authenticated, redirecting to must-authenticate page'
    );
    return redirectToMustAuthenticatePage(request); // 認証案内ページへ
  }

  // 管理者でない場合
  if (!isAdmin) {
    console.log(
      '[ADMIN MIDDLEWARE] User is not admin, redirecting to main site'
    );
    return redirectToMainSite(request); // メインサイトへ
  }

  // --- 認証・権限チェックを通過した場合 ---

  // ホスト名とドメイン設定
  const host = request.headers.get('host') || '';
  const domain =
    process.env.SUPABASE_AUTH_COOKIE_DOMAIN ||
    process.env.AUTH_COOKIE_DOMAIN ||
    process.env.COOKIE_DOMAIN;

  // 変更を伴うリクエストにCSRF保護を適用
  const csrfResponse = await withCsrfMiddleware(request, response, domain);

  // 取得した認証情報をリクエストヘッダーに設定
  const requestHeaders = new Headers(request.headers);
  if (userId) requestHeaders.set('x-user-id', userId);
  if (userEmail) requestHeaders.set('x-user-email', userEmail);
  requestHeaders.set('x-is-admin', String(isAdmin)); // boolean を文字列に

  // サーバーアクションの場合、パスもヘッダーに追加
  if (isServerAction(request)) {
    requestHeaders.set('x-action-path', request.nextUrl.pathname);
  }

  // 設定したヘッダーを持つレスポンスを返す
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
    headers: csrfResponse.headers, // CSRFミドルウェアが設定したヘッダーも維持
  });

  // ----- 以下のパターンハンドラーや最後のチェックは不要になるので削除 -----
  /*
  // 特定のルートパターンに対するハンドラーを取得
  const handlePattern = matchUrlPattern(request.url);

  // パターンハンドラーが存在する場合、それを実行
  if (handlePattern) {
    const patternHandlerResponse = await handlePattern(request, csrfResponse);

    // パターンハンドラーがレスポンスを返した場合、それを返す
    if (patternHandlerResponse) {
      return patternHandlerResponse;
    }
  }

  // ... (最後のgetUser, check_is_admin の呼び出しなども削除)
  */
}
