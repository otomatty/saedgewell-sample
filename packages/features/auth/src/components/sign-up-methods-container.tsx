'use client';

import type { Provider } from '@supabase/supabase-js';

import { isBrowser } from '@kit/shared/utils';
import { If } from '@kit/ui/if';
import { Separator } from '@kit/ui/separator';

import { MagicLinkAuthContainer } from './magic-link-auth-container';
import { OauthProviders } from './oauth-providers';
import { EmailPasswordSignUpContainer } from './password-sign-up-container';

/**
 * @name SignUpMethodsContainer
 * @description
 * サインアップ方法を集約して表示するコンテナコンポーネント。
 * パスワード登録、マジックリンク登録、OAuthプロバイダー登録など、
 * 複数の登録方法を設定に基づいて表示する。
 *
 * @features
 * - 複数の登録方法を一箇所に集約
 * - 設定に基づいた登録方法の表示/非表示
 * - 利用規約チェックボックスのオプション表示
 * - 招待トークンと関連情報の処理
 *
 * @dependencies
 * - @supabase/supabase-js: Supabase認証ライブラリ
 * - @kit/shared/utils: ユーティリティ関数
 *
 * @childComponents
 * - EmailPasswordSignUpContainer: メール/パスワード登録コンポーネント
 * - MagicLinkAuthContainer: マジックリンク登録コンポーネント
 * - OauthProviders: OAuth登録コンポーネント
 *
 * @param {Object} props
 * @param {Object} props.paths - パス設定
 * @param {string} props.paths.callback - 認証コールバックパス
 * @param {string} props.paths.appHome - アプリケーションホームパス
 * @param {Object} props.providers - 有効化する認証プロバイダー設定
 * @param {boolean} props.providers.password - パスワード登録を有効にするか
 * @param {boolean} props.providers.magicLink - マジックリンク登録を有効にするか
 * @param {Provider[]} props.providers.oAuth - 有効化するOAuthプロバイダーの配列
 * @param {boolean} [props.displayTermsCheckbox] - 利用規約チェックボックスを表示するか
 *
 * @example
 * ```tsx
 * <SignUpMethodsContainer
 *   paths={{
 *     callback: '/auth/callback',
 *     appHome: '/dashboard',
 *   }}
 *   providers={{
 *     password: true,
 *     magicLink: true,
 *     oAuth: ['google', 'github'],
 *   }}
 *   displayTermsCheckbox={true}
 * />
 * ```
 */
export function SignUpMethodsContainer(props: {
  paths: {
    callback: string;
    appHome: string;
  };

  providers: {
    password: boolean;
    magicLink: boolean;
    oAuth: Provider[];
  };

  displayTermsCheckbox?: boolean;
}) {
  const redirectUrl = getCallbackUrl(props);
  const defaultValues = getDefaultValues();

  return (
    <>
      <If condition={props.providers.password}>
        <EmailPasswordSignUpContainer
          emailRedirectTo={redirectUrl}
          defaultValues={defaultValues}
          displayTermsCheckbox={props.displayTermsCheckbox}
        />
      </If>

      <If condition={props.providers.magicLink}>
        <MagicLinkAuthContainer
          redirectUrl={redirectUrl}
          shouldCreateUser={true}
          defaultValues={defaultValues}
          displayTermsCheckbox={props.displayTermsCheckbox}
        />
      </If>

      <If condition={props.providers.oAuth.length}>
        <Separator />

        <OauthProviders
          enabledProviders={props.providers.oAuth}
          shouldCreateUser={true}
          paths={{
            callback: props.paths.callback,
            returnPath: props.paths.appHome,
          }}
        />
      </If>
    </>
  );
}

function getCallbackUrl(props: {
  paths: {
    callback: string;
    appHome: string;
  };

  inviteToken?: string;
}) {
  if (!isBrowser()) {
    return '';
  }

  const redirectPath = props.paths.callback;
  const origin = window.location.origin;
  const url = new URL(redirectPath, origin);

  if (props.inviteToken) {
    url.searchParams.set('invite_token', props.inviteToken);
  }

  const searchParams = new URLSearchParams(window.location.search);
  const next = searchParams.get('next');

  if (next) {
    url.searchParams.set('next', next);
  }

  return url.href;
}

function getDefaultValues() {
  if (!isBrowser()) {
    return { email: '' };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const inviteToken = searchParams.get('invite_token');

  if (!inviteToken) {
    return { email: '' };
  }

  return {
    email: searchParams.get('email') ?? '',
  };
}
