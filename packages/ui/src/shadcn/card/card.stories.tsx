// @ts-nocheck - Storybookの型定義の問題を回避
import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './index';
import { Button } from '../button';

/**
 * `Card`コンポーネントは、関連するコンテンツをグループ化し、視覚的に区切るために使用されるコンテナです。
 *
 * ## 特徴
 * - 複数のサブコンポーネント（Header, Title, Description, Content, Footer）を提供
 * - 柔軟なレイアウトとスタイリングが可能
 * - 境界線、影、角丸などの視覚的な要素を持つ
 *
 * ## 使用例
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>カードのタイトル</CardTitle>
 *     <CardDescription>カードの説明文</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     カードのコンテンツ
 *   </CardContent>
 *   <CardFooter>
 *     <Button>アクション</Button>
 *   </CardFooter>
 * </Card>
 * ```
 *
 * ## アクセシビリティ
 * - 適切な見出しレベルを使用することで、スクリーンリーダーのナビゲーションをサポート
 * - コントラスト比を考慮したスタイリングを推奨
 */
const meta = {
  title: 'Shadcn/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'カードコンポーネントは、関連するコンテンツをグループ化し、視覚的に区切るために使用されるコンテナです。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      description: 'コンポーネントに追加のクラス名を指定します。',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} as Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なカードの例です。
 * タイトル、説明、コンテンツ、フッターを含む完全なカードの構造を示しています。
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '基本的なカードの例です。タイトル、説明、コンテンツ、フッターを含む完全なカードの構造を示しています。',
      },
    },
  },
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>カードのタイトル</CardTitle>
        <CardDescription>カードの説明文をここに記述します。</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          カードのコンテンツをここに記述します。テキスト、画像、その他のコンポーネントを配置できます。
        </p>
      </CardContent>
      <CardFooter>
        <Button>アクション</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * シンプルなカードの例です。
 * 最小限の構造でカードを表示します。
 */
export const Simple: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'シンプルなカードの例です。コンテンツのみを含む最小限の構造を示しています。',
      },
    },
  },
  render: (args) => (
    <Card className="w-[350px] p-6" {...args}>
      <p>
        シンプルなカードの例です。サブコンポーネントを使用せずに、直接コンテンツを配置することもできます。
      </p>
    </Card>
  ),
};

/**
 * 画像付きカードの例です。
 * カードの上部に画像を配置し、その下にコンテンツを表示します。
 */
export const WithImage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '画像付きカードの例です。カードの上部に画像を配置し、その下にコンテンツを表示します。',
      },
    },
  },
  render: (args) => (
    <Card className="w-[350px] overflow-hidden" {...args}>
      <img
        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=350&h=200&fit=crop"
        alt="製品画像"
        className="w-full h-[200px] object-cover"
      />
      <CardHeader>
        <CardTitle>製品名</CardTitle>
        <CardDescription>製品の説明文</CardDescription>
      </CardHeader>
      <CardContent>
        <p>製品の詳細情報をここに記述します。特徴や利点などを説明できます。</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="font-bold">¥10,000</p>
        <Button>カートに追加</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * 水平レイアウトのカードの例です。
 * 画像とコンテンツを横並びに配置します。
 */
export const HorizontalLayout: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '水平レイアウトのカードの例です。画像とコンテンツを横並びに配置します。',
      },
    },
  },
  render: (args) => (
    <Card className="flex w-[600px] overflow-hidden" {...args}>
      <img
        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=300&fit=crop"
        alt="製品画像"
        className="w-[200px] h-auto object-cover"
      />
      <div className="flex-1">
        <CardHeader>
          <CardTitle>製品名</CardTitle>
          <CardDescription>製品の説明文</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            製品の詳細情報をここに記述します。特徴や利点などを説明できます。
          </p>
        </CardContent>
        <CardFooter>
          <Button>詳細を見る</Button>
        </CardFooter>
      </div>
    </Card>
  ),
};

/**
 * インタラクティブなカードの例です。
 * ホバー時に視覚的なフィードバックを提供します。
 */
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'インタラクティブなカードの例です。ホバー時に視覚的なフィードバックを提供します。',
      },
    },
  },
  render: (args) => (
    <Card
      className="w-[350px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      {...args}
    >
      <CardHeader>
        <CardTitle>インタラクティブカード</CardTitle>
        <CardDescription>ホバーするとエフェクトが表示されます</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          このカードにはホバーエフェクトが適用されています。マウスを乗せると、影が大きくなり、わずかに上に移動します。
        </p>
      </CardContent>
    </Card>
  ),
};

/**
 * カスタムスタイルのカードの例です。
 * 背景色、テキスト色、境界線などをカスタマイズしています。
 */
export const CustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルのカードの例です。背景色、テキスト色、境界線などをカスタマイズしています。',
      },
    },
  },
  render: (args) => (
    <Card
      className="w-[350px] bg-primary text-primary-foreground border-none"
      {...args}
    >
      <CardHeader>
        <CardTitle>カスタムスタイルカード</CardTitle>
        <CardDescription className="text-primary-foreground/80">
          カスタムスタイルが適用されています
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>このカードにはカスタムの背景色とテキスト色が適用されています。</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">アクション</Button>
      </CardFooter>
    </Card>
  ),
};
