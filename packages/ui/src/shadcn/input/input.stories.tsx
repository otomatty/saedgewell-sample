import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Input } from './index';
import { Label } from '../label';
import { Search, Mail, Lock, Eye, EyeOff } from 'lucide-react';

/**
 * `Input`コンポーネントは、ユーザーからテキスト入力を受け取るためのコンポーネントです。
 *
 * ## 特徴
 * - 様々な入力タイプ（text, email, password, number, etc.）をサポート
 * - ラベルとの連携
 * - 無効状態と読み取り専用状態
 * - エラー状態のスタイリング
 * - アイコンとの組み合わせ
 *
 * ## 使用例
 * ```tsx
 * <Input type="email" placeholder="メールアドレス" />
 * ```
 *
 * ## アクセシビリティ
 * - ラベルとの適切な関連付け（id と htmlFor）
 * - 適切なARIA属性のサポート
 * - キーボードナビゲーション対応
 */
const meta = {
  title: 'Shadcn/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Inputコンポーネントは、ユーザーからテキスト入力を受け取るためのコンポーネントです。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: '入力フィールドのタイプ',
    },
    placeholder: {
      control: 'text',
      description: 'プレースホルダーテキスト',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
    readOnly: {
      control: 'boolean',
      description: '読み取り専用状態',
    },
  },
} as Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

/**
 * 基本的な入力フィールドの例です。
 */
export const Basic: Story = {
  args: {
    type: 'text',
    placeholder: 'テキストを入力',
  },
  parameters: {
    docs: {
      description: {
        story: '基本的なテキスト入力フィールドです。',
      },
    },
  },
};

/**
 * ラベル付きの入力フィールドの例です。
 */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="name">名前</Label>
      <Input type="text" id="name" placeholder="山田太郎" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'ラベルと関連付けられた入力フィールドです。アクセシビリティのために重要です。',
      },
    },
  },
};

/**
 * 異なるタイプの入力フィールドの例です。
 */
export const InputTypes: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="email">メールアドレス</Label>
        <Input type="email" id="email" placeholder="example@example.com" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password">パスワード</Label>
        <Input type="password" id="password" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="number">数値</Label>
        <Input type="number" id="number" placeholder="0" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="tel">電話番号</Label>
        <Input type="tel" id="tel" placeholder="090-1234-5678" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '様々なタイプの入力フィールドを示しています。用途に応じて適切なタイプを選択してください。',
      },
    },
  },
};

/**
 * 無効状態の入力フィールドの例です。
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '無効状態',
    defaultValue: '編集できません',
  },
  parameters: {
    docs: {
      description: {
        story: '無効状態の入力フィールドです。ユーザーは編集できません。',
      },
    },
  },
};

/**
 * 読み取り専用状態の入力フィールドの例です。
 */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: '読み取り専用のテキスト',
  },
  parameters: {
    docs: {
      description: {
        story:
          '読み取り専用状態の入力フィールドです。ユーザーは編集できませんが、テキストを選択できます。',
      },
    },
  },
};

/**
 * エラー状態の入力フィールドの例です。
 */
export const WithError: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (!newValue) {
        setError('メールアドレスは必須です');
      } else if (!/\S+@\S+\.\S+/.test(newValue)) {
        setError('有効なメールアドレスを入力してください');
      } else {
        setError('');
      }
    };

    return (
      <div className="grid w-full max-w-sm gap-1.5">
        <Label htmlFor="email-error">メールアドレス</Label>
        <Input
          type="email"
          id="email-error"
          value={value}
          onChange={handleChange}
          placeholder="example@example.com"
          className={error ? 'border-red-500' : ''}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'エラー状態の入力フィールドです。バリデーションエラーがある場合に使用します。',
      },
    },
  },
};

/**
 * アイコン付きの入力フィールドの例です。
 */
export const WithIcon: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input type="search" placeholder="検索..." className="pl-8" />
      </div>
      <div className="relative">
        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input type="email" placeholder="メールアドレス" className="pl-8" />
      </div>
      <div className="relative">
        <Input type="password" placeholder="パスワード" className="pr-8" />
        <Lock className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'アイコンと組み合わせた入力フィールドです。視覚的な手がかりを提供します。',
      },
    },
  },
};

/**
 * パスワード表示切り替え機能付きの入力フィールドの例です。
 */
export const PasswordToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative w-full max-w-sm">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="パスワードを入力"
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-hidden"
          aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'パスワードの表示/非表示を切り替えられる入力フィールドです。',
      },
    },
  },
};

/**
 * カスタムスタイルの入力フィールドの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <Input
        type="text"
        placeholder="プライマリカラー"
        className="border-blue-500 focus:ring-blue-500"
      />
      <Input
        type="text"
        placeholder="成功"
        className="border-green-500 focus:ring-green-500"
      />
      <Input
        type="text"
        placeholder="警告"
        className="border-yellow-500 focus:ring-yellow-500"
      />
      <Input
        type="text"
        placeholder="エラー"
        className="border-red-500 focus:ring-red-500"
      />
      <Input type="text" placeholder="丸みを帯びた" className="rounded-full" />
      <Input type="text" placeholder="シャドウ付き" className="shadow-lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tailwind CSSを使用してカスタマイズした入力フィールドです。',
      },
    },
  },
};

/**
 * フォーム内の複数の入力フィールドの例です。
 */
export const FormExample: Story = {
  render: () => (
    <form className="w-full max-w-md space-y-4 rounded-lg border p-4 shadow-2xs">
      <h2 className="text-xl font-bold">アカウント登録</h2>
      <div className="grid gap-1.5">
        <Label htmlFor="full-name">氏名</Label>
        <Input id="full-name" placeholder="山田太郎" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="form-email">メールアドレス</Label>
        <Input type="email" id="form-email" placeholder="example@example.com" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="form-password">パスワード</Label>
        <Input type="password" id="form-password" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="form-confirm-password">パスワード（確認）</Label>
        <Input type="password" id="form-confirm-password" />
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
        story: 'フォーム内での入力フィールドの使用例です。',
      },
    },
  },
};
