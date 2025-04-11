'use client';

import { useCallback } from 'react';
import Cookies from 'js-cookie';

import type { Provider } from '@supabase/supabase-js';

import { useSignInWithProvider } from '@kit/supabase/hooks/use-sign-in-with-provider';
import { If } from '@kit/ui/if';
import { LoadingOverlay } from '@kit/ui/loading-overlay';

import { AuthErrorAlert } from './auth-error-alert';
import { AuthProviderButton } from './auth-provider-button';
import { clearSupabaseAuthCookies } from '../utils';

// sb-redirect-to クッキー名 (auth-callback.service.ts と合わせる)
const REDIRECT_TO_COOKIE = 'sb-redirect-to';
// クッキーの有効期間（例: 5分）
const COOKIE_MAX_AGE_SECONDS = 60 * 5;

/**
 * @name OAUTH_SCOPES
 * @description
 * OAuth認証で使用するスコープ（権限）を定義するオブジェクト。
 * アプリケーションがユーザーに要求する権限を指定するために使用される。
 *
 * 必要なOAuthプロバイダーとそのスコープをここに追加する。
 *
 * @type {Partial<Record<Provider, string>>}
 * @example
 * ```
 * const OAUTH_SCOPES = {
 *   google: 'email profile',
 *   github: 'user:email',
 * };
 * ```
 *
 * @see https://supabase.com/docs/guides/auth/social-login
 */
const OAUTH_SCOPES: Partial<Record<Provider, string>> = {
  azure: 'email',
  google: 'email profile',
  github: 'user:email',
  // add your OAuth providers here
};

/**
 * @name OauthProviders
 * @description
 * ソーシャルログイン（OAuth認証）のプロバイダーボタンを表示するコンポーネント。
 * 有効化されたプロバイダー（Google、Facebook、Twitterなど）のボタンを表示し、
 * クリック時にSupabaseのOAuth認証フローを開始する。
 *
 * @features
 * - 複数のOAuthプロバイダー対応
 * - ローディング状態の表示
 * - エラー表示
 * - リダイレクトURL設定
 * - 新規ユーザー作成オプション
 *
 * @dependencies
 * - @supabase/supabase-js: Supabase認証ライブラリ
 * - @kit/supabase/hooks/use-sign-in-with-provider: プロバイダーサインインフック
 * - js-cookie: クッキー操作ライブラリ
 *
 * @childComponents
 * - AuthProviderButton: 各プロバイダーのボタンコンポーネント
 * - AuthErrorAlert: エラー表示コンポーネント
 * - LoadingOverlay: ローディングオーバーレイ
 *
 * @param {Object} props
 * @param {boolean} props.shouldCreateUser - 新規ユーザーを作成するかどうか
 * @param {Provider[]} props.enabledProviders - 有効化するプロバイダーの配列
 * @param {Object} props.paths - リダイレクトパス設定
 * @param {string} props.paths.callback - コールバックURL
 * @param {string} props.paths.returnPath - 認証 "開始時" のページのパス (旧: 認証後のリダイレクトパス)
 *
 * @example
 * ```tsx
 * <OauthProviders
 *   enabledProviders={['google', 'github']}
 *   shouldCreateUser={true}
 *   paths={{
 *     callback: '/auth/callback',
 *     returnPath: window.location.pathname + window.location.search, // 現在のパスを渡す
 *   }}
 * />
 * ```
 */
export function OauthProviders(props: {
  shouldCreateUser: boolean;
  enabledProviders: Provider[];

  paths: {
    callback: string;
    returnPath: string; // このパスを sb-redirect-to クッキーに保存する
  };
}) {
  const signInWithProviderMutation = useSignInWithProvider();

  // we make the UI "busy" until the next page is fully loaded
  const loading = signInWithProviderMutation.isPending;

  const onSignInWithProvider = useCallback(
    async (signInRequest: () => Promise<unknown>) => {
      const credential = await signInRequest();

      if (!credential) {
        return Promise.reject(new Error('Failed to sign in with provider'));
      }
    },
    []
  );

  const enabledProviders = props.enabledProviders;

  if (!enabledProviders?.length) {
    return null;
  }

  return (
    <>
      <If condition={loading}>
        <LoadingOverlay />
      </If>

      <div className={'flex w-full flex-1 flex-col space-y-3'}>
        <div className={'flex-col space-y-2'}>
          {enabledProviders.map((provider) => {
            return (
              <AuthProviderButton
                key={provider}
                providerId={provider}
                onClick={() => {
                  console.log('[AUTH DEBUG] Google OAuth onClick triggered!');
                  // 認証前に古い認証クッキーをクリア
                  clearSupabaseAuthCookies();

                  const origin = window.location.origin;
                  // アプリケーションのコールバックURL (クエリパラメータなし)
                  const redirectTo = `${origin}${props.paths.callback}`;

                  // スコープオプションの設定
                  const scopes = OAUTH_SCOPES[provider];
                  const scopesOpts = scopes ? { scopes } : {};

                  // 認証後のリダイレクト先 (現在のパス) をクッキーに保存
                  // 保存する前に、値が有効な文字列であることを確認
                  console.log(
                    '[AUTH DEBUG] Before checking returnPath type:',
                    typeof props.paths.returnPath,
                    'value:',
                    props.paths.returnPath
                  );
                  if (
                    typeof props.paths.returnPath === 'string' &&
                    props.paths.returnPath
                  ) {
                    console.log(
                      `[AUTH DEBUG] Setting ${REDIRECT_TO_COOKIE} cookie. Value:`,
                      props.paths.returnPath,
                      'Type:',
                      typeof props.paths.returnPath
                    );
                    // コメントアウトされたコードを修正して有効化
                    try {
                      // ホスト名からドメイン設定を自動判定
                      let domain: string | undefined = undefined;
                      const hostname = window.location.hostname;

                      if (hostname.includes('saedgewell.test')) {
                        domain = '.saedgewell.test';
                      } else if (hostname.includes('saedgewell.net')) {
                        domain = '.saedgewell.net';
                      }

                      console.log(
                        `[AUTH DEBUG] Setting cookie with domain: ${domain || 'undefined'}`
                      );

                      Cookies.set(REDIRECT_TO_COOKIE, props.paths.returnPath, {
                        path: '/',
                        maxAge: COOKIE_MAX_AGE_SECONDS,
                        sameSite: 'none',
                        secure: true,
                        ...(domain ? { domain } : {}),
                      });
                      console.log(
                        `[AUTH DEBUG] Successfully set ${REDIRECT_TO_COOKIE} cookie.`
                      );
                    } catch (error) {
                      console.error(
                        `[AUTH DEBUG] Failed to set cookie: ${error}`,
                        error
                      );
                    }
                  } else {
                    // returnPath が無効な場合は警告を出し、クッキーは設定しない
                    console.warn(
                      `[AUTH DEBUG] Invalid or missing returnPath ('${props.paths.returnPath}'). Cannot set redirect cookie.`
                    );
                    // フォールバックとしてデフォルトの値をクッキーに設定
                    try {
                      // ホスト名からドメイン設定を自動判定
                      let domain: string | undefined = undefined;
                      const hostname = window.location.hostname;

                      if (hostname.includes('saedgewell.test')) {
                        domain = '.saedgewell.test';
                      } else if (hostname.includes('saedgewell.net')) {
                        domain = '.saedgewell.net';
                      }

                      console.log(
                        `[AUTH DEBUG] Setting fallback cookie with domain: ${domain || 'undefined'}`
                      );

                      Cookies.set(REDIRECT_TO_COOKIE, '/', {
                        path: '/',
                        maxAge: COOKIE_MAX_AGE_SECONDS,
                        sameSite: 'none',
                        secure: true,
                        ...(domain ? { domain } : {}),
                      });
                      console.log(
                        `[AUTH DEBUG] Set default fallback cookie value '/' for ${REDIRECT_TO_COOKIE}`
                      );
                    } catch (fallbackError) {
                      console.error(
                        `[AUTH DEBUG] Failed to set fallback cookie: ${fallbackError}`,
                        fallbackError
                      );
                    }
                  }

                  // デバッグログ
                  console.log('[AUTH DEBUG] OAuth Provider Info:', {
                    provider,
                    redirectTo,
                    origin,
                    shouldCreateUser: props.shouldCreateUser,
                    scopesOpts,
                    callbackUrl: props.paths.callback,
                    returnPathFromProps: props.paths.returnPath,
                    cookieValueToSet: props.paths.returnPath,
                  });

                  const credentials = {
                    provider,
                    options: {
                      shouldCreateUser: props.shouldCreateUser,
                      redirectTo,
                      ...scopesOpts,
                    },
                  };

                  // 認証リクエスト送信
                  return onSignInWithProvider(() => {
                    console.log(
                      '[AUTH DEBUG] Sending Auth Request:',
                      JSON.stringify(credentials, null, 2)
                    );
                    return signInWithProviderMutation.mutateAsync(credentials);
                  });
                }}
              >
                {getProviderName(provider)}でログイン
              </AuthProviderButton>
            );
          })}
        </div>

        <AuthErrorAlert error={signInWithProviderMutation.error} />
      </div>
    </>
  );
}

function getProviderName(providerId: string) {
  const capitalize = (value: string) =>
    value.slice(0, 1).toUpperCase() + value.slice(1);

  if (providerId.endsWith('.com')) {
    const [providerName = providerId] = providerId.split('.com');
    return capitalize(providerName);
  }

  return capitalize(providerId);
}
