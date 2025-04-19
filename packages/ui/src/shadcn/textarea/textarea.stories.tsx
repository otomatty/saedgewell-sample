import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Textarea } from './index';

/**
 * `Textarea`コンポーネントは、複数行のテキスト入力フィールドを提供します。
 *
 * ## 特徴
 * - 複数行のテキスト入力
 * - カスタマイズ可能なスタイル
 * - プレースホルダーテキスト
 * - アクセシビリティ対応
 *
 * ## 使用例
 * ```tsx
 * <Textarea
 *   placeholder="テキストを入力してください"
 *   className="min-h-[100px]"
 * />
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボード操作対応
 * - スクリーンリーダーで適切に読み上げられる
 */
const meta = {
  title: 'Shadcn/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Textareaコンポーネントは、複数行のテキスト入力フィールドを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'プレースホルダーテキスト',
    },
    disabled: {
      control: 'boolean',
      description: '無効化状態',
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
} as Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なTextareaの例です。
 */
export const Basic: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <Textarea placeholder="テキストを入力してください" />
      <div className="text-sm text-muted-foreground">
        基本的なTextareaの例です。プレースホルダーテキストを表示しています。
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '基本的なTextareaの例です。プレースホルダーテキストを表示しています。',
      },
    },
  },
};

/**
 * 無効化状態のTextareaの例です。
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <Textarea
        placeholder="テキストを入力してください"
        disabled
        value="このテキストエリアは無効化されています。"
      />
      <div className="text-sm text-muted-foreground">
        無効化状態のTextareaの例です。入力ができない状態を示しています。
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '無効化状態のTextareaの例です。入力ができない状態を示しています。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したTextareaの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-8">
      {/* 青色のテキストエリア */}
      <div className="w-[400px] space-y-4">
        <Textarea
          placeholder="青色のテキストエリア"
          className="border-blue-500 focus-visible:ring-blue-500"
        />
        <div className="text-sm text-muted-foreground">
          青色のボーダーとフォーカスリングを持つテキストエリアです。
        </div>
      </div>

      {/* 緑色のテキストエリア */}
      <div className="w-[400px] space-y-4">
        <Textarea
          placeholder="緑色のテキストエリア"
          className="border-green-500 focus-visible:ring-green-500"
        />
        <div className="text-sm text-muted-foreground">
          緑色のボーダーとフォーカスリングを持つテキストエリアです。
        </div>
      </div>

      {/* 大きなテキストエリア */}
      <div className="w-[400px] space-y-4">
        <Textarea
          placeholder="大きなテキストエリア"
          className="min-h-[200px]"
        />
        <div className="text-sm text-muted-foreground">
          高さを200pxに設定した大きなテキストエリアです。
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したTextareaの例です。className プロパティを使用して色やサイズをカスタマイズしています。',
      },
    },
  },
};

/**
 * 実際のユースケースでのTextareaの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="space-y-8">
      {/* お問い合わせフォームの例 */}
      <div>
        <h4 className="text-sm font-medium mb-4">お問い合わせフォーム</h4>
        <div className="w-[400px] space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              メッセージ
            </label>
            <Textarea
              id="message"
              placeholder="お問い合わせ内容を入力してください"
              className="min-h-[150px]"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            お問い合わせフォームでのTextareaの使用例です。
          </div>
        </div>
      </div>

      {/* 商品レビューの例 */}
      <div>
        <h4 className="text-sm font-medium mb-4">商品レビュー</h4>
        <div className="w-[400px] space-y-4">
          <div>
            <label htmlFor="review" className="block text-sm font-medium mb-2">
              レビュー内容
            </label>
            <Textarea
              id="review"
              placeholder="商品のレビューを入力してください"
              className="min-h-[100px]"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            商品レビューでのTextareaの使用例です。
          </div>
        </div>
      </div>

      {/* メモアプリの例 */}
      <div>
        <h4 className="text-sm font-medium mb-4">メモアプリ</h4>
        <div className="w-[400px] space-y-4">
          <div>
            <label htmlFor="note" className="block text-sm font-medium mb-2">
              メモ内容
            </label>
            <Textarea
              id="note"
              placeholder="メモを入力してください"
              className="min-h-[300px]"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            メモアプリでのTextareaの使用例です。
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのTextareaの例です。お問い合わせフォーム、商品レビュー、メモアプリの例を示しています。',
      },
    },
  },
};
