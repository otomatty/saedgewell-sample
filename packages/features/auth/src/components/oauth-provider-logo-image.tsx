import Image from 'next/image';

import { AtSign, Phone } from 'lucide-react';

const DEFAULT_IMAGE_SIZE = 18;

/**
 * @name OauthProviderLogoImage
 * @description
 * 認証プロバイダー（Google、GitHub、Facebookなど）のロゴ画像を表示するコンポーネント。
 * プロバイダーIDに基づいて適切なロゴを表示する。
 *
 * @features
 * - 各種OAuthプロバイダーのロゴ表示
 * - カスタムサイズ設定
 * - 画像最適化（Next.js Image使用）
 * - フォールバックアイコン（パスワード、電話番号用）
 *
 * @dependencies
 * - next/image: Next.jsの最適化画像コンポーネント
 * - lucide-react: アイコンライブラリ
 *
 * @param {Object} props
 * @param {string} props.providerId - 認証プロバイダーのID（例: 'google', 'github'）
 * @param {number} [props.width] - ロゴの幅（ピクセル）
 * @param {number} [props.height] - ロゴの高さ（ピクセル）
 *
 * @example
 * ```tsx
 * <OauthProviderLogoImage
 *   providerId="google"
 *   width={24}
 *   height={24}
 * />
 * ```
 */
export function OauthProviderLogoImage({
  providerId,
  width,
  height,
}: {
  providerId: string;
  width?: number;
  height?: number;
}) {
  const image = getOAuthProviderLogos()[providerId];

  if (typeof image === 'string') {
    return (
      <Image
        decoding={'async'}
        loading={'lazy'}
        src={image}
        alt={`${providerId} logo`}
        width={width ?? DEFAULT_IMAGE_SIZE}
        height={height ?? DEFAULT_IMAGE_SIZE}
      />
    );
  }

  return <>{image}</>;
}

function getOAuthProviderLogos(): Record<string, string | React.ReactNode> {
  return {
    password: <AtSign className={'s-[18px]'} />,
    phone: <Phone className={'s-[18px]'} />,
    google: '/images/oauth/google.webp',
    facebook: '/images/oauth/facebook.webp',
    twitter: '/images/oauth/twitter.webp',
    github: '/images/oauth/github.webp',
    microsoft: '/images/oauth/microsoft.webp',
    apple: '/images/oauth/apple.webp',
  };
}
