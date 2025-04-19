import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

import {
  createAuthCallbackService,
  type AuthClientInterface,
} from '@kit/supabase/auth';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
// サーバーサイドでの実行でエラーになるためコメントアウト
// import { AUTH_COOKIE_OPTIONS } from '@kit/supabase/auth-config';

// pathsConfig のインポートは不要になる可能性があるため、一旦コメントアウト
// import pathsConfig from '~/config/paths.config';

// フォールバック用のパスを定義（例: ホームパス）
const FALLBACK_REDIRECT_PATH = '/';

// Edge Runtimeではなく、Node.js環境で実行するための設定
export const runtime = 'nodejs';

/**
 * 認証コールバック処理を行うハンドラー
 * このルートは認証プロバイダーからのコールバックを受け取り、セッションを確立します
 */
export async function GET(request: NextRequest) {
  // リクエストURLを正しく構築する
  // Next.jsのrequest.urlはlocalhost:ポート番号になっている可能性があるため、
  // ホストヘッダーと転送プロトコルから正しいURLを構築
  const host = request.headers.get('host') || 'docs.saedgewell.test';
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  // パスとクエリパラメータは元のリクエストから取得
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  // 正しいURLを構築
  const correctUrl = `${protocol}://${host}${path}${search}`;
  // 新しいURLオブジェクトを作成
  const requestUrl = new URL(correctUrl);

  // 認証サービスの初期化時に型アサーションを使用
  const supabaseClient = getSupabaseServerClient();
  const service = createAuthCallbackService(
    supabaseClient as unknown as AuthClientInterface
  );

  try {
    // リダイレクト先URLを決定する
    let nextPath: string;

    // コードがある場合は認証コードとセッションを交換する
    if (requestUrl.searchParams.get('code')) {
      // セッション交換を実行
      // redirectPath を必須引数として渡すが、値はフォールバック用とする
      const { nextPath: resultPath } = await service.exchangeCodeForSession(
        new Request(correctUrl),
        { redirectPath: FALLBACK_REDIRECT_PATH } // フォールバックパスを指定
      );

      nextPath = resultPath;
    } else {
      // トークンハッシュがある場合はトークンを検証する
      // redirectPath を必須引数として渡すが、値はフォールバック用とする
      const url = await service.verifyTokenHash(new Request(correctUrl), {
        redirectPath: FALLBACK_REDIRECT_PATH, // フォールバックパスを指定
      });

      nextPath = url.pathname + url.search;
    }

    console.log('[AUTH DEBUG] Redirecting to:', nextPath);
    // リダイレクト実行
    return redirect(nextPath);
  } catch (error) {
    // エラー時は認証エラーページへリダイレクト
    const errorType =
      error instanceof Error ? error.constructor.name : typeof error;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorRedirectPath = `/auth/callback/error?error=${encodeURIComponent('認証処理中にエラーが発生しました')}&error_type=${encodeURIComponent(errorType)}&error_message=${encodeURIComponent(errorMessage)}`;
    console.error(
      '[AUTH DEBUG] Callback Error, redirecting to:',
      errorRedirectPath,
      error
    );

    return redirect(errorRedirectPath);
  }
}
