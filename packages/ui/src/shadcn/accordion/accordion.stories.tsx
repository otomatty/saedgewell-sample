// @ts-nocheck - Storybookの型定義の問題を回避
import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './index';

/**
 * `Accordion`コンポーネントは、コンテンツを折りたたみ可能なセクションに整理するために使用されます。
 *
 * ## 特徴
 * - 単一項目または複数項目の展開をサポート（type="single" または type="multiple"）
 * - 単一項目モードでは、collapsible属性で全項目を閉じることが可能
 * - defaultValue属性で初期状態で開く項目を指定可能
 * - カスタムスタイリングが可能
 *
 * ## 使用例
 * ```tsx
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>タイトル</AccordionTrigger>
 *     <AccordionContent>コンテンツ</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 *
 * ## アクセシビリティ
 * - キーボードナビゲーションをサポート
 * - 適切なARIA属性が自動的に設定される
 * - スクリーンリーダー対応
 */
const meta = {
  title: 'Shadcn/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'アコーディオンコンポーネントは、限られたスペースで多くの情報を整理して表示するために使用されます。ユーザーは必要な情報のみを展開して閲覧できます。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      description:
        'アコーディオンの動作モード。"single"は一度に1つの項目のみ開くことができ、"multiple"は複数の項目を同時に開くことができます。',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'single' },
      },
    },
    collapsible: {
      control: 'boolean',
      description:
        'type="single"の場合に、すべての項目を閉じることができるかどうかを指定します。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultValue: {
      description: '初期状態で開く項目のvalue値を指定します。',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      description:
        '現在開いている項目のvalue値を指定します（制御コンポーネントとして使用する場合）。',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    onValueChange: {
      description:
        '項目の開閉状態が変更されたときに呼び出されるコールバック関数。',
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
} as Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 単一項目のアコーディオンの例です。
 * 最もシンプルな使用例で、1つの折りたたみ可能なセクションを表示します。
 */
export const SingleItem: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '最もシンプルなアコーディオンの例です。単一の項目を持ち、クリックで開閉できます。`collapsible`属性により、開いた項目を再度クリックして閉じることができます。',
      },
    },
  },
  render: (args) => (
    <Accordion type="single" collapsible {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>アコーディオンアイテム 1</AccordionTrigger>
        <AccordionContent>
          アコーディオンの内容がここに表示されます。クリックすると開閉します。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * 複数項目を持つアコーディオンの例です。
 * 複数の折りたたみ可能なセクションを表示しますが、一度に開けるのは1つだけです。
 */
export const MultipleItems: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '複数の項目を持つアコーディオンです。`type="single"`の場合、一度に1つの項目のみ開くことができます。ある項目を開くと、他の開いていた項目は自動的に閉じられます。',
      },
    },
  },
  render: (args) => (
    <Accordion type="single" collapsible className="w-full max-w-md" {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>アコーディオンアイテム 1</AccordionTrigger>
        <AccordionContent>
          1つ目のアイテムの内容です。クリックすると開閉します。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>アコーディオンアイテム 2</AccordionTrigger>
        <AccordionContent>
          2つ目のアイテムの内容です。クリックすると開閉します。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>アコーディオンアイテム 3</AccordionTrigger>
        <AccordionContent>
          3つ目のアイテムの内容です。クリックすると開閉します。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * 複数項目を同時に開くことができるアコーディオンの例です。
 * `type="multiple"`を指定することで、複数の項目を同時に開くことができます。
 */
export const MultipleExpanded: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`type="multiple"`を指定すると、複数の項目を同時に開くことができます。各項目は独立して開閉します。',
      },
    },
  },
  render: (args) => (
    <Accordion type="multiple" className="w-full max-w-md" {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>アコーディオンアイテム 1</AccordionTrigger>
        <AccordionContent>
          複数のアイテムを同時に開くことができます。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>アコーディオンアイテム 2</AccordionTrigger>
        <AccordionContent>
          複数のアイテムを同時に開くことができます。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>アコーディオンアイテム 3</AccordionTrigger>
        <AccordionContent>
          複数のアイテムを同時に開くことができます。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * カスタムスタイルを適用したアコーディオンの例です。
 * Tailwind CSSのクラスを使用して、アコーディオンの外観をカスタマイズできます。
 */
export const CustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'カスタムクラス名を使用して、アコーディオンのスタイルをカスタマイズできます。この例では、青い枠線、青いテキスト、青い背景色を適用しています。',
      },
    },
  },
  render: (args) => (
    <Accordion type="single" collapsible className="w-full max-w-md" {...args}>
      <AccordionItem value="item-1" className="border-b-2 border-blue-500">
        <AccordionTrigger className="text-blue-600 hover:text-blue-800">
          カスタムスタイルのアコーディオン
        </AccordionTrigger>
        <AccordionContent className="bg-blue-50 p-2 rounded-b">
          カスタムクラス名を使用してスタイルをカスタマイズできます。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * 初期状態で特定の項目が開いているアコーディオンの例です。
 * `defaultValue`属性を使用して、初期状態で開く項目を指定できます。
 */
export const WithDefaultValue: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`defaultValue`属性を使用して、初期状態で開く項目を指定できます。この例では、2番目の項目（value="item-2"）が初期状態で開いています。',
      },
    },
  },
  render: (args) => (
    <Accordion
      type="single"
      defaultValue="item-2"
      className="w-full max-w-md"
      {...args}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>アコーディオンアイテム 1</AccordionTrigger>
        <AccordionContent>
          このアイテムは初期状態では閉じています。
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          アコーディオンアイテム 2 (デフォルトで開く)
        </AccordionTrigger>
        <AccordionContent>
          このアイテムは初期状態で開いています。
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
