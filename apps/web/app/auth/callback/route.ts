import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import pathsConfig from '~/config/paths.config';
import { handleAuthCallback } from '@kit/supabase/handle-auth-callback'; // パスはこれで正しいと仮定

// Edge Runtimeではなく、Node.js環境で実行するための設定
export const runtime = 'nodejs';

/**
 * 認証コールバック処理を行うハンドラー
 * このルートは認証プロバイダーからのコールバックを受け取り、セッションを確立します
 */
export async function GET(request: NextRequest) {
  try {
    // パッケージ側の関数を呼び出し
    const result = await handleAuthCallback(
      request,
      pathsConfig.app.home // 成功時のデフォルトリダイレクト先
    );

    // 結果に基づいてリダイレクト
    return redirect(result.nextPath);
  } catch (error) {
    // 予期せぬエラー処理 (handleAuthCallback内でエラーが捕捉されなかった場合など)
    console.error('[AuthCallbackRoute] Unexpected error:', error);
    const errorType =
      error instanceof Error ? error.constructor.name : typeof error;
    const errorMessage = error instanceof Error ? error.message : String(error);

    return redirect(
      `/auth/callback/error?error=${encodeURIComponent('予期せぬエラーが発生しました')}&error_type=${encodeURIComponent(errorType)}&error_message=${encodeURIComponent(errorMessage)}`
    );
  }
}
