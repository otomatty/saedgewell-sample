import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { cn } from '../../lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './index';

/**
 * `NavigationMenu`コンポーネントは、アクセシブルなナビゲーションメニューを提供します。
 *
 * ## 特徴
 * - アクセシビリティ対応
 * - キーボードナビゲーション
 * - ドロップダウンメニュー
 * - カスタマイズ可能なスタイル
 *
 * ## 使用例
 * ```tsx
 * <NavigationMenu>
 *   <NavigationMenuList>
 *     <NavigationMenuItem>
 *       <NavigationMenuLink href="/">ホーム</NavigationMenuLink>
 *     </NavigationMenuItem>
 *   </NavigationMenuList>
 * </NavigationMenu>
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボードナビゲーション対応
 * - スクリーンリーダー対応
 */
const meta = {
  title: 'Shadcn/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'NavigationMenuコンポーネントは、アクセシブルなナビゲーションメニューを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'NavigationMenuの子要素',
    },
  },
} as Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

/**
 * 基本的なナビゲーションメニューの例です。
 */
export const Basic: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            ホーム
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            ブログ
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            お問い合わせ
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '基本的なナビゲーションメニューの例です。シンプルなリンクのみを含んでいます。',
      },
    },
  },
};

/**
 * ドロップダウンメニューを含むナビゲーションメニューの例です。
 */
export const WithDropdowns: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>製品</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-hidden focus:shadow-md"
                    href="https://www.google.com"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      製品紹介
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      当社の製品ラインナップをご覧ください。
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="https://www.google.com" title="アプリケーション">
                クラウドベースのアプリケーションソリューション
              </ListItem>
              <ListItem href="https://www.google.com" title="サービス">
                プロフェッショナルサービスとサポート
              </ListItem>
              <ListItem href="https://www.google.com" title="ハードウェア">
                高性能コンピューティングソリューション
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>リソース</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem href="#" title="ドキュメント">
                製品のドキュメントとガイド
              </ListItem>
              <ListItem href="#" title="チュートリアル">
                ステップバイステップのチュートリアル
              </ListItem>
              <ListItem href="#" title="ブログ">
                最新のニュースと記事
              </ListItem>
              <ListItem href="#" title="コミュニティ">
                ユーザーコミュニティとフォーラム
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            お問い合わせ
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'ドロップダウンメニューを含むナビゲーションメニューの例です。製品やリソースなどのカテゴリを展開できます。',
      },
    },
  },
};

/**
 * 複数列のドロップダウンメニューを含むナビゲーションメニューの例です。
 */
export const MultiColumnDropdown: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>サービス</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[600px] grid-cols-3 gap-3 p-4">
              <li className="col-span-3">
                <div className="mb-2 text-lg font-medium">サービス一覧</div>
                <div className="text-sm text-muted-foreground mb-4">
                  当社が提供する様々なサービスをご覧ください。
                </div>
              </li>
              <div>
                <h4 className="text-sm font-medium mb-2 text-primary">開発</h4>
                <ul className="space-y-2">
                  <ListItem href="#" title="Webアプリ開発">
                    モダンなWebアプリケーション開発
                  </ListItem>
                  <ListItem href="#" title="モバイルアプリ開発">
                    iOSとAndroidのネイティブアプリ開発
                  </ListItem>
                  <ListItem href="#" title="API開発">
                    RESTfulおよびGraphQL API開発
                  </ListItem>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 text-primary">
                  デザイン
                </h4>
                <ul className="space-y-2">
                  <ListItem href="#" title="UIデザイン">
                    ユーザーインターフェースデザイン
                  </ListItem>
                  <ListItem href="#" title="UXデザイン">
                    ユーザーエクスペリエンスデザイン
                  </ListItem>
                  <ListItem href="#" title="ブランディング">
                    ブランドアイデンティティデザイン
                  </ListItem>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 text-primary">
                  コンサルティング
                </h4>
                <ul className="space-y-2">
                  <ListItem href="#" title="技術コンサルティング">
                    技術スタックと戦略のアドバイス
                  </ListItem>
                  <ListItem href="#" title="プロジェクト管理">
                    アジャイルプロジェクト管理
                  </ListItem>
                  <ListItem href="#" title="セキュリティ監査">
                    アプリケーションセキュリティ監査
                  </ListItem>
                </ul>
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            料金
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            お問い合わせ
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '複数列のドロップダウンメニューを含むナビゲーションメニューの例です。サービスカテゴリを複数列で表示しています。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したナビゲーションメニューの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <NavigationMenu className="bg-blue-50 p-2 rounded-lg">
      <NavigationMenuList className="space-x-2">
        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(
              navigationMenuTriggerStyle(),
              'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
            )}
            href="#"
          >
            ホーム
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
            製品
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 bg-white">
              <ListItem href="#" title="製品A">
                製品Aの詳細説明
              </ListItem>
              <ListItem href="#" title="製品B">
                製品Bの詳細説明
              </ListItem>
              <ListItem href="#" title="製品C">
                製品Cの詳細説明
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(
              navigationMenuTriggerStyle(),
              'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
            )}
            href="#"
          >
            お問い合わせ
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したナビゲーションメニューの例です。青色のテーマを適用しています。',
      },
    },
  },
};

/**
 * モバイルフレンドリーなナビゲーションメニューの例です。
 */
export const MobileFriendly: Story = {
  render: () => (
    <div className="w-full max-w-sm mx-auto">
      <NavigationMenu className="w-full">
        <NavigationMenuList className="flex w-full justify-between">
          <NavigationMenuItem className="flex-1 text-center">
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                'w-full justify-center'
              )}
              href="#"
            >
              ホーム
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex-1 text-center">
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                'w-full justify-center'
              )}
              href="#"
            >
              検索
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex-1 text-center">
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                'w-full justify-center'
              )}
              href="#"
            >
              設定
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'モバイルフレンドリーなナビゲーションメニューの例です。モバイルデバイス向けに最適化されています。',
      },
    },
  },
};

/**
 * 実際のウェブサイトのヘッダーでの使用例です。
 */
export const WebsiteHeader: Story = {
  render: () => (
    <header className="border-b w-full px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <div className="font-bold text-xl mr-8">ブランド名</div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="#"
              >
                ホーム
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>製品</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  <ListItem href="#" title="製品A">
                    製品Aの詳細説明
                  </ListItem>
                  <ListItem href="#" title="製品B">
                    製品Bの詳細説明
                  </ListItem>
                  <ListItem href="#" title="製品C">
                    製品Cの詳細説明
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>リソース</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  <ListItem href="#" title="ドキュメント">
                    製品のドキュメントとガイド
                  </ListItem>
                  <ListItem href="#" title="ブログ">
                    最新のニュースと記事
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="#"
              >
                お問い合わせ
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          ログイン
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          登録
        </button>
      </div>
    </header>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のウェブサイトのヘッダーでの使用例です。ブランド名、ナビゲーションメニュー、ログインボタンを含んでいます。',
      },
    },
  },
};
