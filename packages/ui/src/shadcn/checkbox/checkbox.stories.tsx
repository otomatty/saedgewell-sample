// @ts-nocheck - Storybookの型定義の問題を回避
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './index';

/**
 * `Checkbox`コンポーネントは、ユーザーが複数の選択肢から選択できるようにするために使用されます。
 *
 * ## 特徴
 * - チェック状態（オン/オフ）をサポート
 * - 無効状態をサポート
 * - キーボードナビゲーションをサポート
 * - カスタムスタイリングが可能
 *
 * ## 使用例
 * ```tsx
 * <Checkbox id="terms" />
 * <label htmlFor="terms">利用規約に同意する</label>
 * ```
 *
 * ## アクセシビリティ
 * - キーボードでのフォーカスと操作をサポート
 * - スクリーンリーダー対応
 * - 適切なラベルと組み合わせて使用することが重要
 */
const meta = {
  title: 'Shadcn/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'チェックボックスコンポーネントは、ユーザーが複数の選択肢から選択できるようにするために使用されます。オン/オフの状態を切り替えることができます。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description:
        'チェックボックスの状態を指定します。制御コンポーネントとして使用する場合に設定します。',
      table: {
        type: { summary: 'boolean' },
      },
    },
    defaultChecked: {
      control: 'boolean',
      description:
        'チェックボックスの初期状態を指定します。非制御コンポーネントとして使用する場合に設定します。',
      table: {
        type: { summary: 'boolean' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'チェックボックスを無効にするかどうかを指定します。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'チェックボックスが必須かどうかを指定します。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    name: {
      control: 'text',
      description: 'フォーム送信時に使用される名前を指定します。',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: 'チェックボックスの値を指定します。',
      table: {
        type: { summary: 'string' },
      },
    },
    onCheckedChange: {
      description:
        'チェックボックスの状態が変更されたときに呼び出されるコールバック関数。',
      table: {
        type: { summary: 'function' },
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
} as Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なチェックボックスの例です。
 * デフォルトの外観と動作を示しています。
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '基本的なチェックボックスの例です。クリックすることで状態を切り替えることができます。',
      },
    },
  },
  render: (args) => <Checkbox {...args} />,
};

/**
 * チェック済みの状態のチェックボックスの例です。
 */
export const Checked: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'チェック済みの状態のチェックボックスです。`defaultChecked`属性を使用して初期状態を設定できます。',
      },
    },
  },
  render: (args) => <Checkbox defaultChecked {...args} />,
};

/**
 * 無効状態のチェックボックスの例です。
 * ユーザーが操作できない状態を示します。
 */
export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '無効状態のチェックボックスです。ユーザーはこのチェックボックスを操作できません。',
      },
    },
  },
  render: (args) => <Checkbox disabled {...args} />,
};

/**
 * チェック済みで無効状態のチェックボックスの例です。
 */
export const CheckedDisabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'チェック済みで無効状態のチェックボックスです。チェックされた状態で操作できません。',
      },
    },
  },
  render: (args) => <Checkbox defaultChecked disabled {...args} />,
};

/**
 * ラベル付きのチェックボックスの例です。
 * アクセシビリティのために、チェックボックスにはラベルを関連付けることが重要です。
 */
export const WithLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'ラベル付きのチェックボックスの例です。`id`属性と`htmlFor`属性を使用してラベルとチェックボックスを関連付けています。',
      },
    },
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" {...args} />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        利用規約に同意する
      </label>
    </div>
  ),
};

/**
 * フォーム内でのチェックボックスの使用例です。
 */
export const InForm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'フォーム内でのチェックボックスの使用例です。`name`属性と`value`属性を設定することで、フォーム送信時にデータを送信できます。',
      },
    },
  },
  render: (args) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        alert(`選択された項目: ${formData.getAll('items').join(', ')}`);
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="item-1" name="items" value="item-1" {...args} />
          <label htmlFor="item-1" className="text-sm font-medium leading-none">
            項目 1
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="item-2" name="items" value="item-2" {...args} />
          <label htmlFor="item-2" className="text-sm font-medium leading-none">
            項目 2
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="item-3" name="items" value="item-3" {...args} />
          <label htmlFor="item-3" className="text-sm font-medium leading-none">
            項目 3
          </label>
        </div>
      </div>
      <button
        type="submit"
        className="rounded bg-primary px-4 py-2 text-primary-foreground"
      >
        送信
      </button>
    </form>
  ),
};
