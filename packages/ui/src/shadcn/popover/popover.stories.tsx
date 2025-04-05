import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  Settings,
  User,
  CreditCard,
  LogOut,
  PlusCircle,
  Check,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './index';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';
import { Switch } from '../switch';

/**
 * `Popover`コンポーネントは、トリガー要素をクリックすると表示されるポップアップコンテンツを提供します。
 *
 * ## 特徴
 * - アクセシビリティ対応
 * - 様々な配置オプション
 * - カスタマイズ可能なトリガーとコンテンツ
 * - アニメーション効果
 *
 * ## 使用例
 * ```tsx
 * <Popover>
 *   <PopoverTrigger>クリック</PopoverTrigger>
 *   <PopoverContent>ポップオーバーの内容</PopoverContent>
 * </Popover>
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボードナビゲーション対応
 * - スクリーンリーダー対応
 */
const meta = {
  title: 'Shadcn/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Popoverコンポーネントは、トリガー要素をクリックすると表示されるポップアップコンテンツを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Popoverの子要素',
    },
  },
} as Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なPopoverの例です。
 */
export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">クリックして開く</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">ポップオーバーの内容</h4>
            <p className="text-sm text-muted-foreground">
              ここにポップオーバーの内容を表示します。
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '基本的なPopoverの例です。ボタンをクリックするとポップオーバーが表示されます。',
      },
    },
  },
};

/**
 * フォーム要素を含むPopoverの例です。
 */
export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">プロフィール編集</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">プロフィール</h4>
            <p className="text-sm text-muted-foreground">
              プロフィール情報を編集します。
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">名前</Label>
              <Input
                id="width"
                defaultValue="山田太郎"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">メール</Label>
              <Input
                id="maxWidth"
                defaultValue="yamada@example.com"
                className="col-span-2 h-8"
              />
            </div>
          </div>
          <Button size="sm">保存</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'フォーム要素を含むPopoverの例です。プロフィール編集フォームを表示します。',
      },
    },
  },
};

/**
 * 異なる配置のPopoverの例です。
 */
export const Placement: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">上</Button>
        </PopoverTrigger>
        <PopoverContent className="w-40" align="center" side="top">
          <div className="text-center">上に表示</div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">右</Button>
        </PopoverTrigger>
        <PopoverContent className="w-40" align="center" side="right">
          <div className="text-center">右に表示</div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">下</Button>
        </PopoverTrigger>
        <PopoverContent className="w-40" align="center" side="bottom">
          <div className="text-center">下に表示</div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">左</Button>
        </PopoverTrigger>
        <PopoverContent className="w-40" align="center" side="left">
          <div className="text-center">左に表示</div>
        </PopoverContent>
      </Popover>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '異なる配置のPopoverの例です。上、右、下、左に表示できます。',
      },
    },
  },
};

/**
 * 異なる配置位置のPopoverの例です。
 */
export const Alignment: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">開始位置</Button>
          </PopoverTrigger>
          <PopoverContent className="w-60" align="start">
            <div className="text-center">開始位置に揃えて表示</div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">中央位置</Button>
          </PopoverTrigger>
          <PopoverContent className="w-60" align="center">
            <div className="text-center">中央位置に揃えて表示</div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">終了位置</Button>
          </PopoverTrigger>
          <PopoverContent className="w-60" align="end">
            <div className="text-center">終了位置に揃えて表示</div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '異なる配置位置のPopoverの例です。開始位置、中央位置、終了位置に揃えて表示できます。',
      },
    },
  },
};

/**
 * カスタムトリガーを持つPopoverの例です。
 */
export const CustomTrigger: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
            <span className="sr-only">設定</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">設定</h4>
              <p className="text-sm text-muted-foreground">
                アプリケーションの設定を変更します。
              </p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">通知</Label>
                <Switch id="notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="darkmode">ダークモード</Label>
                <Switch id="darkmode" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
            <span className="sr-only">ユーザー</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">ユーザー情報</h4>
              <p className="text-sm text-muted-foreground">山田太郎</p>
              <p className="text-xs text-muted-foreground">
                yamada@example.com
              </p>
            </div>
            <div className="grid gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-start"
              >
                <User className="mr-2 h-4 w-4" />
                プロフィール
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-start"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                お支払い
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムトリガーを持つPopoverの例です。アイコンボタンをトリガーとして使用しています。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したPopoverの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          カスタムスタイル
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-blue-50 border-blue-200">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-blue-700">
              カスタムスタイル
            </h4>
            <p className="text-sm text-blue-600">
              カスタムスタイルを適用したポップオーバーです。
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-blue-500" />
              <span className="text-blue-700">カスタム背景色</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-blue-500" />
              <span className="text-blue-700">カスタムテキスト色</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-blue-500" />
              <span className="text-blue-700">カスタムボーダー色</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したPopoverの例です。青色のテーマを適用しています。',
      },
    },
  },
};

/**
 * 実際のユースケースでのPopoverの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between p-4 border rounded-lg w-full max-w-md">
        <div>
          <h3 className="font-medium">新規プロジェクト</h3>
          <p className="text-sm text-muted-foreground">
            新しいプロジェクトを作成します
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              作成
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">新規プロジェクト</h4>
                <p className="text-sm text-muted-foreground">
                  プロジェクト情報を入力してください。
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="project-name">プロジェクト名</Label>
                  <Input id="project-name" placeholder="新しいプロジェクト" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="project-desc">説明</Label>
                  <Input id="project-desc" placeholder="プロジェクトの説明" />
                </div>
              </div>
              <Button>作成する</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg w-full max-w-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <h3 className="font-medium">山田太郎</h3>
            <p className="text-sm text-muted-foreground">
              プロジェクトマネージャー
            </p>
          </div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">ユーザー設定</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">ユーザー設定</h4>
              </div>
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-start"
                >
                  <User className="mr-2 h-4 w-4" />
                  プロフィール編集
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-start"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  権限設定
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-start text-red-500 hover:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  削除
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのPopoverの例です。プロジェクト作成フォームやユーザー設定メニューなどに適しています。',
      },
    },
  },
};
