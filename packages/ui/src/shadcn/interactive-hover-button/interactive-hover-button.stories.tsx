import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { InteractiveHoverButton } from './index';

/**
 * `InteractiveHoverButton`コンポーネントは、ホバー時に視覚的なインタラクションを提供するボタンコンポーネントです。
 *
 * ## 特徴
 * - ホバー時のアニメーション効果
 * - カスタマイズ可能なスタイル
 * - アクセシビリティ対応
 *
 * ## 使用例
 * ```tsx
 * <InteractiveHoverButton>ボタンテキスト</InteractiveHoverButton>
 * ```
 *
 * ## アクセシビリティ
 * - キーボードフォーカス対応
 * - 適切なARIA属性のサポート
 */
const meta = {
  title: 'Shadcn/InteractiveHoverButton',
  component: InteractiveHoverButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'InteractiveHoverButtonコンポーネントは、ホバー時に視覚的なインタラクションを提供するボタンコンポーネントです。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'ボタンのテキスト',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
    className: {
      control: 'text',
      description: '追加のクラス名',
    },
  },
} as Meta<typeof InteractiveHoverButton>;

export default meta;
type Story = StoryObj<typeof InteractiveHoverButton>;

/**
 * 基本的なInteractiveHoverButtonの例です。
 */
export const Basic: Story = {
  args: {
    children: 'ボタンをホバー',
  },
  parameters: {
    docs: {
      description: {
        story:
          '基本的なInteractiveHoverButtonです。ホバーするとアニメーションが発生します。',
      },
    },
  },
};

/**
 * カスタムカラーのInteractiveHoverButtonの例です。
 */
export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InteractiveHoverButton className="border-blue-500 text-blue-500">
        ブルーテーマ
      </InteractiveHoverButton>
      <InteractiveHoverButton className="border-green-500 text-green-500">
        グリーンテーマ
      </InteractiveHoverButton>
      <InteractiveHoverButton className="border-red-500 text-red-500">
        レッドテーマ
      </InteractiveHoverButton>
      <InteractiveHoverButton className="border-purple-500 text-purple-500">
        パープルテーマ
      </InteractiveHoverButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムカラーを適用したInteractiveHoverButtonの例です。border-colorとtext-colorを変更しています。',
      },
    },
  },
};

/**
 * カスタムサイズのInteractiveHoverButtonの例です。
 */
export const CustomSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InteractiveHoverButton className="text-xs py-1 px-4">
        小さいサイズ
      </InteractiveHoverButton>
      <InteractiveHoverButton>デフォルトサイズ</InteractiveHoverButton>
      <InteractiveHoverButton className="text-lg py-3 px-8">
        大きいサイズ
      </InteractiveHoverButton>
      <InteractiveHoverButton className="text-xl py-4 px-10">
        特大サイズ
      </InteractiveHoverButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '異なるサイズのInteractiveHoverButtonの例です。text-sizeとpaddingを調整しています。',
      },
    },
  },
};

/**
 * 無効状態のInteractiveHoverButtonの例です。
 */
export const Disabled: Story = {
  args: {
    children: '無効状態のボタン',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '無効状態のInteractiveHoverButtonです。クリックやホバーの効果が無効化されています。',
      },
    },
  },
};

/**
 * カスタムアイコンを含むInteractiveHoverButtonの例です。
 */
export const WithCustomContent: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InteractiveHoverButton>始めましょう</InteractiveHoverButton>
      <InteractiveHoverButton className="border-blue-500 text-blue-500">
        詳細を見る
      </InteractiveHoverButton>
      <InteractiveHoverButton className="border-green-500 text-green-500">
        登録する
      </InteractiveHoverButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '様々なテキストコンテンツを持つInteractiveHoverButtonの例です。',
      },
    },
  },
};

/**
 * 実際のユースケースでのInteractiveHoverButtonの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="space-y-8 w-full max-w-md">
      <div className="rounded-lg border p-6 shadow-2xs">
        <h3 className="text-lg font-medium mb-2">プレミアムプラン</h3>
        <p className="text-gray-500 mb-4">すべての機能にアクセスできます</p>
        <InteractiveHoverButton className="w-full">
          アップグレード
        </InteractiveHoverButton>
      </div>

      <div className="rounded-lg border p-6 shadow-2xs">
        <h3 className="text-lg font-medium mb-2">無料トライアル</h3>
        <p className="text-gray-500 mb-4">14日間無料でお試しいただけます</p>
        <InteractiveHoverButton className="w-full border-blue-500 text-blue-500">
          今すぐ試す
        </InteractiveHoverButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのInteractiveHoverButtonの使用例です。料金プランのカードなどに適しています。',
      },
    },
  },
};
