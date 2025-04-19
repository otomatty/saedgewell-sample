// @ts-nocheck - Storybookの型定義の問題を回避
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';

/**
 * `Button`コンポーネントは、ユーザーアクションをトリガーするために使用される対話型要素です。
 *
 * ## 特徴
 * - 複数のバリアント（default, destructive, outline, secondary, ghost, link）
 * - 複数のサイズ（default, sm, lg, icon）
 * - 無効状態のサポート
 * - カスタムスタイリングが可能
 * - asChildプロパティによる柔軟な要素のレンダリング
 *
 * ## 使用例
 * ```tsx
 * <Button variant="default" size="default">
 *   ボタンテキスト
 * </Button>
 * ```
 *
 * ## アクセシビリティ
 * - キーボードでのフォーカスと操作をサポート
 * - スクリーンリーダー対応
 * - 適切なコントラスト比を維持
 */
const meta = {
  title: 'Shadcn/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ボタンコンポーネントは、ユーザーアクションをトリガーするために使用される対話型要素です。複数のバリアントとサイズをサポートしています。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
      description: 'ボタンの視覚的なスタイルを指定します。',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'ボタンのサイズを指定します。',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    asChild: {
      control: 'boolean',
      description:
        '子要素をボタンの代わりにレンダリングするかどうかを指定します。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'ボタンを無効にするかどうかを指定します。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      description: 'コンポーネントに追加のクラス名を指定します。',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} as Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのボタンスタイルです。
 * 最も一般的に使用されるプライマリアクションを表します。
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトのボタンスタイルです。最も一般的に使用されるプライマリアクションを表します。',
      },
    },
  },
  args: {
    children: 'ボタン',
    variant: 'default',
    size: 'default',
  },
};

/**
 * 破壊的なアクションを表すボタンスタイルです。
 * 削除や取り消しなど、注意が必要なアクションに使用します。
 */
export const Destructive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '破壊的なアクションを表すボタンスタイルです。削除や取り消しなど、注意が必要なアクションに使用します。',
      },
    },
  },
  args: {
    children: '削除',
    variant: 'destructive',
  },
};

/**
 * 枠線付きのボタンスタイルです。
 * セカンダリアクションや、視覚的な階層を示すために使用します。
 */
export const Outline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '枠線付きのボタンスタイルです。セカンダリアクションや、視覚的な階層を示すために使用します。',
      },
    },
  },
  args: {
    children: '枠線付き',
    variant: 'outline',
  },
};

/**
 * セカンダリのボタンスタイルです。
 * 補助的なアクションや、プライマリアクションの代替として使用します。
 */
export const Secondary: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'セカンダリのボタンスタイルです。補助的なアクションや、プライマリアクションの代替として使用します。',
      },
    },
  },
  args: {
    children: 'セカンダリ',
    variant: 'secondary',
  },
};

/**
 * ゴーストボタンのスタイルです。
 * 背景色がなく、ホバー時にのみ背景が表示されます。
 * ツールバーやカード内の低い視覚的階層のアクションに適しています。
 */
export const Ghost: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'ゴーストボタンのスタイルです。背景色がなく、ホバー時にのみ背景が表示されます。ツールバーやカード内の低い視覚的階層のアクションに適しています。',
      },
    },
  },
  args: {
    children: 'ゴースト',
    variant: 'ghost',
  },
};

/**
 * リンクスタイルのボタンです。
 * テキストリンクのように表示されますが、ボタンの機能を持ちます。
 */
export const Link: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'リンクスタイルのボタンです。テキストリンクのように表示されますが、ボタンの機能を持ちます。',
      },
    },
  },
  args: {
    children: 'リンク',
    variant: 'link',
  },
};

/**
 * 小さいサイズのボタンです。
 * スペースが限られている場所や、補助的なアクションに適しています。
 */
export const Small: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '小さいサイズのボタンです。スペースが限られている場所や、補助的なアクションに適しています。',
      },
    },
  },
  args: {
    children: '小',
    size: 'sm',
  },
};

/**
 * 大きいサイズのボタンです。
 * 重要なアクションや、視覚的な強調が必要な場合に使用します。
 */
export const Large: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '大きいサイズのボタンです。重要なアクションや、視覚的な強調が必要な場合に使用します。',
      },
    },
  },
  args: {
    children: '大',
    size: 'lg',
  },
};

/**
 * 無効状態のボタンです。
 * ユーザーが操作できない状態を示します。
 */
export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: '無効状態のボタンです。ユーザーが操作できない状態を示します。',
      },
    },
  },
  args: {
    children: '無効',
    disabled: true,
  },
};

/**
 * アイコン付きのボタンの例です。
 * テキストと一緒にアイコンを表示することで、ボタンの目的を視覚的に強調します。
 */
export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'アイコン付きのボタンの例です。テキストと一緒にアイコンを表示することで、ボタンの目的を視覚的に強調します。',
      },
    },
  },
  render: (args) => (
    <Button {...args}>
      <svg
        aria-label="次へ"
        title="次へ"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
      次へ
    </Button>
  ),
};
