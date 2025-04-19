import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Switch } from './index';

/**
 * `Switch`コンポーネントは、オン/オフの状態を切り替えるためのトグルスイッチを提供します。
 *
 * ## 特徴
 * - アニメーション付きの切り替え
 * - カスタマイズ可能なスタイル
 * - キーボード操作対応
 * - アクセシビリティ対応
 *
 * ## 使用例
 * ```tsx
 * <Switch />
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボード操作対応
 * - スクリーンリーダーで適切に読み上げられる
 */
const meta = {
  title: 'Shadcn/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Switchコンポーネントは、オン/オフの状態を切り替えるためのトグルスイッチを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultChecked: {
      control: 'boolean',
      description: '初期状態でオンかどうか',
    },
    checked: {
      control: 'boolean',
      description: '制御された状態でのオン/オフ',
    },
    onCheckedChange: {
      description: '状態が変更されたときに呼び出されるコールバック関数',
    },
    disabled: {
      control: 'boolean',
      description: '無効化されているかどうか',
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
} as Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なSwitchの例です。
 */
export const Basic: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <label
        htmlFor="airplane-mode"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        機内モード
      </label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '基本的なSwitchの例です。ラベルと組み合わせて使用します。',
      },
    },
  },
};

/**
 * 無効化されたSwitchの例です。
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="disabled" disabled />
        <label
          htmlFor="disabled"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          無効化されたスイッチ
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-checked" disabled defaultChecked />
        <label
          htmlFor="disabled-checked"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          無効化されたオン状態のスイッチ
        </label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '無効化されたSwitchの例です。オン状態とオフ状態の両方を示しています。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したSwitchの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="blue"
          className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-blue-200"
        />
        <label
          htmlFor="blue"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          青色のスイッチ
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="green"
          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-green-200"
        />
        <label
          htmlFor="green"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          緑色のスイッチ
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="large"
          className="h-6 w-11 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        />
        <label
          htmlFor="large"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          大きめのスイッチ
        </label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したSwitchの例です。className プロパティを使用して色やサイズをカスタマイズできます。',
      },
    },
  },
};

/**
 * 実際のユースケースでのSwitchの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="w-[300px] space-y-6">
      {/* 通知設定の例 */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">通知設定</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              メール通知
            </label>
            <Switch id="email" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="push"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              プッシュ通知
            </label>
            <Switch id="push" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="sms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              SMS通知
            </label>
            <Switch id="sms" />
          </div>
        </div>
      </div>

      {/* アプリケーション設定の例 */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">アプリケーション設定</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="dark-mode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              ダークモード
            </label>
            <Switch id="dark-mode" />
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="auto-play"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              自動再生
            </label>
            <Switch id="auto-play" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="high-quality"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              高品質再生
            </label>
            <Switch id="high-quality" defaultChecked />
          </div>
        </div>
      </div>

      {/* プライバシー設定の例 */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">プライバシー設定</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="profile-public"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              プロフィールを公開
            </label>
            <Switch id="profile-public" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="activity-public"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              アクティビティを公開
            </label>
            <Switch id="activity-public" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="location-sharing"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              位置情報を共有
            </label>
            <Switch id="location-sharing" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのSwitchの例です。通知設定、アプリケーション設定、プライバシー設定などの例を示しています。',
      },
    },
  },
};
