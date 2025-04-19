import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './index';

/**
 * `Drawer`コンポーネントは、画面の端から表示されるパネルを提供します。
 * モバイルデバイスでの使用に特に適しています。
 *
 * ## 特徴
 * - 画面下部からスライドイン
 * - ドラッグでの操作
 * - アクセシビリティ対応
 * - アニメーション効果
 *
 * ## 使用例
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger>ドロワーを開く</DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>タイトル</DrawerTitle>
 *       <DrawerDescription>説明文をここに記述します。</DrawerDescription>
 *     </DrawerHeader>
 *     <div>ドロワーの内容</div>
 *     <DrawerFooter>
 *       <Button>アクション</Button>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボードナビゲーション対応
 * - スクリーンリーダー対応
 */
const meta = {
  title: 'Shadcn/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Drawerコンポーネントは、画面の端から表示されるパネルを提供します。モバイルデバイスでの使用に特に適しています。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Drawerの子要素',
      control: false,
    },
  },
} as Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof Drawer>;

/**
 * 基本的なドロワーの例です。
 */
export const Basic: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '基本的なドロワーの例です。',
      },
    },
  },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">ドロワーを開く</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>基本的なドロワー</DrawerTitle>
            <DrawerDescription>
              これは基本的なドロワーの例です。画面下部からスライドインします。
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            ドロワーの内容をここに配置します。テキスト、画像、フォームなど、様々なコンテンツを表示できます。
          </div>
          <DrawerFooter>
            <Button>保存</Button>
            <DrawerClose asChild>
              <Button variant="outline">キャンセル</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * フォームを含むドロワーの例です。
 */
export const WithForm: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'フォームを含むドロワーの例です。',
      },
    },
  },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">フォームを開く</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>プロフィール編集</DrawerTitle>
            <DrawerDescription>
              プロフィール情報を更新します。完了したら保存ボタンをクリックしてください。
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">名前</Label>
              <Input id="name" defaultValue="山田太郎" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">ユーザー名</Label>
              <Input id="username" defaultValue="yamada_taro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                defaultValue="yamada@example.com"
                type="email"
              />
            </div>
          </div>
          <DrawerFooter>
            <Button>保存</Button>
            <DrawerClose asChild>
              <Button variant="outline">キャンセル</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * カスタムスタイルを適用したドロワーの例です。
 */
export const CustomStyling: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'カスタムスタイルを適用したドロワーの例です。',
      },
    },
  },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">カスタムドロワー</Button>
      </DrawerTrigger>
      <DrawerContent className="bg-slate-900 text-white border-slate-800">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-white">カスタムスタイル</DrawerTitle>
            <DrawerDescription className="text-slate-400">
              ドロワーにカスタムスタイルを適用した例です。
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 text-slate-300">
            Tailwind CSSを使用して、ドロワーの外観をカスタマイズできます。
            背景色、テキスト色、ボーダーなど、様々なスタイルを変更できます。
          </div>
          <DrawerFooter>
            <Button className="bg-blue-600 hover:bg-blue-700">完了</Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800"
              >
                キャンセル
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * 確認ドロワーの例です。
 */
export const Confirmation: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '確認ドロワーの例です。',
      },
    },
  },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="destructive">アカウント削除</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>アカウント削除の確認</DrawerTitle>
            <DrawerDescription>
              本当にアカウントを削除しますか？この操作は取り消せません。
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            アカウントを削除すると、すべてのデータが完全に削除され、復元できなくなります。
          </div>
          <DrawerFooter>
            <Button variant="destructive">削除する</Button>
            <DrawerClose asChild>
              <Button variant="outline">キャンセル</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * 複数のセクションを持つドロワーの例です。
 */
export const WithSections: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '複数のセクションを持つドロワーの例です。',
      },
    },
  },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">詳細設定</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>アプリケーション設定</DrawerTitle>
            <DrawerDescription>
              アプリケーションの詳細設定を行います。
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-2">通知設定</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push">プッシュ通知</Label>
                  <Input id="push" type="checkbox" className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notif">メール通知</Label>
                  <Input id="email-notif" type="checkbox" className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">テーマ設定</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">ダークモード</Label>
                  <Input id="dark-mode" type="checkbox" className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast">ハイコントラスト</Label>
                  <Input
                    id="high-contrast"
                    type="checkbox"
                    className="w-4 h-4"
                  />
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button>保存</Button>
            <DrawerClose asChild>
              <Button variant="outline">キャンセル</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};
