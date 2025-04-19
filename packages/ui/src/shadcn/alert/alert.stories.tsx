// @ts-nocheck - Storybookの型定義の問題を回避
import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from './index';

/**
 * `Alert`コンポーネントは、ユーザーに重要な情報を伝えるために使用されます。
 *
 * ## 特徴
 * - 2種類のバリアント（default, destructive）をサポート
 * - タイトルと説明文を含めることが可能
 * - アイコンや追加のコンテンツを含めることが可能
 * - カスタムクラス名でスタイルをカスタマイズ可能
 *
 * ## 使用例
 * ```tsx
 * <Alert>
 *   <AlertTitle>注意</AlertTitle>
 *   <AlertDescription>重要なメッセージです。</AlertDescription>
 * </Alert>
 * ```
 *
 * ## アクセシビリティ
 * - role="alert"属性が自動的に設定されます
 * - アイコンを使用する場合は、適切なaria属性を設定してください
 */
const meta = {
  title: 'Shadcn/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'アラートコンポーネントは、ユーザーに重要な情報を伝えるために使用されます。様々なバリエーションとカスタマイズオプションを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description:
        'アラートの種類を指定します。"default"は通常の情報、"destructive"は警告や危険を示します。',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    className: {
      description: 'コンポーネントに追加のクラス名を指定します。',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      description:
        'アラート内に表示するコンテンツ。テキスト、AlertTitle、AlertDescription、またはその他の要素を含めることができます。',
      control: { type: 'text' },
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
} as Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なアラートの例です。
 * シンプルなテキストメッセージのみを表示します。
 */
export const Default: Story = {
  args: {
    children: 'これは基本的なアラートです',
    variant: 'default',
  },
};

/**
 * 警告用のアラートの例です。
 * 重要な警告や注意を促す情報に使用します。
 */
export const Destructive: Story = {
  args: {
    children: 'これは警告アラートです',
    variant: 'destructive',
  },
};

/**
 * タイトルと説明文を含むアラートの例です。
 * 階層構造を持った情報を表示する場合に使用します。
 */
export const WithTitleAndDescription: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'タイトルと説明文を含むアラートは、より構造化された情報を提供します。`AlertTitle`と`AlertDescription`コンポーネントを使用して実装します。',
      },
    },
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>注意</AlertTitle>
      <AlertDescription>
        これはタイトルと説明文を含むアラートメッセージです。
      </AlertDescription>
    </Alert>
  ),
};

/**
 * 警告用のアラートにタイトルと説明文を含めた例です。
 * 重要な警告情報を構造化して表示する場合に使用します。
 */
export const DestructiveWithTitleAndDescription: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '警告用のアラートにタイトルと説明文を含めることで、重要な警告情報をより明確に伝えることができます。',
      },
    },
  },
  render: (args) => (
    <Alert variant="destructive" {...args}>
      <AlertTitle>警告</AlertTitle>
      <AlertDescription>
        これは重要な警告メッセージです。注意して対応してください。
      </AlertDescription>
    </Alert>
  ),
};

/**
 * カスタムクラス名を使用してスタイルをカスタマイズした例です。
 * Tailwind CSSのクラスを使用して、アラートの外観をカスタマイズできます。
 */
export const WithCustomClassName: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'カスタムクラス名を使用して、アラートのスタイルをカスタマイズできます。この例では、青い枠線と薄い青の背景色を適用しています。',
      },
    },
  },
  render: (args) => (
    <Alert className="border-blue-500 bg-blue-50" {...args}>
      <AlertTitle>カスタムスタイル</AlertTitle>
      <AlertDescription>
        カスタムクラス名を使用してスタイルをカスタマイズできます。
      </AlertDescription>
    </Alert>
  ),
};

/**
 * アイコンを含むアラートの例です。
 * 視覚的な手がかりを提供することで、メッセージの意図をより明確に伝えることができます。
 */
export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'アイコンを含めることで、アラートの意図をより視覚的に伝えることができます。アイコンは適切なアクセシビリティ属性を設定することが重要です。',
      },
    },
  },
  render: (args) => (
    <Alert {...args}>
      <svg
        aria-label="情報"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <AlertTitle>情報</AlertTitle>
      <AlertDescription>
        アイコンを含めることで視覚的な手がかりを提供できます。
      </AlertDescription>
    </Alert>
  ),
};
