import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { NumberTicker } from './index';

/**
 * `NumberTicker`コンポーネントは、数値のアニメーション表示を提供します。
 *
 * ## 特徴
 * - スムーズなアニメーション効果
 * - 上昇または下降方向の設定
 * - 遅延開始のサポート
 * - 小数点以下の桁数設定
 * - カスタマイズ可能なスタイル
 *
 * ## 使用例
 * ```tsx
 * <NumberTicker value={1000} />
 * ```
 *
 * ## アクセシビリティ
 * - スクリーンリーダー対応
 */
const meta = {
  title: 'Shadcn/NumberTicker',
  component: NumberTicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'NumberTickerコンポーネントは、数値のアニメーション表示を提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: '表示する数値',
    },
    direction: {
      control: 'radio',
      options: ['up', 'down'],
      description: 'アニメーションの方向（上昇または下降）',
    },
    delay: {
      control: 'number',
      description: 'アニメーション開始の遅延（秒）',
    },
    decimalPlaces: {
      control: 'number',
      description: '表示する小数点以下の桁数',
    },
    className: {
      control: 'text',
      description: '追加のクラス名',
    },
  },
} as Meta<typeof NumberTicker>;

export default meta;
type Story = StoryObj<typeof NumberTicker>;

/**
 * 基本的なNumberTickerの例です。
 */
export const Basic: Story = {
  args: {
    value: 1000,
  },
  parameters: {
    docs: {
      description: {
        story:
          '基本的なNumberTickerの例です。0から1000までカウントアップします。',
      },
    },
  },
};

/**
 * 下降方向のNumberTickerの例です。
 */
export const CountDown: Story = {
  args: {
    value: 1000,
    direction: 'down',
  },
  parameters: {
    docs: {
      description: {
        story:
          '下降方向のNumberTickerの例です。1000から0までカウントダウンします。',
      },
    },
  },
};

/**
 * 遅延付きのNumberTickerの例です。
 */
export const WithDelay: Story = {
  args: {
    value: 500,
    delay: 1,
  },
  parameters: {
    docs: {
      description: {
        story:
          '遅延付きのNumberTickerの例です。1秒後にアニメーションが開始されます。',
      },
    },
  },
};

/**
 * 小数点以下の桁数を指定したNumberTickerの例です。
 */
export const WithDecimalPlaces: Story = {
  args: {
    value: 123.456,
    decimalPlaces: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          '小数点以下の桁数を指定したNumberTickerの例です。小数点以下2桁まで表示されます。',
      },
    },
  },
};

/**
 * 大きな数値のNumberTickerの例です。
 */
export const LargeNumber: Story = {
  args: {
    value: 1000000,
  },
  parameters: {
    docs: {
      description: {
        story: '大きな数値のNumberTickerの例です。桁区切りが適用されます。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したNumberTickerの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">基本</h3>
        <NumberTicker value={1234} className="text-2xl font-bold" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">青色</h3>
        <NumberTicker
          value={5678}
          className="text-2xl font-bold text-blue-500"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">緑色（下降）</h3>
        <NumberTicker
          value={9876}
          direction="down"
          className="text-2xl font-bold text-green-500"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">赤色（小数点あり）</h3>
        <NumberTicker
          value={543.21}
          decimalPlaces={2}
          className="text-2xl font-bold text-red-500"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したNumberTickerの例です。サイズや色をカスタマイズしています。',
      },
    },
  },
};

/**
 * 複数のNumberTickerを組み合わせた例です。
 */
export const MultipleTickersGroup: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">ユーザー数</h3>
          <NumberTicker value={12345} className="text-2xl font-bold" />
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">売上高</h3>
          <div className="flex items-center justify-center">
            <span className="mr-1">¥</span>
            <NumberTicker value={9876543} className="text-2xl font-bold" />
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-sm font-medium mb-2">成長率</h3>
          <div className="flex items-center justify-center">
            <NumberTicker
              value={24.5}
              decimalPlaces={1}
              className="text-2xl font-bold text-green-500"
            />
            <span className="ml-1">%</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '複数のNumberTickerを組み合わせた例です。ダッシュボードなどでの使用例を示しています。',
      },
    },
  },
};

/**
 * 実際のユースケースでのNumberTickerの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="space-y-8 max-w-md">
      <div className="rounded-lg border p-6 shadow-2xs">
        <h3 className="text-lg font-medium mb-4">会社の成長指標</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">総ユーザー数</span>
            <NumberTicker value={87654} className="text-xl font-bold" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">月間アクティブユーザー</span>
            <NumberTicker value={32456} className="text-xl font-bold" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">年間売上高（百万円）</span>
            <NumberTicker
              value={456.78}
              decimalPlaces={2}
              className="text-xl font-bold"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">顧客満足度</span>
            <div className="flex items-center">
              <NumberTicker
                value={4.8}
                decimalPlaces={1}
                className="text-xl font-bold text-blue-500"
              />
              <span className="ml-1 text-gray-500">/5.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-6 shadow-2xs bg-blue-50">
        <h3 className="text-lg font-medium mb-2">カウントダウンタイマー</h3>
        <p className="text-gray-500 mb-4">キャンペーン終了まで</p>
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <NumberTicker
              value={24}
              direction="down"
              className="text-3xl font-bold"
            />
            <p className="text-sm text-gray-500">時間</p>
          </div>
          <div className="text-center">
            <NumberTicker
              value={59}
              direction="down"
              className="text-3xl font-bold"
            />
            <p className="text-sm text-gray-500">分</p>
          </div>
          <div className="text-center">
            <NumberTicker
              value={59}
              direction="down"
              className="text-3xl font-bold"
            />
            <p className="text-sm text-gray-500">秒</p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのNumberTickerの例です。会社の成長指標やカウントダウンタイマーなどに適しています。',
      },
    },
  },
};
