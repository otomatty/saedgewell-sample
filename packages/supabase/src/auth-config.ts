import type { CookieOptions } from '@supabase/ssr';

// 共有認証用設定
export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  domain: process.env.COOKIE_DOMAIN || '.saedgewell.test',
  path: '/',
  sameSite: 'none' as const,
  secure: true, // 常にHTTPSを使用するため、trueに固定
  maxAge: 60 * 60 * 24 * 7, // 7日間
};

// 認証関連の定数
export const AUTH_CONSTANTS = {
  // リフレッシュ間隔 (ms)
  REFRESH_INTERVAL: 1000 * 60 * 30, // 30分

  // セッション有効期限切れ前の更新タイミング (ms)
  REFRESH_MARGIN: 1000 * 60 * 10, // 有効期限の10分前

  // 同時セッション最大数
  MAX_SESSIONS: 5,

  // サポートするリダイレクトURLs（HTTPSに統一）
  ALLOWED_REDIRECT_URLS: [
    // 開発環境
    'http://saedgewell.test',
    'http://docs.saedgewell.test',
    'http://admin.saedgewell.test',
    'https://saedgewell.test',
    'https://docs.saedgewell.test',
    'https://admin.saedgewell.test',
    // 本番環境
    'https://saedgewell.net',
    'https://docs.saedgewell.net',
    'https://admin.saedgewell.net',
  ],
};

// 認証状態確認APIエンドポイント
export const AUTH_ENDPOINTS = {
  SESSION: '/api/auth/session',
  CALLBACK: '/auth/callback',
  LOGOUT: '/api/auth/logout',
};
