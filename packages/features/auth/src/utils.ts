/**
 * auth/utils.ts
 * 認証関連のユーティリティ関数
 */

/**
 * Supabase認証関連のクッキーをクリアする
 *
 * この関数は認証問題（特にcode_verifierの不一致）を解決するために
 * 古いクッキーをクリアします。
 */
export function clearSupabaseAuthCookies(): void {
  if (typeof document === 'undefined') {
    // サーバーサイドでは何もしない
    return;
  }

  // 全てのクッキーを取得
  const cookiesStr = document.cookie;
  if (!cookiesStr) {
    console.log('[AUTH DEBUG] クッキーが見つかりません');
    return;
  }

  const cookies = cookiesStr.split(';');
  let clearedCount = 0;

  // Supabase認証関連のクッキーフィルタリング
  const authCookies = cookies.filter((cookie) => {
    const cookieParts = cookie.split('=');
    if (cookieParts.length < 1) return false;

    const cookieName = cookieParts[0]?.trim();
    return (
      cookieName?.includes('sb-') ||
      cookieName?.includes('supabase') ||
      cookieName?.includes('code-verifier') ||
      cookieName?.includes('oauth-state')
    );
  });

  if (!authCookies || authCookies.length === 0) {
    console.log('[AUTH DEBUG] 削除対象の認証クッキーはありません');
    return;
  }

  // 認証クッキーの詳細ログ
  const cookieNames = authCookies
    .map((c) => {
      const parts = c.split('=');
      return parts.length > 0 ? parts[0]?.trim() : '';
    })
    .filter(Boolean);

  console.log('[AUTH DEBUG] 削除対象の認証クッキー:', cookieNames);

  // 各認証クッキーを削除
  for (const cookie of authCookies) {
    const cookieParts = cookie.split('=');
    if (cookieParts.length < 1) continue;

    const cookieName = cookieParts[0]?.trim();
    if (!cookieName) continue;

    // 主要なドメインで削除
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;

    // サブドメイン全体で共有されている可能性があるため、ドメイン指定で削除
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.saedgewell.test;`;

    // 本番環境用のドメイン指定で削除
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.saedgewell.net;`;

    // ホスト名からドメイン設定を自動判定
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('.')) {
        const parts = hostname.split('.');
        if (parts.length >= 2) {
          const autoDetectedDomain = `.${parts.slice(-2).join('.')}`;
          // 自動検出されたドメインでも削除
          if (
            autoDetectedDomain !== '.saedgewell.test' &&
            autoDetectedDomain !== '.saedgewell.net'
          ) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${autoDetectedDomain};`;
            console.log(
              `[AUTH DEBUG] クッキー ${cookieName} を自動検出されたドメイン ${autoDetectedDomain} で削除しました`
            );
          }
        }
      }
    }

    // localhost用
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost;`;

    clearedCount++;
  }

  console.log(`[AUTH DEBUG] ${clearedCount}個の認証クッキーをクリアしました`);
}
