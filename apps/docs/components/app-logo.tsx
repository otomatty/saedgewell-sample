'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@kit/ui/utils';

type LogoProps = {
  width?: number;
  height?: number;
  dropShadow?: boolean;
  href?: string;
  className?: string;
  imageSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const logoSizes = {
  xs: { width: 24, height: 24 },
  sm: { width: 36, height: 36 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
  xl: { width: 96, height: 96 },
};

/**
 * アプリケーションロゴコンポーネント
 *
 * 様々なサイズのロゴを表示するためのコンポーネント
 * サイズのプリセットとカスタムサイズをサポート
 */
export function AppLogo({
  width,
  height,
  dropShadow = false,
  href = '/',
  className,
  imageSize = 'md',
}: LogoProps) {
  const { width: defaultWidth, height: defaultHeight } = logoSizes[imageSize];

  // カスタムサイズかプリセットサイズを使用
  const logoWidth = width ?? defaultWidth;
  const logoHeight = height ?? defaultHeight;

  const darkLogoUrl = '/images/logo-dark.svg';
  const lightLogoUrl = '/images/logo-light.svg';

  // さまざまな画面サイズに対応するサイズ文字列
  const sizes = `(max-width: 640px) ${logoWidth * 0.75}px, ${logoWidth}px`;

  const Logo = (
    <div
      className={cn('relative', dropShadow && 'drop-shadow-md', className)}
      style={{ width: logoWidth, height: logoHeight }}
    >
      {/* ライトモード用のロゴ */}
      <Image
        src={lightLogoUrl}
        className="dark:hidden"
        alt="Docs Logo"
        fill
        sizes={sizes}
        priority
      />

      {/* ダークモード用のロゴ */}
      <Image
        src={darkLogoUrl}
        className="hidden dark:block"
        alt="Docs Logo"
        fill
        sizes={sizes}
        priority
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <span className="sr-only">Docs Home</span>
        {Logo}
      </Link>
    );
  }

  return Logo;
}
