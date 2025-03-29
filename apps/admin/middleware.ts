import type { NextRequest } from 'next/server';
import { NextResponse, URLPattern } from 'next/server';

import { CsrfError, createCsrfProtect } from '@edge-csrf/nextjs';

import { checkRequiresMultiFactorAuthentication } from '@kit/supabase/check-requires-mfa';
import { createMiddlewareClient } from '@kit/supabase/middleware-client';

import appConfig from '~/config/app.config';
import pathsConfig from '~/config/paths.config';

const CSRF_SECRET_COOKIE = 'csrfSecret';
const NEXT_ACTION_HEADER = 'next-action';

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|locales|assets|api/*).*)'],
};

const getUser = (request: NextRequest, response: NextResponse) => {
  const supabase = createMiddlewareClient(request, response);

  return supabase.auth.getUser();
};

export async function middleware(request: NextRequest) {
  // ホスト名を取得
  const host = request.headers.get('host') || '';

  // ドメイン設定
  let domain: string | undefined;

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
  } else if (process.env.SUPABASE_AUTH_COOKIE_DOMAIN) {
    domain = process.env.SUPABASE_AUTH_COOKIE_DOMAIN;
  }

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

  // set a unique request ID for each request
  // this helps us log and trace requests
  setRequestId(request);

  // apply CSRF protection for mutating requests
  const csrfResponse = await withCsrfMiddleware(request, response, domain);

  // handle patterns for specific routes
  const handlePattern = matchUrlPattern(request.url);

  // if a pattern handler exists, call it
  if (handlePattern) {
    const patternHandlerResponse = await handlePattern(request, csrfResponse);

    // if a pattern handler returns a response, return it
    if (patternHandlerResponse) {
      return patternHandlerResponse;
    }
  }

  // append the action path to the request headers
  // which is useful for knowing the action path in server actions
  if (isServerAction(request)) {
    csrfResponse.headers.set('x-action-path', request.nextUrl.pathname);
  }

  // 認証Cookieの処理ロジックを修正
  // 親ドメインのCookieを保持し、サブドメイン固有のCookieは削除しない
  // サブドメイン間で適切に認証状態を共有するため
  const authCookieNames = request.cookies
    .getAll()
    .filter(
      (cookie) =>
        cookie.name.includes('auth-token') ||
        cookie.name.includes('supabase') ||
        cookie.name.startsWith('sb-')
    )
    .map((cookie) => cookie.name);

  for (const cookieName of authCookieNames) {
    // 各認証Cookieの値とドメイン情報をログ出力（必要であれば）
    const cookie = request.cookies.get(cookieName);
    if (cookie) {
      // デバッグが必要な場合はここでログ出力
    }

    // 注意: 以下の削除ロジックをコメントアウトして認証Cookieを保持する
    /*
    // ホストがサブドメインの場合、サブドメイン固有のクッキーを削除
    const host = request.headers.get('host') || '';
    if (host.includes('.')) {
      const parts = host.split('.');
      // サブドメインが含まれる場合（例：admin.saedgewell.test）
      if (parts.length > 2) {
        response.cookies.delete(cookieName);
      }
    }
    */
  }

  // if no pattern handler returned a response,
  // return the session response
  return csrfResponse;
}

async function withCsrfMiddleware(
  request: NextRequest,
  response = new NextResponse(),
  domain = ''
) {
  // set up CSRF protection
  const csrfProtect = createCsrfProtect({
    cookie: {
      secure: appConfig.production,
      name: CSRF_SECRET_COOKIE,
      domain, // サブドメイン間でCookieを共有するためのドメイン設定
    },
    // ignore CSRF errors for server actions since protection is built-in
    ignoreMethods: isServerAction(request)
      ? ['POST']
      : // always ignore GET, HEAD, and OPTIONS requests
        ['GET', 'HEAD', 'OPTIONS'],
  });

  try {
    await csrfProtect(request, response);

    return response;
  } catch (error) {
    // if there is a CSRF error, return a 403 response
    if (error instanceof CsrfError) {
      return NextResponse.json('Invalid CSRF token', {
        status: 401,
      });
    }

    throw error;
  }
}

function isServerAction(request: NextRequest) {
  const headers = new Headers(request.headers);

  return headers.has(NEXT_ACTION_HEADER);
}
/**
 * Define URL patterns and their corresponding handlers.
 */
function getPatterns() {
  return [
    {
      pattern: new URLPattern({ pathname: '/auth/*?' }),
      handler: async (req: NextRequest, res: NextResponse) => {
        const {
          data: { user },
        } = await getUser(req, res);

        // the user is logged out, so we don't need to do anything
        if (!user) {
          return;
        }

        // check if we need to verify MFA (user is authenticated but needs to verify MFA)
        const isVerifyMfa = req.nextUrl.pathname === pathsConfig.auth.verifyMfa;

        // If user is logged in and does not need to verify MFA,
        // redirect to home page.
        if (!isVerifyMfa) {
          return NextResponse.redirect(
            new URL(pathsConfig.app.home, req.nextUrl.origin).href
          );
        }
      },
    },
    {
      pattern: new URLPattern({ pathname: '/home/*?' }),
      handler: async (req: NextRequest, res: NextResponse) => {
        const {
          data: { user },
        } = await getUser(req, res);

        const origin = req.nextUrl.origin;
        const next = req.nextUrl.pathname;

        // If user is not logged in, redirect to sign in page.
        if (!user) {
          const signIn = pathsConfig.auth.signIn;
          const redirectPath = `${signIn}?next=${next}`;

          return NextResponse.redirect(new URL(redirectPath, origin).href);
        }

        const supabase = createMiddlewareClient(req, res);

        const requiresMultiFactorAuthentication =
          await checkRequiresMultiFactorAuthentication(supabase);

        // If user requires multi-factor authentication, redirect to MFA page.
        if (requiresMultiFactorAuthentication) {
          return NextResponse.redirect(
            new URL(pathsConfig.auth.verifyMfa, origin).href
          );
        }
      },
    },
  ];
}

/**
 * Match URL patterns to specific handlers.
 * @param url
 */
function matchUrlPattern(url: string) {
  const patterns = getPatterns();
  const input = url.split('?')[0];

  for (const pattern of patterns) {
    const patternResult = pattern.pattern.exec(input);

    if (patternResult !== null && 'pathname' in patternResult) {
      return pattern.handler;
    }
  }
}

/**
 * Set a unique request ID for each request.
 * @param request
 */
function setRequestId(request: Request) {
  request.headers.set('x-correlation-id', crypto.randomUUID());
}
