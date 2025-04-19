import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Slider } from './index';

/**
 * `Slider`コンポーネントは、数値の範囲を選択するためのスライダーを提供します。
 *
 * ## 特徴
 * - 単一値または範囲値の選択が可能
 * - カスタマイズ可能なスタイル
 * - キーボード操作対応
 * - アクセシビリティ対応
 *
 * ## 使用例
 * ```tsx
 * <Slider defaultValue={[50]} max={100} step={1} />
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボード操作対応
 * - スクリーンリーダーで適切に読み上げられる
 */
const meta = {
  title: 'Shadcn/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Sliderコンポーネントは、数値の範囲を選択するためのスライダーを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'object',
      description: 'スライダーの初期値',
    },
    max: {
      control: 'number',
      description: 'スライダーの最大値',
    },
    min: {
      control: 'number',
      description: 'スライダーの最小値',
    },
    step: {
      control: 'number',
      description: 'スライダーのステップ値',
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
} as Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なSliderの例です。
 */
export const Basic: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <Slider defaultValue={[50]} max={100} step={1} />
      <div className="text-sm text-muted-foreground">
        基本的なスライダーの例です。0から100までの値を選択できます。
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '基本的なSliderの例です。単一の値を選択できます。',
      },
    },
  },
};

/**
 * 範囲選択のSliderの例です。
 */
export const Range: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <Slider defaultValue={[25, 75]} max={100} step={1} />
      <div className="text-sm text-muted-foreground">
        範囲を選択できるスライダーの例です。最小値と最大値を設定できます。
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '範囲を選択できるSliderの例です。最小値と最大値を設定できます。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したSliderの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="w-[300px] space-y-8">
      <div className="space-y-4">
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          className="[&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-500"
        />
        <div className="text-sm text-muted-foreground">
          青色のスライダーの例です。className
          プロパティを使用して色をカスタマイズしています。
        </div>
      </div>

      <div className="space-y-4">
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          className="[&_[role=slider]]:bg-green-500 [&_[role=slider]]:border-green-500"
        />
        <div className="text-sm text-muted-foreground">
          緑色のスライダーの例です。className
          プロパティを使用して色をカスタマイズしています。
        </div>
      </div>

      <div className="space-y-4">
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6"
        />
        <div className="text-sm text-muted-foreground">
          大きめのスライダーの例です。className
          プロパティを使用してサイズをカスタマイズしています。
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したSliderの例です。className プロパティを使用して色やサイズをカスタマイズできます。',
      },
    },
  },
};

/**
 * 実際のユースケースでのSliderの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="w-[400px] space-y-8">
      {/* 音量調整の例 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">音量</h4>
          <span className="text-sm text-muted-foreground">50%</span>
        </div>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>

      {/* 明るさ調整の例 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">明るさ</h4>
          <span className="text-sm text-muted-foreground">75%</span>
        </div>
        <Slider defaultValue={[75]} max={100} step={1} />
      </div>

      {/* 価格範囲選択の例 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">価格範囲</h4>
          <span className="text-sm text-muted-foreground">
            ¥1,000 - ¥10,000
          </span>
        </div>
        <Slider defaultValue={[1000, 10000]} max={10000} min={0} step={100} />
      </div>

      {/* 年齢範囲選択の例 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">年齢範囲</h4>
          <span className="text-sm text-muted-foreground">18歳 - 65歳</span>
        </div>
        <Slider defaultValue={[18, 65]} max={100} min={0} step={1} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのSliderの例です。音量調整、明るさ調整、価格範囲選択、年齢範囲選択などの例を示しています。',
      },
    },
  },
};
