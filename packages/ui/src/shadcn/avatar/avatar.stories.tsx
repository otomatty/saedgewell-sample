// @ts-nocheck - Storybookの型定義の問題を回避
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from './index';

/**
 * `Avatar`コンポーネントは、ユーザーやエンティティを表す視覚的な要素として使用されます。
 *
 * ## 特徴
 * - 画像表示をサポート
 * - 画像が読み込めない場合のフォールバック表示
 * - サイズのカスタマイズが可能
 * - 遅延フォールバック表示のサポート
 * - カスタムスタイリングが可能
 *
 * ## 使用例
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="/path/to/image.jpg" alt="ユーザー名" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * ```
 *
 * ## アクセシビリティ
 * - 画像には適切なalt属性を設定してください
 * - フォールバックテキストは短く、識別可能なものにしてください
 */
const meta = {
  title: 'Shadcn/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'アバターコンポーネントは、ユーザーやエンティティを視覚的に表現するために使用されます。画像表示とフォールバック表示の両方をサポートしています。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      description:
        'コンポーネントに追加のクラス名を指定します。サイズのカスタマイズなどに使用できます。',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      description: 'AvatarImage、AvatarFallbackなどの子コンポーネント。',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
  subcomponents: { AvatarImage, AvatarFallback },
} as Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 画像を表示するアバターの基本的な例です。
 * 画像が正常に読み込まれた場合、この表示になります。
 */
export const WithImage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '画像を表示するアバターの基本的な例です。`AvatarImage`コンポーネントを使用して画像を表示し、`AvatarFallback`コンポーネントをフォールバックとして提供します。',
      },
    },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

/**
 * 画像が読み込めない場合のフォールバック表示の例です。
 * 無効なURL、ネットワークエラー、またはその他の理由で画像が表示できない場合に使用されます。
 */
export const WithFallback: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '画像が読み込めない場合、`AvatarFallback`コンポーネントが表示されます。通常、ユーザーのイニシャルやプレースホルダーアイコンを表示します。',
      },
    },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="/broken-image.jpg" alt="ユーザー" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

/**
 * さまざまなサイズのアバターの例です。
 * クラス名を使用して、アバターのサイズをカスタマイズできます。
 */
export const CustomSize: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'クラス名を使用して、アバターのサイズをカスタマイズできます。この例では、XS（h-6 w-6）からXL（h-20 w-20）までの5つのサイズを示しています。',
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar className="h-6 w-6" {...args}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>XS</AvatarFallback>
      </Avatar>
      <Avatar className="h-8 w-8" {...args}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14" {...args}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar className="h-20 w-20" {...args}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * カスタムカラーのフォールバック表示の例です。
 * フォールバックの背景色とテキスト色をカスタマイズできます。
 */
export const CustomFallbackColor: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'フォールバックの背景色とテキスト色をカスタマイズできます。この例では、赤、緑、青、黄、紫の背景色を持つフォールバックを示しています。',
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args}>
        <AvatarFallback className="bg-red-500 text-white">A</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback className="bg-green-500 text-white">B</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback className="bg-blue-500 text-white">C</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback className="bg-yellow-500 text-white">D</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback className="bg-purple-500 text-white">E</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * ボーダーを追加したアバターの例です。
 * アバターの周囲にボーダーを追加して、視覚的な強調を行うことができます。
 */
export const WithBorder: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'アバターの周囲にボーダーを追加して、視覚的な強調を行うことができます。この例では、プライマリカラーの2pxボーダーを追加しています。',
      },
    },
  },
  render: (args) => (
    <Avatar className="border-2 border-primary" {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

/**
 * 遅延フォールバック表示の例です。
 * 画像の読み込みに時間がかかる場合、指定した遅延後にフォールバックを表示できます。
 */
export const WithDelayedFallback: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`delayMs`属性を使用して、フォールバックの表示を遅延させることができます。これは、画像の読み込みに時間がかかる場合に、フラッシュを防ぐのに役立ちます。',
      },
    },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="/broken-image.jpg" alt="ユーザー" />
      <AvatarFallback delayMs={600}>JD</AvatarFallback>
    </Avatar>
  ),
};
