import { Button } from '@kit/ui/button';

import { OauthProviderLogoImage } from './oauth-provider-logo-image';

/**
 * @name AuthProviderButton
 * @description
 * 認証プロバイダー（Google、GitHub、Facebookなど）のボタンコンポーネント。
 * OAuthプロバイダーのロゴとテキストを表示し、クリック時に認証フローを開始する。
 *
 * @features
 * - プロバイダーロゴの表示
 * - カスタムテキスト表示
 * - クリックイベントハンドリング
 * - データ属性によるテスト対応
 *
 * @dependencies
 * - @kit/ui/button: ボタンコンポーネント
 * - ./oauth-provider-logo-image: OAuthプロバイダーロゴコンポーネント
 *
 * @param {React.PropsWithChildren<{providerId: string, onClick: () => void}>} props
 * @param {string} props.providerId - 認証プロバイダーのID（例: 'google', 'github'）
 * @param {Function} props.onClick - ボタンクリック時のコールバック関数
 * @param {React.ReactNode} props.children - ボタン内に表示するテキスト
 *
 * @example
 * ```tsx
 * <AuthProviderButton
 *   providerId="google"
 *   onClick={() => signInWithGoogle()}
 * >
 *   Googleでログイン
 * </AuthProviderButton>
 * ```
 */
export function AuthProviderButton({
  providerId,
  onClick,
  children,
}: React.PropsWithChildren<{
  providerId: string;
  onClick: () => void;
}>) {
  return (
    <Button
      className={'flex w-full space-x-2 text-center'}
      data-provider={providerId}
      data-test={'auth-provider-button'}
      variant={'outline'}
      onClick={onClick}
    >
      <OauthProviderLogoImage providerId={providerId} />

      <span>{children}</span>
    </Button>
  );
}
