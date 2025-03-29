import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from './index';

/**
 * `Select`コンポーネントは、ユーザーが複数の選択肢から1つを選ぶためのドロップダウンコンポーネントです。
 *
 * ## 特徴
 * - アクセシビリティ対応
 * - カスタマイズ可能なスタイル
 * - グループ化とラベル付けが可能
 * - キーボード操作対応
 *
 * ## 使用例
 * ```tsx
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="選択してください" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">オプション1</SelectItem>
 *     <SelectItem value="option2">オプション2</SelectItem>
 *     <SelectItem value="option3">オプション3</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボード操作対応
 * - スクリーンリーダー対応
 */
const meta = {
  title: 'Shadcn/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Selectコンポーネントは、ユーザーが複数の選択肢から1つを選ぶためのドロップダウンコンポーネントです。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'デフォルトで選択される値',
    },
    value: {
      control: 'text',
      description: '現在選択されている値',
    },
    onValueChange: {
      description: '値が変更されたときに呼び出されるコールバック関数',
    },
    disabled: {
      control: 'boolean',
      description: 'コンポーネントを無効化するかどうか',
    },
    name: {
      control: 'text',
      description: 'フォーム送信時に使用される名前',
    },
  },
} as Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なSelectの例です。
 */
export const Basic: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="テーマを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">ライト</SelectItem>
        <SelectItem value="dark">ダーク</SelectItem>
        <SelectItem value="system">システム</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '基本的なSelectの例です。シンプルな選択肢を持つドロップダウンを表示します。',
      },
    },
  },
};

/**
 * グループ化されたSelectの例です。
 */
export const Grouped: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="フルーツを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>果物</SelectLabel>
          <SelectItem value="apple">りんご</SelectItem>
          <SelectItem value="banana">バナナ</SelectItem>
          <SelectItem value="orange">オレンジ</SelectItem>
          <SelectItem value="grape">ぶどう</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>野菜</SelectLabel>
          <SelectItem value="carrot">にんじん</SelectItem>
          <SelectItem value="potato">じゃがいも</SelectItem>
          <SelectItem value="onion">たまねぎ</SelectItem>
          <SelectItem value="tomato">トマト</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'グループ化されたSelectの例です。選択肢をカテゴリごとにグループ化しています。',
      },
    },
  },
};

/**
 * 無効化されたSelectの例です。
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Select disabled>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="無効化された選択肢" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">オプション1</SelectItem>
          <SelectItem value="option2">オプション2</SelectItem>
          <SelectItem value="option3">オプション3</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="一部無効化された選択肢" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">オプション1</SelectItem>
          <SelectItem value="option2" disabled>
            オプション2 (無効)
          </SelectItem>
          <SelectItem value="option3">オプション3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '無効化されたSelectの例です。コンポーネント全体または特定の選択肢を無効化できます。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したSelectの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Select>
        <SelectTrigger className="w-[200px] border-blue-500 bg-blue-50 text-blue-700">
          <SelectValue placeholder="青色テーマ" />
        </SelectTrigger>
        <SelectContent className="border-blue-500 bg-blue-50">
          <SelectItem
            value="option1"
            className="text-blue-700 focus:bg-blue-100 focus:text-blue-800"
          >
            オプション1
          </SelectItem>
          <SelectItem
            value="option2"
            className="text-blue-700 focus:bg-blue-100 focus:text-blue-800"
          >
            オプション2
          </SelectItem>
          <SelectItem
            value="option3"
            className="text-blue-700 focus:bg-blue-100 focus:text-blue-800"
          >
            オプション3
          </SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[200px] rounded-full border-green-500 bg-green-50 text-green-700">
          <SelectValue placeholder="緑色テーマ (丸型)" />
        </SelectTrigger>
        <SelectContent className="border-green-500 bg-green-50 rounded-lg">
          <SelectItem
            value="option1"
            className="text-green-700 focus:bg-green-100 focus:text-green-800"
          >
            オプション1
          </SelectItem>
          <SelectItem
            value="option2"
            className="text-green-700 focus:bg-green-100 focus:text-green-800"
          >
            オプション2
          </SelectItem>
          <SelectItem
            value="option3"
            className="text-green-700 focus:bg-green-100 focus:text-green-800"
          >
            オプション3
          </SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[200px] border-2 border-amber-500 bg-white text-amber-700 shadow-md">
          <SelectValue placeholder="アンバーテーマ (影付き)" />
        </SelectTrigger>
        <SelectContent className="border-amber-500 bg-white shadow-lg">
          <SelectItem
            value="option1"
            className="text-amber-700 focus:bg-amber-100 focus:text-amber-800"
          >
            オプション1
          </SelectItem>
          <SelectItem
            value="option2"
            className="text-amber-700 focus:bg-amber-100 focus:text-amber-800"
          >
            オプション2
          </SelectItem>
          <SelectItem
            value="option3"
            className="text-amber-700 focus:bg-amber-100 focus:text-amber-800"
          >
            オプション3
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したSelectの例です。色、形状、影などをカスタマイズしています。',
      },
    },
  },
};

/**
 * 実際のユースケースでのSelectの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-md">
      {/* フォームの例 */}
      <div className="space-y-4 p-4 border rounded-md">
        <h3 className="text-lg font-medium">ユーザー設定</h3>

        <div className="space-y-2">
          <label htmlFor="language" className="text-sm font-medium">
            言語
          </label>
          <Select>
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="言語を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="ko">한국어</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="timezone" className="text-sm font-medium">
            タイムゾーン
          </label>
          <Select>
            <SelectTrigger id="timezone" className="w-full">
              <SelectValue placeholder="タイムゾーンを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asia-tokyo">アジア/東京 (GMT+9)</SelectItem>
              <SelectItem value="america-newyork">
                アメリカ/ニューヨーク (GMT-5)
              </SelectItem>
              <SelectItem value="europe-london">
                ヨーロッパ/ロンドン (GMT+0)
              </SelectItem>
              <SelectItem value="australia-sydney">
                オーストラリア/シドニー (GMT+11)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="theme" className="text-sm font-medium">
            テーマ
          </label>
          <Select defaultValue="system">
            <SelectTrigger id="theme" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">ライト</SelectItem>
              <SelectItem value="dark">ダーク</SelectItem>
              <SelectItem value="system">システム設定に合わせる</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* フィルタリングの例 */}
      <div className="space-y-4 p-4 border rounded-md">
        <h3 className="text-lg font-medium">商品フィルター</h3>

        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              カテゴリ
            </label>
            <Select>
              <SelectTrigger id="category" className="w-[180px]">
                <SelectValue placeholder="カテゴリ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="electronics">電化製品</SelectItem>
                <SelectItem value="clothing">衣類</SelectItem>
                <SelectItem value="books">書籍</SelectItem>
                <SelectItem value="food">食品</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              価格帯
            </label>
            <Select>
              <SelectTrigger id="price" className="w-[180px]">
                <SelectValue placeholder="価格帯" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="under-1000">1,000円未満</SelectItem>
                <SelectItem value="1000-5000">1,000円〜5,000円</SelectItem>
                <SelectItem value="5000-10000">5,000円〜10,000円</SelectItem>
                <SelectItem value="over-10000">10,000円以上</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="sort" className="text-sm font-medium">
              並び替え
            </label>
            <Select>
              <SelectTrigger id="sort" className="w-[180px]">
                <SelectValue placeholder="並び替え" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">関連度順</SelectItem>
                <SelectItem value="price-asc">価格の安い順</SelectItem>
                <SelectItem value="price-desc">価格の高い順</SelectItem>
                <SelectItem value="newest">新着順</SelectItem>
                <SelectItem value="popular">人気順</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのSelectの例です。ユーザー設定フォームと商品フィルタリングの例を示しています。',
      },
    },
  },
};
