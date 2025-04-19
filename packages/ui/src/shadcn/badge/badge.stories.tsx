// @ts-nocheck - Storybookの型定義の問題を回避
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './index';

/**
 * `Badge`コンポーネントは、ステータス、カテゴリ、または数値を表示するために使用される小さなラベルです。
 *
 * ## 特徴
 * - 4種類のバリアント（default, secondary, destructive, outline）をサポート
 * - アイコンとの組み合わせが可能
 * - サイズのカスタマイズが可能
 * - カスタムカラーの適用が可能
 *
 * ## 使用例
 * ```tsx
 * <Badge variant="default">新着</Badge>
 * <Badge variant="destructive">重要</Badge>
 * ```
 *
 * ## ユースケース
 * - ステータス表示（新着、完了、保留中など）
 * - カウンター（通知数、アイテム数など）
 * - カテゴリラベル
 * - タグ
 */
const meta = {
  title: 'Shadcn/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'バッジコンポーネントは、ステータス、カテゴリ、または数値を表示するために使用される小さなラベルです。様々なバリエーションとカスタマイズオプションを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description:
        'バッジの種類を指定します。"default"はプライマリカラー、"secondary"はセカンダリカラー、"destructive"は警告や危険を示す色、"outline"は枠線のみのスタイルです。',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    className: {
      description:
        'コンポーネントに追加のクラス名を指定します。カスタムスタイルの適用に使用できます。',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      description:
        'バッジ内に表示するコンテンツ。テキスト、アイコン、またはその他の要素を含めることができます。',
      control: { type: 'text' },
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
} as Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なバッジの例です。
 * プライマリカラーを使用した標準的なバッジです。
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'プライマリカラーを使用した標準的なバッジです。最も一般的に使用されるバリアントです。',
      },
    },
  },
  args: {
    children: 'バッジ',
    variant: 'default',
  },
};

/**
 * セカンダリカラーを使用したバッジの例です。
 * 優先度が低い情報や補足的な情報に使用します。
 */
export const Secondary: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'セカンダリカラーを使用したバッジです。優先度が低い情報や補足的な情報に使用します。',
      },
    },
  },
  args: {
    children: 'セカンダリ',
    variant: 'secondary',
  },
};

/**
 * 警告用のバッジの例です。
 * 重要な警告や注意を促す情報に使用します。
 */
export const Destructive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '警告用のバッジです。重要な警告や注意を促す情報、エラー状態の表示に使用します。',
      },
    },
  },
  args: {
    children: '警告',
    variant: 'destructive',
  },
};

/**
 * アウトラインスタイルのバッジの例です。
 * 背景色がなく、枠線のみのスタイルです。
 */
export const Outline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'アウトラインスタイルのバッジです。背景色がなく、枠線のみのスタイルで、より控えめな表示が必要な場合に使用します。',
      },
    },
  },
  args: {
    children: 'アウトライン',
    variant: 'outline',
  },
};

/**
 * アイコンを含むバッジの例です。
 * テキストと一緒にアイコンを表示することで、視覚的な手がかりを提供します。
 */
export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'テキストと一緒にアイコンを表示することで、バッジの意図をより視覚的に伝えることができます。アイコンには適切なアクセシビリティ属性を設定することが重要です。',
      },
    },
  },
  render: (args) => (
    <Badge {...args}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-1 h-3 w-3"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      アイコン付き
    </Badge>
  ),
};

/**
 * カスタムカラーを適用したバッジの例です。
 * Tailwind CSSのクラスを使用して、バッジの色をカスタマイズできます。
 */
export const CustomColors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Tailwind CSSのクラスを使用して、バッジの色をカスタマイズできます。この例では、青、緑、黄、紫、ピンクの背景色を持つバッジを示しています。',
      },
    },
  },
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-blue-500 hover:bg-blue-600" {...args}>
        カスタム青
      </Badge>
      <Badge className="bg-green-500 hover:bg-green-600" {...args}>
        カスタム緑
      </Badge>
      <Badge className="bg-yellow-500 text-black hover:bg-yellow-600" {...args}>
        カスタム黄
      </Badge>
      <Badge className="bg-purple-500 hover:bg-purple-600" {...args}>
        カスタム紫
      </Badge>
      <Badge className="bg-pink-500 hover:bg-pink-600" {...args}>
        カスタムピンク
      </Badge>
    </div>
  ),
};

/**
 * さまざまなサイズのバッジの例です。
 * クラス名を使用して、バッジのサイズをカスタマイズできます。
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'クラス名を使用して、バッジのサイズをカスタマイズできます。この例では、極小、小、中、大の4つのサイズを示しています。用途に応じて適切なサイズを選択してください。',
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Badge className="text-[0.625rem] px-1.5 py-0" {...args}>
        極小
      </Badge>
      <Badge className="text-xs px-2 py-0.5" {...args}>
        小
      </Badge>
      <Badge className="text-sm px-2.5 py-1" {...args}>
        中
      </Badge>
      <Badge className="text-base px-3 py-1.5" {...args}>
        大
      </Badge>
    </div>
  ),
};
