import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Separator } from './index';
import { Label } from '../label';
import { Button } from '../button';
import { Input } from '../input';
/**
 * `Separator`コンポーネントは、コンテンツを視覚的に分離するための水平または垂直の区切り線を提供します。
 *
 * ## 特徴
 * - 水平方向と垂直方向の両方をサポート
 * - 装飾的または意味的な区切り線として使用可能
 * - カスタマイズ可能なスタイル
 * - アクセシビリティ対応
 *
 * ## 使用例
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - 装飾的な区切り線として使用する場合は `decorative` プロパティを `true` に設定
 */
const meta = {
  title: 'Shadcn/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Separatorコンポーネントは、コンテンツを視覚的に分離するための水平または垂直の区切り線を提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
      description: '区切り線の向き（水平または垂直）',
    },
    decorative: {
      control: 'boolean',
      description: '装飾的な区切り線かどうか（スクリーンリーダーで無視される）',
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
} as Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なSeparatorの例です。
 */
export const Basic: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="text-sm text-muted-foreground">
        区切り線の上にあるコンテンツ
      </div>
      <Separator />
      <div className="text-sm text-muted-foreground">
        区切り線の下にあるコンテンツ
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '基本的なSeparatorの例です。水平方向の区切り線を表示します。',
      },
    },
  },
};

/**
 * 水平方向と垂直方向のSeparatorの例です。
 */
export const Orientations: Story = {
  render: () => (
    <div className="flex flex-col space-y-8">
      <div className="w-[300px] space-y-4">
        <h4 className="text-sm font-medium">水平方向（デフォルト）</h4>
        <div className="text-sm text-muted-foreground">
          区切り線の上にあるコンテンツ
        </div>
        <Separator orientation="horizontal" />
        <div className="text-sm text-muted-foreground">
          区切り線の下にあるコンテンツ
        </div>
      </div>

      <div className="h-[200px] w-[300px]">
        <h4 className="text-sm font-medium">垂直方向</h4>
        <div className="flex h-5 items-center space-x-4 text-sm">
          <div>区切り線の左側</div>
          <Separator orientation="vertical" />
          <div>区切り線の右側</div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '水平方向と垂直方向のSeparatorの例です。orientation プロパティを使用して方向を指定できます。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したSeparatorの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-col space-y-8">
      <div className="w-[300px] space-y-4">
        <h4 className="text-sm font-medium">カスタム色</h4>
        <div className="text-sm text-muted-foreground">
          区切り線の上にあるコンテンツ
        </div>
        <Separator className="bg-blue-500" />
        <div className="text-sm text-muted-foreground">
          区切り線の下にあるコンテンツ
        </div>
      </div>

      <div className="w-[300px] space-y-4">
        <h4 className="text-sm font-medium">カスタム太さ</h4>
        <div className="text-sm text-muted-foreground">
          区切り線の上にあるコンテンツ
        </div>
        <Separator className="h-[2px] bg-red-500" />
        <div className="text-sm text-muted-foreground">
          区切り線の下にあるコンテンツ
        </div>
      </div>

      <div className="w-[300px] space-y-4">
        <h4 className="text-sm font-medium">点線スタイル</h4>
        <div className="text-sm text-muted-foreground">
          区切り線の上にあるコンテンツ
        </div>
        <Separator className="border-t border-dashed border-gray-300 bg-transparent" />
        <div className="text-sm text-muted-foreground">
          区切り線の下にあるコンテンツ
        </div>
      </div>

      <div className="h-[200px] w-[300px]">
        <h4 className="text-sm font-medium">カスタム垂直区切り線</h4>
        <div className="flex h-5 items-center space-x-4 text-sm">
          <div>区切り線の左側</div>
          <Separator
            orientation="vertical"
            className="h-full w-[2px] bg-green-500"
          />
          <div>区切り線の右側</div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したSeparatorの例です。className プロパティを使用して色や太さなどをカスタマイズできます。',
      },
    },
  },
};

/**
 * 実際のユースケースでのSeparatorの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="flex flex-col space-y-8">
      {/* メニューの例 */}
      <div className="w-[300px] rounded-md border p-4">
        <h3 className="text-lg font-medium">メニュー</h3>
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <span className="text-sm">ホーム</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm">プロフィール</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm">設定</span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-sm">ヘルプ</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm">ログアウト</span>
          </div>
        </div>
      </div>

      {/* カードの例 */}
      <div className="w-[300px] rounded-md border p-4">
        <h3 className="text-lg font-medium">プロフィールカード</h3>
        <div className="mt-2 flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div>
            <div className="text-sm font-medium">山田 太郎</div>
            <div className="text-xs text-muted-foreground">
              yamada.taro@example.com
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">役職</span>
            <span className="text-sm">マーケティングマネージャー</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">部署</span>
            <span className="text-sm">マーケティング部</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">勤務地</span>
            <span className="text-sm">東京オフィス</span>
          </div>
        </div>
      </div>

      {/* フォームの例 */}
      <div className="w-[300px] rounded-md border p-4">
        <h3 className="text-lg font-medium">フォーム</h3>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">名前</Label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="名前を入力"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">メールアドレス</Label>
            <Input
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="メールアドレスを入力"
            />
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-end">
          <Button variant="default" className="rounded-md px-4 py-2 text-sm">
            送信
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのSeparatorの例です。メニュー、カード、フォームなどでの使用例を示しています。',
      },
    },
  },
};
