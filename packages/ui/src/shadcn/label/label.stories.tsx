import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Label } from './index';
import { Input } from '../input';
import { Checkbox } from '../checkbox';
import { RadioGroup, RadioGroupItem } from '../radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { Switch } from '../switch';

/**
 * `Label`コンポーネントは、フォーム要素に関連付けるラベルを提供します。
 *
 * ## 特徴
 * - アクセシビリティ対応
 * - フォーム要素との適切な関連付け
 * - カスタマイズ可能なスタイル
 *
 * ## 使用例
 * ```tsx
 * <Label htmlFor="email">メールアドレス</Label>
 * <Input id="email" type="email" />
 * ```
 *
 * ## アクセシビリティ
 * - htmlFor属性を使用して関連するフォーム要素と関連付け
 * - スクリーンリーダー対応
 */
const meta = {
  title: 'Shadcn/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Labelコンポーネントは、フォーム要素に関連付けるラベルを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'ラベルのテキスト',
    },
    htmlFor: {
      control: 'text',
      description: '関連付けるフォーム要素のID',
    },
    className: {
      control: 'text',
      description: '追加のクラス名',
    },
  },
} as Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof Label>;

/**
 * 基本的なLabelの例です。
 */
export const Basic: Story = {
  args: {
    children: 'ラベルテキスト',
    htmlFor: 'example',
  },
  parameters: {
    docs: {
      description: {
        story:
          '基本的なラベルの例です。htmlFor属性を使用して関連するフォーム要素と関連付けます。',
      },
    },
  },
};

/**
 * 入力フィールドと組み合わせたLabelの例です。
 */
export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">メールアドレス</Label>
      <Input type="email" id="email" placeholder="example@example.com" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '入力フィールドと組み合わせたラベルの例です。アクセシビリティのために重要です。',
      },
    },
  },
};

/**
 * チェックボックスと組み合わせたLabelの例です。
 */
export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">利用規約に同意する</Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'チェックボックスと組み合わせたラベルの例です。ラベルをクリックするとチェックボックスの状態が切り替わります。',
      },
    },
  },
};

/**
 * ラジオボタンと組み合わせたLabelの例です。
 */
export const WithRadioGroup: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">オプション1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">オプション2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="option-three" />
        <Label htmlFor="option-three">オプション3</Label>
      </div>
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'ラジオボタンと組み合わせたラベルの例です。ラベルをクリックするとラジオボタンが選択されます。',
      },
    },
  },
};

/**
 * セレクトボックスと組み合わせたLabelの例です。
 */
export const WithSelect: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="framework">フレームワーク</Label>
      <Select>
        <SelectTrigger id="framework">
          <SelectValue placeholder="フレームワークを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'セレクトボックスと組み合わせたラベルの例です。',
      },
    },
  },
};

/**
 * スイッチと組み合わせたLabelの例です。
 */
export const WithSwitch: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">機内モード</Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'スイッチと組み合わせたラベルの例です。ラベルをクリックするとスイッチの状態が切り替わります。',
      },
    },
  },
};

/**
 * 必須フィールドを示すLabelの例です。
 */
export const RequiredField: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="username" className="flex items-center">
        ユーザー名
        <span className="text-red-500 ml-1">*</span>
      </Label>
      <Input id="username" required />
      <p className="text-xs text-gray-500">
        必須フィールドは * で示されています
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '必須フィールドを示すラベルの例です。アスタリスク（*）を使用して必須フィールドを示しています。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したLabelの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="custom1" className="text-blue-500 font-bold">
          青色のラベル
        </Label>
        <Input id="custom1" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label
          htmlFor="custom2"
          className="text-lg text-green-600 uppercase tracking-wide"
        >
          大きいラベル
        </Label>
        <Input id="custom2" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="custom3" className="flex items-center text-purple-600">
          <span className="mr-2">🔒</span>
          アイコン付きラベル
        </Label>
        <Input id="custom3" type="password" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したラベルの例です。色、サイズ、アイコンなどをカスタマイズできます。',
      },
    },
  },
};

/**
 * フォーム内の複数のラベルの例です。
 */
export const FormExample: Story = {
  render: () => (
    <form className="w-full max-w-md space-y-4 rounded-lg border p-4 shadow-2xs">
      <h2 className="text-xl font-bold">ユーザー登録</h2>
      <div className="grid gap-1.5">
        <Label htmlFor="form-name">氏名</Label>
        <Input id="form-name" placeholder="山田太郎" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="form-email">メールアドレス</Label>
        <Input type="email" id="form-email" placeholder="example@example.com" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="form-password">パスワード</Label>
        <Input type="password" id="form-password" />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="form-terms" />
        <Label htmlFor="form-terms">利用規約に同意する</Label>
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        登録
      </button>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'フォーム内の複数のラベルの例です。実際のフォームでの使用例を示しています。',
      },
    },
  },
};
