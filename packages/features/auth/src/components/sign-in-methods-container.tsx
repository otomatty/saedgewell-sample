'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import type { Provider } from '@supabase/supabase-js';

import { isBrowser } from '@kit/shared/utils';
import { If } from '@kit/ui/if';
import { Separator } from '@kit/ui/separator';

import { MagicLinkAuthContainer } from './magic-link-auth-container';
import { OauthProviders } from './oauth-providers';
import { PasswordSignInContainer } from './password-sign-in-container';

/**
 * @name SignInMethodsContainer
 * @description
 * サインイン方法を集約して表示するコンテナコンポーネント。
 * パスワード認証、マジックリンク認証、OAuthプロバイダー認証など、
 * 複数の認証方法を設定に基づいて表示する。
 *
 * @features
 * - 複数の認証方法を一箇所に集約
 * - 設定に基づいた認証方法の表示/非表示
 * - 認証後のリダイレクト処理、またはコールバック呼び出し
 *
 * @dependencies
 * - next/navigation: Next.jsのルーティング機能
 * - @kit/shared/utils: ユーティリティ関数
 *
 * @childComponents
 * - PasswordSignInContainer: パスワード認証コンポーネント
 * - MagicLinkAuthContainer: マジックリンク認証コンポーネント
 * - OauthProviders: OAuth認証コンポーネント
 *
 * @param {Object} props
 * @param {Object} props.paths - パス設定
 * @param {string} props.paths.callback - 認証コールバックパス
 * @param {string} props.paths.home - デフォルトのリダイレクト先ホームページパス
 * @param {Object} props.providers - 有効化する認証プロバイダー設定
 * @param {boolean} props.providers.password - パスワード認証を有効にするか
 * @param {boolean} props.providers.magicLink - マジックリンク認証を有効にするか
 * @param {Provider[]} props.providers.oAuth - 有効化するOAuthプロバイダーの配列
 * @param {() => void} [props.onSignInSuccess] - (任意) パスワード認証成功時に呼び出されるコールバック関数。指定された場合、リダイレクトは行われない。
 *
 * @example
 * ```tsx
 * <SignInMethodsContainer
 *   paths={{
 *     callback: '/auth/callback',
 *     home: '/dashboard',
 *   }}
 *   providers={{
 *     password: true,
 *     magicLink: true,
 *     oAuth: ['google', 'github'],
 *   }}
 *   onSignInSuccess={() => console.log('Signed in!')}
 * />
 * ```
 */
export function SignInMethodsContainer(props: {
  paths: {
    callback: string;
    home: string;
  };

  providers: {
    password: boolean;
    magicLink: boolean;
    oAuth: Provider[];
  };

  // パスワード認証成功時のコールバック関数（任意）
  onSignInSuccess?: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // デフォルトのリダイレクト先パスを取得。クエリパラメータ next があればそれを優先。
  const nextPath = searchParams.get('next') ?? props.paths.home;

  // OAuth/Magic Link用のリダイレクトURLを生成
  const redirectUrl = isBrowser()
    ? new URL(props.paths.callback, window.location.origin).toString()
    : '';

  /**
   * @name handlePasswordSignIn
   * @description パスワード認証コンポーネントからの成功コールバックハンドラ
   */
  const handlePasswordSignIn = () => {
    if (props.onSignInSuccess) {
      // onSignInSuccess コールバックが提供されていれば、それを呼び出す
      props.onSignInSuccess();
    } else {
      // コールバックがなければ、デフォルトのリダイレクト処理を実行
      console.log(
        `No onSignInSuccess callback provided, redirecting to: ${nextPath}`
      );
      router.replace(nextPath);
    }
  };

  return (
    <>
      <If condition={props.providers.password}>
        {/* パスワード認証コンポーネントにハンドラを渡す */}
        <PasswordSignInContainer onSignIn={handlePasswordSignIn} />
      </If>

      <If condition={props.providers.magicLink}>
        <MagicLinkAuthContainer
          redirectUrl={redirectUrl}
          shouldCreateUser={false}
        />
      </If>

      <If condition={props.providers.oAuth.length}>
        <Separator />

        <OauthProviders
          enabledProviders={props.providers.oAuth}
          shouldCreateUser={false}
          paths={{
            callback: props.paths.callback,
            // OAuth認証後の最終的なリダイレクト先。現状は home 固定。
            // これもカスタマイズ可能にするかは要検討。
            returnPath: nextPath,
          }}
        />
      </If>
    </>
  );
}
