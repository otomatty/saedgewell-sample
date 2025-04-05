// @ts-nocheck - Storybookの型定義の問題を回避
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './index';
import { Button } from '../button';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * `Collapsible`コンポーネントは、コンテンツを折りたたみ可能な形式で表示するために使用されます。
 *
 * ## 特徴
 * - コンテンツの表示/非表示を切り替え可能
 * - トリガー要素とコンテンツ要素を提供
 * - アニメーション対応
 * - アクセシビリティに配慮した実装
 *
 * ## 使用例
 * ```tsx
 * <Collapsible>
 *   <CollapsibleTrigger>詳細を表示</CollapsibleTrigger>
 *   <CollapsibleContent>折りたたまれたコンテンツ</CollapsibleContent>
 * </Collapsible>
 * ```
 *
 * ## アクセシビリティ
 * - キーボードでのフォーカスと操作をサポート
 * - スクリーンリーダー対応
 * - 適切なARIA属性を使用
 */
const meta = {
  title: 'Shadcn/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'コラプシブルコンポーネントは、コンテンツを折りたたみ可能な形式で表示するために使用されます。ユーザーがトリガーをクリックすることで、コンテンツの表示/非表示を切り替えることができます。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description:
        'コラプシブルの開閉状態を指定します。制御コンポーネントとして使用する場合に設定します。',
      table: {
        type: { summary: 'boolean' },
      },
    },
    defaultOpen: {
      control: 'boolean',
      description:
        'コラプシブルの初期状態を指定します。非制御コンポーネントとして使用する場合に設定します。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onOpenChange: {
      description:
        'コラプシブルの状態が変更されたときに呼び出されるコールバック関数。',
      table: {
        type: { summary: 'function' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'コラプシブルを無効にするかどうかを指定します。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} as Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なコラプシブルの例です。
 * シンプルなトリガーとコンテンツを持つコラプシブルを示しています。
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '基本的なコラプシブルの例です。トリガーをクリックすることで、コンテンツの表示/非表示を切り替えることができます。',
      },
    },
  },
  render: (args) => (
    <Collapsible className="w-[350px] space-y-2" {...args}>
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">詳細情報</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">詳細を表示/非表示</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          折りたたまれたコンテンツです。このコンテンツはトリガーをクリックすることで表示/非表示を切り替えることができます。
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

/**
 * 制御されたコラプシブルの例です。
 * 状態を外部から制御することができます。
 */
export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '制御されたコラプシブルの例です。状態を外部から制御することができます。',
      },
    },
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="space-y-4 w-[350px]">
        <div className="flex justify-end">
          <Button onClick={() => setIsOpen(!isOpen)} variant="outline">
            {isOpen ? '閉じる' : '開く'}
          </Button>
        </div>
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full space-y-2 border rounded-md p-4"
          {...args}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">制御されたコラプシブル</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">詳細を表示/非表示</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
              このコラプシブルは外部の状態によって制御されています。
              上部のボタンまたはこのコンポーネント内のトリガーをクリックすることで開閉できます。
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
};

/**
 * アコーディオンスタイルのコラプシブルの例です。
 * 複数のコラプシブルを組み合わせてアコーディオンを作成できます。
 */
export const Accordion: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'アコーディオンスタイルのコラプシブルの例です。複数のコラプシブルを組み合わせてアコーディオンを作成できます。',
      },
    },
  },
  render: (args) => (
    <div className="w-[350px] space-y-2 border rounded-md p-4">
      {[1, 2, 3].map((item) => (
        <Collapsible
          key={item}
          className="w-full border-b pb-2 last:border-b-0 last:pb-0"
          {...args}
        >
          <div className="flex items-center justify-between py-2">
            <h4 className="text-sm font-semibold">セクション {item}</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">セクション {item} を表示/非表示</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="pb-2">
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
              セクション {item}{' '}
              のコンテンツです。このコンテンツはトリガーをクリックすることで表示/非表示を切り替えることができます。
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  ),
};

/**
 * カスタムスタイルのコラプシブルの例です。
 * 見た目をカスタマイズしたコラプシブルを示しています。
 */
export const CustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルのコラプシブルの例です。見た目をカスタマイズしたコラプシブルを示しています。',
      },
    },
  },
  render: (args) => (
    <Collapsible
      className="w-[350px] rounded-md border border-primary"
      {...args}
    >
      <CollapsibleTrigger asChild>
        <Button
          className="w-full justify-between rounded-t-md rounded-b-none"
          variant="default"
        >
          <span>カスタムスタイルのコラプシブル</span>
          <ChevronDown className="h-4 w-4 transition-transform duration-200 [&[data-state=open]>svg]:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-primary-foreground p-4 text-primary rounded-b-md">
        <p className="mb-2">カスタムスタイルが適用されたコンテンツです。</p>
        <p>
          コラプシブルコンポーネントは高度にカスタマイズ可能で、さまざまなデザインに適応できます。
        </p>
      </CollapsibleContent>
    </Collapsible>
  ),
};
