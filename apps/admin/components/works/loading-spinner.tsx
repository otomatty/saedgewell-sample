/**
 * @file ローディング状態を示すスケルトンコンポーネント。
 * @description データ取得中などの非同期処理中にプレースホルダーとして表示します。
 * shadcn/ui/skeleton を利用します。
 */

import React from 'react';
import { Skeleton } from '@kit/ui/skeleton';
import { cn } from '@kit/ui/utils'; // className結合用

/**
 * LoadingSpinner (Skeleton) コンポーネントの Props
 */
interface LoadingSpinnerProps {
  /** オプション: スケルトンの行数 (デフォルト: 3) */
  lines?: number;
  /** オプション: 各行の高さ (デフォルト: h-4) */
  lineHeight?: string;
  /** オプション: 行間のスペース (デフォルト: space-y-2) */
  lineSpacing?: string;
  /** オプション: 追加のCSSクラス */
  className?: string;
}

/**
 * ローディング状態を示すスケルトンコンポーネント。
 * shadcn/ui の Skeleton を使用して複数の行を表示します。
 */
const LoadingSpinner = ({
  lines = 3,
  lineHeight = 'h-4',
  lineSpacing = 'space-y-2',
  className,
}: LoadingSpinnerProps) => {
  return (
    <div className={cn('p-4', lineSpacing, className)}>
      {Array.from({ length: lines }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <Skeleton key={`line-${index}`} className={`w-full ${lineHeight}`} />
      ))}
    </div>
  );
};

export default LoadingSpinner;
