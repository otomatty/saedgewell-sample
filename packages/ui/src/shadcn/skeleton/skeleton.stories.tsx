import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Skeleton } from './index';

/**
 * `Skeleton`コンポーネントは、コンテンツの読み込み中に表示されるローディング状態のプレースホルダーを提供します。
 *
 * ## 特徴
 * - アニメーション付きのローディング表示
 * - カスタマイズ可能なスタイル
 * - 様々な形状とサイズに対応
 * - アクセシビリティ対応
 *
 * ## 使用例
 * ```tsx
 * <Skeleton className="h-4 w-[250px]" />
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - スクリーンリーダーで適切に読み上げられる
 */
const meta = {
  title: 'Shadcn/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Skeletonコンポーネントは、コンテンツの読み込み中に表示されるローディング状態のプレースホルダーを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
} as Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なSkeletonの例です。
 */
export const Basic: Story = {
  render: () => (
    <div className="space-y-4">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[300px]" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '基本的なSkeletonの例です。異なる幅のスケルトンローディングを表示します。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したSkeletonの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4">
      <Skeleton className="h-4 w-[250px] bg-blue-200" />
      <Skeleton className="h-4 w-[200px] bg-green-200" />
      <Skeleton className="h-4 w-[300px] bg-red-200" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したSkeletonの例です。className プロパティを使用して色やサイズをカスタマイズできます。',
      },
    },
  },
};

/**
 * 実際のユースケースでのSkeletonの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="space-y-8">
      {/* カードのスケルトン */}
      <div className="w-[300px] rounded-lg border p-4">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>

      {/* プロフィールのスケルトン */}
      <div className="w-[300px] rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>

      {/* テーブルのスケルトン */}
      <div className="w-[500px] rounded-lg border">
        <div className="border-b p-4">
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="divide-y">
          {[...Array(3)].map((_, i) => (
            <div
              key={`table-row-${i + 1}`}
              className="flex items-center gap-4 p-4"
            >
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのSkeletonの例です。カード、プロフィール、テーブルなどのローディング状態を示しています。',
      },
    },
  },
};
