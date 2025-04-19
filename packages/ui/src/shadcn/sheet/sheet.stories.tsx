import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './index';
import { Button } from '../button';

/**
 * `Sheet`コンポーネントは、画面の端から表示されるサイドパネルを提供します。
 *
 * ## 特徴
 * - 上下左右の4方向から表示可能
 * - ヘッダー、フッター、タイトル、説明などの構成要素を提供
 * - アニメーション付きの表示/非表示
 * - アクセシビリティ対応
 * - カスタマイズ可能なスタイル
 *
 * ## 使用例
 * ```tsx
 * <Sheet>
 *   <SheetTrigger>開く</SheetTrigger>
 *   <SheetContent>
 *     <SheetHeader>
 *       <SheetTitle>タイトル</SheetTitle>
 *       <SheetDescription>説明文</SheetDescription>
 *     </SheetHeader>
 *     コンテンツ
 *   </SheetContent>
 * </Sheet>
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボード操作対応
 * - フォーカス管理
 */
const meta = {
  title: 'Shadcn/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Sheetコンポーネントは、画面の端から表示されるサイドパネルを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: '初期状態で開いているかどうか',
    },
    open: {
      control: 'boolean',
      description: '制御された状態での開閉状態',
    },
    onOpenChange: {
      description: '開閉状態が変更されたときに呼び出されるコールバック関数',
    },
  },
} as Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なSheetの例です。
 */
export const Basic: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">シートを開く</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>シートタイトル</SheetTitle>
          <SheetDescription>
            シートの説明文をここに記述します。必要な情報を提供してください。
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            シートのコンテンツがここに表示されます。フォーム、リスト、詳細情報などを配置できます。
          </p>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>閉じる</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '基本的なSheetの例です。トリガー、コンテンツ、ヘッダー、フッターを含む構成を示しています。',
      },
    },
  },
};

/**
 * 異なる表示位置のSheetの例です。
 */
export const Positions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">上から表示</Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>上から表示</SheetTitle>
            <SheetDescription>
              このシートは画面の上部から表示されます。
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              上部から表示されるシートは、通知やアラートに適しています。
            </p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">右から表示</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>右から表示</SheetTitle>
            <SheetDescription>
              このシートは画面の右側から表示されます。
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              右側から表示されるシートは、詳細情報や設定パネルに適しています。
            </p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">下から表示</Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>下から表示</SheetTitle>
            <SheetDescription>
              このシートは画面の下部から表示されます。
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              下部から表示されるシートは、モバイルデバイスでのアクションメニューに適しています。
            </p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">左から表示</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>左から表示</SheetTitle>
            <SheetDescription>
              このシートは画面の左側から表示されます。
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              左側から表示されるシートは、ナビゲーションメニューに適しています。
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '異なる表示位置のSheetの例です。side プロパティを使用して、上下左右の4方向から表示できます。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したSheetの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">カスタムスタイル</Button>
        </SheetTrigger>
        <SheetContent className="bg-blue-50 border-blue-200">
          <SheetHeader>
            <SheetTitle className="text-blue-700">カスタムスタイル</SheetTitle>
            <SheetDescription className="text-blue-600">
              カスタムスタイルを適用したシートの例です。
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm text-blue-700">
              className
              プロパティを使用して、シートの背景色、テキスト色、ボーダーなどをカスタマイズできます。
            </p>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button className="bg-blue-500 hover:bg-blue-600">閉じる</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">幅広シート</Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>幅広シート</SheetTitle>
            <SheetDescription>
              幅を広げたシートの例です。sm:max-w-md
              クラスを使用して幅を調整しています。
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              シートの幅は、className
              プロパティを使用してカスタマイズできます。より多くのコンテンツを表示したい場合に便利です。
            </p>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">角丸シート</Button>
        </SheetTrigger>
        <SheetContent className="rounded-xl">
          <SheetHeader>
            <SheetTitle>角丸シート</SheetTitle>
            <SheetDescription>
              角を丸くしたシートの例です。rounded-xl
              クラスを使用して角を丸くしています。
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              シートの角は、className
              プロパティを使用してカスタマイズできます。より柔らかい印象を与えたい場合に便利です。
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したSheetの例です。className プロパティを使用して、背景色、テキスト色、幅、角丸などをカスタマイズできます。',
      },
    },
  },
};

/**
 * 実際のユースケースでのSheetの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {/* ショッピングカートの例 */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">ショッピングカート</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>ショッピングカート</SheetTitle>
            <SheetDescription>カートに追加した商品</SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-md bg-gray-100" />
              <div className="flex-1">
                <h4 className="text-sm font-medium">商品名1</h4>
                <p className="text-sm text-muted-foreground">¥2,980</p>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" className="h-6 w-6 rounded-md border">
                  -
                </button>
                <span className="w-8 text-center text-sm">1</span>
                <button type="button" className="h-6 w-6 rounded-md border">
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-md bg-gray-100" />
              <div className="flex-1">
                <h4 className="text-sm font-medium">商品名2</h4>
                <p className="text-sm text-muted-foreground">¥1,580</p>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" className="h-6 w-6 rounded-md border">
                  -
                </button>
                <span className="w-8 text-center text-sm">2</span>
                <button type="button" className="h-6 w-6 rounded-md border">
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">小計</span>
              <span className="text-sm font-medium">¥6,140</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-muted-foreground">送料</span>
              <span className="text-sm text-muted-foreground">¥550</span>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-base font-medium">合計</span>
              <span className="text-base font-medium">¥6,690</span>
            </div>
          </div>
          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button className="w-full">レジに進む</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* ユーザープロフィールの例 */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">ユーザープロフィール</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>ユーザープロフィール</SheetTitle>
            <SheetDescription>ユーザー情報の詳細</SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-gray-100" />
              <div>
                <h4 className="text-base font-medium">山田 太郎</h4>
                <p className="text-sm text-muted-foreground">
                  yamada.taro@example.com
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <h5 className="text-sm font-medium">基本情報</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">ユーザーID</span>
                  <span>12345</span>
                  <span className="text-muted-foreground">登録日</span>
                  <span>2023年4月1日</span>
                  <span className="text-muted-foreground">ステータス</span>
                  <span className="text-green-600">アクティブ</span>
                </div>
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-medium">連絡先</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">電話番号</span>
                  <span>090-1234-5678</span>
                  <span className="text-muted-foreground">住所</span>
                  <span>東京都渋谷区...</span>
                </div>
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">閉じる</Button>
            </SheetClose>
            <Button>編集</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* モバイルメニューの例 */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">モバイルメニュー</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>メニュー</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <nav className="space-y-2">
              <a
                href="https://www.google.com"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                ホーム
              </a>
              <a
                href="https://www.google.com"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                製品
              </a>
              <a
                href="https://www.google.com"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                価格
              </a>
              <a
                href="https://www.google.com"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                ブログ
              </a>
              <a
                href="https://www.google.com"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                お問い合わせ
              </a>
            </nav>
          </div>
          <div className="border-t pt-4">
            <div className="space-y-2">
              <a
                href="https://www.google.com"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                ログイン
              </a>
              <a
                href="https://www.google.com"
                className="flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
              >
                新規登録
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのSheetの例です。ショッピングカート、ユーザープロフィール、モバイルメニューなどの例を示しています。',
      },
    },
  },
};
