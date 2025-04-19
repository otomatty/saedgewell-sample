/**
 * Next.jsミドルウェアファイル
 *
 * このファイルはリクエストがルートハンドラーに到達する前に実行される処理を定義します。
 * 認証状態の確認、CSRF保護、リクエストIDの設定、国際化などを行い、
 * 適切なリダイレクトやヘッダー設定を行います。
 */

import type { NextRequest } from 'next/server';
import { NextResponse, URLPattern } from 'next/server';

import { CsrfError, createCsrfProtect } from '@edge-csrf/nextjs';

// import { checkRequiresMultiFactorAuthentication } from '@kit/supabase/check-requires-mfa';
import { createMiddlewareClient } from '@kit/supabase/middleware-client';

import appConfig from '~/config/app.config';
import pathsConfig from '~/config/paths.config';

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
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

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
 * ミドルウェア関数
 * 全てのリクエストに対して実行される
 *
 * @param request - Nextリクエストオブジェクト
 * @returns Nextレスポンスオブジェクト
 */
export async function middleware(request: NextRequest) {
  /* // コメントアウト開始
  // 国際化ミドルウェアを先に実行
  const intlResponse = await intlMiddleware(request);
  if (intlResponse) {
    // intlMiddlewareがリダイレクトなどを返した場合、そのレスポンスを返す
    if (intlResponse.status !== 200) {
      return intlResponse;
    }
  }
  */ // コメントアウト終了

  // ホスト名を取得
  const host = request.headers.get('host') || '';

  // ドメイン設定
  let domain: string | undefined = process.env.AUTH_COOKIE_DOMAIN;

  // ホスト名からドメイン設定を決定
  if (host.includes('saedgewell.test')) {
    const baseDomain = 'saedgewell.test';
    domain = `.${baseDomain}`;
  } else if (host.includes('localhost')) {
    domain = undefined;
  }

  // 環境変数で上書き
  if (process.env.AUTH_COOKIE_DOMAIN) {
    domain = process.env.AUTH_COOKIE_DOMAIN;
  } else if (process.env.COOKIE_DOMAIN) {
    domain = process.env.COOKIE_DOMAIN;
  }

  // Cookie処理
  const cookieList = request.cookies.getAll();
  const authCookies = cookieList.filter(
    (cookie) =>
      cookie.name.includes('auth') ||
      cookie.name.includes('supabase') ||
      cookie.name.startsWith('sb-')
  );

  // レスポンスの準備
  const response = NextResponse.next();

  // Supabaseクライアントの設定
  const supabase = createMiddlewareClient(request, response);

  // セッション更新時にデバッグ情報を出力できるよう拡張
  const originalAuth = supabase.auth;
  if (originalAuth?.getSession) {
    const originalGetSession = originalAuth.getSession.bind(originalAuth);
    supabase.auth.getSession = async () => {
      const result = await originalGetSession();
      return result;
    };
  }

  await supabase.auth.getSession();

  // 各リクエストに一意のIDを設定
  // これによりログやトレースでリクエストを追跡できる
  setRequestId(request);

  // 変更を伴うリクエストに対してCSRF保護を適用
  const csrfResponse = await withCsrfMiddleware(request, response, domain);

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

  // サーバーアクションの場合、アクションパスをヘッダーに追加
  // これによりサーバーアクション内でパスを知ることができる
  if (isServerAction(request)) {
    csrfResponse.headers.set('x-action-path', request.nextUrl.pathname);
  }

  // 重複クッキー問題の解決
  // サブドメイン固有のクッキーを削除し、親ドメインのクッキーのみを使用
  const authCookieNames = request.cookies
    .getAll()
    .filter(
      (cookie) =>
        cookie.name.includes('auth-token') ||
        cookie.name.includes('supabase') ||
        cookie.name.startsWith('sb-')
    )
    .map((cookie) => cookie.name);

  // 認証Cookieの処理ロジックを修正
  // 親ドメインのCookieを保持し、サブドメイン固有のCookieは削除しない
  // サブドメイン間で適切に認証状態を共有するため
  for (const cookieName of authCookieNames) {
    // 各認証Cookieの値とドメイン情報をログ出力
    const cookie = request.cookies.get(cookieName);
    if (cookie) {
    }

    // 注意: 以下の削除ロジックをコメントアウトして認証Cookieを保持する
    /*
    // ホストがサブドメインの場合、サブドメイン固有のクッキーを削除
    const host = request.headers.get('host') || '';
    if (host.includes('.')) {
      const parts = host.split('.');
      // サブドメインが含まれる場合（例：web.saedgewell.test）
      if (parts.length > 2) {
        response.cookies.delete(cookieName);
      }
    }
    */
  }

  // パターンハンドラーがレスポンスを返さなかった場合、
  // CSRFミドルウェアで処理されたレスポンスを返す
  return csrfResponse;
}

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
 * URLパターンとそれに対応するハンドラーを定義
 *
 * @returns パターンとハンドラーのペアの配列
 */
function getPatterns() {
  return [
    {
      // 認証関連のパスに対するパターン
      pattern: new URLPattern({ pathname: '/auth/*?' }),
      handler: async (req: NextRequest, res: NextResponse) => {
        const {
          data: { user },
        } = await getUser(req, res);

        // ユーザーがログアウト状態の場合、何もしない
        if (!user) {
          return;
        }

        // ホームページにリダイレクト
        return NextResponse.redirect(
          new URL(pathsConfig.app.home, req.nextUrl.origin).href
        );
      },
    },
  ];
}

/**
 * URLパターンに一致するハンドラーを見つける関数
 *
 * @param url - 検査するURL
 * @returns 一致するハンドラー関数、または undefined
 */
function matchUrlPattern(url: string) {
  const patterns = getPatterns();
  const input = url.split('?')[0]; // クエリパラメータを除去

  // 全てのパターンをチェックし、一致するものがあればそのハンドラーを返す
  for (const pattern of patterns) {
    const patternResult = pattern.pattern.exec(input);

    if (patternResult !== null && 'pathname' in patternResult) {
      return pattern.handler;
    }
  }
}

/**
 * リクエストに一意のIDを設定する関数
 *
 * @param request - リクエストオブジェクト
 */
function setRequestId(request: Request) {
  request.headers.set('x-correlation-id', crypto.randomUUID());
}
