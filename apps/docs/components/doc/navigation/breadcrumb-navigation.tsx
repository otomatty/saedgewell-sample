'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * パンくずナビゲーションのプロパティ
 */
export interface BreadcrumbNavigationProps {
  /**
   * 現在のページのパス（スラグ）
   */
  slug: string[];
  /**
   * カスタムのパンくず項目名（オプション）
   * キーはスラグのインデックス、値は表示名
   */
  customLabels?: Record<number, string>;
  /**
   * ホームページのラベル
   */
  homeLabel?: string;
}

/**
 * パンくずアイテムの型定義
 */
interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

/**
 * パンくずナビゲーションコンポーネント
 * 現在のページの階層構造を表示します
 */
export function BreadcrumbNavigation({
  slug,
  customLabels = {},
  homeLabel = 'ホーム',
}: BreadcrumbNavigationProps) {
  if (!slug || slug.length === 0) return null;

  // スラグからパンくずリストを生成
  const breadcrumbs: BreadcrumbItem[] = [
    { label: homeLabel, href: '/', icon: <Home className="h-3 w-3" /> },
    ...slug.map((segment, index) => {
      // カスタムラベルがあればそれを使用、なければスラグをキャピタライズ
      const label = customLabels[index] || capitalizeFirstLetter(segment);
      // 現在のセグメントまでのパスを構築
      const href = `/${slug.slice(0, index + 1).join('/')}`;
      return { label, href };
    }),
  ];

  return (
    <nav
      aria-label="パンくずリスト"
      className="mb-4 w-full max-w-[1000px] mx-auto"
    >
      <ol className="flex flex-wrap items-center text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-3 w-3 mx-2 text-muted-foreground/50" />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">
                {crumb.icon} {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="flex items-center hover:text-foreground transition-colors"
              >
                {crumb.icon} {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * 文字列の最初の文字を大文字にする
 */
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
