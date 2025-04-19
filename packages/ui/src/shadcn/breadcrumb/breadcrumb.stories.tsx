import type { Meta, StoryObj } from '@storybook/react';
import { Home, Settings, User, FileText } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './index';

/**
 * `Breadcrumb`コンポーネントは、ユーザーが現在のページの位置を把握し、
 * 階層構造内を移動するためのナビゲーション要素です。
 *
 * ## 特徴
 * - 階層構造のナビゲーションを提供
 * - カスタマイズ可能なセパレーター
 * - 省略表示のサポート
 * - アクセシビリティ対応
 * - Next.jsのLinkコンポーネントとの統合
 *
 * ## 使用例
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">ホーム</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/products">製品</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>製品詳細</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボードナビゲーション対応
 * - スクリーンリーダー対応
 */
const meta = {
  title: 'Shadcn/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Breadcrumbコンポーネントは、ユーザーが現在のページの位置を把握し、階層構造内を移動するためのナビゲーション要素です。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Breadcrumbの子要素',
      control: false,
    },
    separator: {
      description: 'カスタムセパレーター',
      control: false,
    },
  },
} as Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なBreadcrumbの例です。
 * シンプルなテキストリンクとデフォルトのセパレーターを使用しています。
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '基本的なBreadcrumbの例です。シンプルなテキストリンクとデフォルトのセパレーターを使用しています。',
      },
    },
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">ホーム</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">製品</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>製品詳細</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * アイコン付きのBreadcrumbの例です。
 * 各リンクにアイコンを追加して視覚的な手がかりを提供します。
 */
export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'アイコン付きのBreadcrumbの例です。各リンクにアイコンを追加して視覚的な手がかりを提供します。',
      },
    },
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home className="mr-1 h-4 w-4" />
            ホーム
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/settings">
            <Settings className="mr-1 h-4 w-4" />
            設定
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/settings/profile">
            <User className="mr-1 h-4 w-4" />
            プロフィール
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            <FileText className="mr-1 h-4 w-4" />
            編集
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * カスタムセパレーターを持つBreadcrumbの例です。
 * デフォルトのセパレーターをカスタムの文字やアイコンに置き換えています。
 */
export const CustomSeparator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'カスタムセパレーターを持つBreadcrumbの例です。デフォルトのセパレーターをカスタムの文字やアイコンに置き換えています。',
      },
    },
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">ホーム</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>•</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/blog">ブログ</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>•</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/blog/categories">カテゴリー</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>•</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>テクノロジー</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * 省略表示を持つBreadcrumbの例です。
 * 長いパスを省略して表示します。
 */
export const WithEllipsis: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '省略表示を持つBreadcrumbの例です。長いパスを省略して表示します。',
      },
    },
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">ホーム</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products/categories">
            カテゴリー
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products/categories/electronics">
            電子機器
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>スマートフォン</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Next.jsのLinkコンポーネントと統合したBreadcrumbの例です。
 * asChildプロパティを使用してNext.jsのLinkコンポーネントを統合しています。
 */
export const WithNextLink: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Next.jsのLinkコンポーネントと統合したBreadcrumbの例です。asChildプロパティを使用してNext.jsのLinkコンポーネントを統合しています。',
      },
    },
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">ホーム</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">ダッシュボード</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard/settings">設定</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>アカウント設定</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * カスタムスタイルを適用したBreadcrumbの例です。
 * 背景色やテキストスタイルをカスタマイズしています。
 */
export const CustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したBreadcrumbの例です。背景色やテキストスタイルをカスタマイズしています。',
      },
    },
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList className="bg-secondary/20 p-2 rounded-md">
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="text-primary hover:text-primary/80 font-medium"
          >
            ホーム
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-primary/50" />
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/services"
            className="text-primary hover:text-primary/80 font-medium"
          >
            サービス
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-primary/50" />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-bold">
            コンサルティング
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
