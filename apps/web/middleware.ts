/**
 * Next.jsミドルウェアファイル
 *
 * このファイルはリクエストがルートハンドラーに到達する前に実行される処理を定義します。
 * 認証状態の確認、CSRF保護、リクエストIDの設定などを行い、
 * 適切なリダイレクトやヘッダー設定を行います。
 */

import type { NextRequest } from 'next/server';
import { NextResponse, URLPattern } from 'next/server';

import { CsrfError, createCsrfProtect } from '@edge-csrf/nextjs';

import { checkRequiresMultiFactorAuthentication } from '@kit/supabase/check-requires-mfa';
import { createMiddlewareClient } from '@kit/supabase/middleware-client';

import appConfig from '~/config/app.config';
import pathsConfig from '~/config/paths.config';

// CSRFトークンを保存するCookie名
const CSRF_SECRET_COOKIE = 'csrfSecret';
// Next.jsのサーバーアクションを識別するためのヘッダー名
const NEXT_ACTION_HEADER = 'next-action';

/**
 * ミドルウェアが適用されるパスのマッチャー設定
 * 静的ファイルや画像、APIルートなどを除外
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|images|locales|assets|api/*).*)'],
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
  const host = request.headers.get('host') || '';
  const path = request.nextUrl.pathname;

  let domain: string | undefined;

  if (host.includes('saedgewell.test')) {
    const baseDomain = 'saedgewell.test';
    domain = `.${baseDomain}`;
  } else if (host.includes('localhost')) {
    domain = undefined;
  }

  if (process.env.AUTH_COOKIE_DOMAIN) {
    domain = process.env.AUTH_COOKIE_DOMAIN;
  } else if (process.env.COOKIE_DOMAIN) {
    domain = process.env.COOKIE_DOMAIN;
  } else if (process.env.SUPABASE_AUTH_COOKIE_DOMAIN) {
    domain = process.env.SUPABASE_AUTH_COOKIE_DOMAIN;
  }

  const response = NextResponse.next();

  const cookieList = request.cookies.getAll();
  const authCookies = cookieList.filter(
    (cookie) =>
      cookie.name.includes('auth') ||
      cookie.name.includes('supabase') ||
      cookie.name.startsWith('sb-')
  );

  const supabase = createMiddlewareClient(request, response);

  let profileCheckDone = false;

  const originalAuth = supabase.auth;
  if (originalAuth?.getSession) {
    const originalGetSession = originalAuth.getSession.bind(originalAuth);
    supabase.auth.getSession = async () => {
      const result = await originalGetSession();

      if (result.data.session?.user?.id && !profileCheckDone) {
        profileCheckDone = true;
        if (result.data.session?.user?.id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', result.data.session.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', {
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint,
              code: profileError.code,
            });
          }

          if (profile) {
            console.log('Profile data:', JSON.stringify(profile, null, 2));
          } else {
            console.log('No profile found for user');
          }

          if (!profile && !profileError) {
            console.log(
              'Attempting to create profile for user:',
              result.data.session.user.id
            );

            const userEmail = result.data.session.user.email;
            if (!userEmail) {
              console.error('Cannot create profile: user email is missing');
              return result;
            }

            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: result.data.session.user.id,
                email: userEmail,
                updated_at: new Date().toISOString(),
              })
              .select()
              .single();

            if (createError) {
              console.error('Profile creation error:', {
                message: createError.message,
                details: createError.details,
                hint: createError.hint,
                code: createError.code,
              });
            } else if (newProfile) {
              console.log(
                'New profile created:',
                JSON.stringify(newProfile, null, 2)
              );
            }
          }
        }
      }

      return result;
    };
  }

  const session = await supabase.auth.getSession();

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
    const cookie = request.cookies.get(cookieName);
    if (cookie) {
      console.log(
        `Auth cookie ${cookieName}: value length = ${cookie.value.length}`
      );
    }
  }

  setRequestId(request);

  const csrfResponse = await withCsrfMiddleware(request, response, domain);

  const handlePattern = matchUrlPattern(request.url);

  if (handlePattern) {
    const patternHandlerResponse = await handlePattern(request, csrfResponse);

    if (patternHandlerResponse) {
      return patternHandlerResponse;
    }
  }

  if (isServerAction(request)) {
    csrfResponse.headers.set('x-action-path', request.nextUrl.pathname);
  }

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
  const csrfProtect = createCsrfProtect({
    cookie: {
      secure: appConfig.production,
      name: CSRF_SECRET_COOKIE,
      domain,
    },
    ignoreMethods: isServerAction(request)
      ? ['POST']
      : ['GET', 'HEAD', 'OPTIONS'],
  });

  try {
    await csrfProtect(request, response);

    return response;
  } catch (error) {
    if (error instanceof CsrfError) {
      return NextResponse.json('Invalid CSRF token', {
        status: 401,
      });
    }

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
      pattern: new URLPattern({ pathname: '/auth/*?' }),
      handler: async (req: NextRequest, res: NextResponse) => {
        const {
          data: { user },
        } = await getUser(req, res);

        if (!user) {
          return;
        }

        const isVerifyMfa = req.nextUrl.pathname === pathsConfig.auth.verifyMfa;

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

        if (!user) {
          const signIn = pathsConfig.auth.signIn;
          const redirectPath = `${signIn}?next=${next}`;

          return NextResponse.redirect(new URL(redirectPath, origin).href);
        }

        const supabase = createMiddlewareClient(req, res);

        const requiresMultiFactorAuthentication =
          await checkRequiresMultiFactorAuthentication(supabase);

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
 * URLパターンに一致するハンドラーを見つける関数
 *
 * @param url - 検査するURL
 * @returns 一致するハンドラー関数、または undefined
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
 * リクエストに一意のIDを設定する関数
 *
 * @param request - リクエストオブジェクト
 */
function setRequestId(request: Request) {
  request.headers.set('x-correlation-id', crypto.randomUUID());
}
