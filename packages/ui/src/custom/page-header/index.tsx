'use client';

import { cn } from '../../lib/utils';
import { WaveBackground } from '../../magicui/wave-background';
import Link from 'next/link';
import { ChevronRight, HomeIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  waveProps?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  variant?: 'default' | 'gradient' | 'minimal' | 'accent';
  accentColor?: string;
  actions?: React.ReactNode;
  breadcrumbs?: {
    href: string;
    label: string;
  }[];
  pattern?: 'waves' | 'dots' | 'grid' | 'none';
}

const variants = {
  default: 'from-background/50 to-background/80',
  gradient: 'from-primary/10 via-background/50 to-background/80',
  minimal: 'from-background/30 to-background/50',
  accent: 'from-accent/10 via-background/50 to-background/80',
};

const patterns = {
  dots: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px) 0 0/20px 20px',
  grid: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px) 0 0/20px 20px',
};

/**
 * 拡張されたページヘッダーコンポーネント
 * - カード形式のモダンなデザイン
 * - アニメーションする波の背景
 * - グラスモーフィズム効果
 * - レスポンシブ対応
 * - カスタムアクション
 * - パンくずリスト
 * - テーマバリエーション
 */
export function PageHeader({
  title,
  description,
  className,
  waveProps,
  variant = 'default',
  accentColor,
  actions,
  breadcrumbs,
  pattern = 'waves',
}: PageHeaderProps) {
  // 背景のグラデーションスタイル
  const gradientStyle = accentColor
    ? `from-[${accentColor}/10] via-background/50 to-background/80`
    : variants[variant];

  // パターンの背景スタイル
  const patternStyle =
    pattern === 'none'
      ? {}
      : pattern === 'waves'
        ? {}
        : { backgroundImage: patterns[pattern as keyof typeof patterns] };

  return (
    <div
      className={cn(
        'group relative w-full overflow-hidden rounded-xl p-4 border shadow-2xs transition-all hover:shadow-md',
        `bg-linear-to-b ${gradientStyle}`,
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-linear-to-r before:from-transparent before:via-white/10 before:to-transparent',
        className
      )}
    >
      <div className="container">
        {/* パンくずリスト */}
        {breadcrumbs && (
          <nav className="relative z-20 flex items-center space-x-2 pt-4 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground">
              <HomeIcon className="h-4 w-4" />
            </a>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center space-x-2">
                <ChevronRight className="h-4 w-4" />
                <a
                  href={crumb.href}
                  className={cn(
                    'hover:text-foreground',
                    index === breadcrumbs.length - 1 && 'text-foreground'
                  )}
                >
                  {crumb.label}
                </a>
              </div>
            ))}
          </nav>
        )}

        {/* カードの内側の影効果 */}
        <div
          className="absolute inset-[1px] rounded-xl bg-linear-to-b from-white/10 to-white/5"
          style={patternStyle}
        />

        {/* 波のアニメーション背景 */}
        {pattern === 'waves' && (
          <WaveBackground
            className="absolute inset-0 z-0 h-[140px]"
            primaryColor={waveProps?.primaryColor ?? 'rgba(56, 189, 248, 0.15)'}
            secondaryColor={
              waveProps?.secondaryColor ?? 'rgba(186, 230, 253, 0.08)'
            }
          />
        )}

        {/* ヘッダーコンテンツ */}
        <div className="relative z-10 flex items-end justify-between pb-8 pt-[140px]">
          <div className="space-y-2.5">
            <h1 className="bg-linear-to-br from-foreground to-foreground/80 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition-colors group-hover:from-foreground/90 group-hover:to-foreground/70">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground/90 transition-colors group-hover:text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-4">{actions}</div>
          )}
        </div>

        {/* カードのエッジ効果 */}
        <div className="absolute inset-0 rounded-xl border border-white/20" />
      </div>
    </div>
  );
}
