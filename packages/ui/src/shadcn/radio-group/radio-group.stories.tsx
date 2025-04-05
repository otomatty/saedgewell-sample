import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { RadioGroup, RadioGroupItem } from './index';
import { Label } from '../label';

/**
 * `RadioGroup`コンポーネントは、関連するラジオボタンをグループ化するためのコンポーネントです。
 * ユーザーが複数の選択肢から1つだけを選択する必要がある場合に使用します。
 *
 * ## 特徴
 * - アクセシビリティ対応
 * - カスタマイズ可能なスタイル
 * - フォーム連携
 * - キーボードナビゲーション
 *
 * ## 使用例
 * ```tsx
 * <RadioGroup defaultValue="option-1">
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="option-1" id="option-1" />
 *     <Label htmlFor="option-1">オプション1</Label>
 *   </div>
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="option-2" id="option-2" />
 *     <Label htmlFor="option-2">オプション2</Label>
 *   </div>
 * </RadioGroup>
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボードナビゲーション対応
 * - スクリーンリーダー対応
 */
const meta = {
  title: 'Shadcn/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'RadioGroupコンポーネントは、関連するラジオボタンをグループ化するためのコンポーネントです。ユーザーが複数の選択肢から1つだけを選択する必要がある場合に使用します。',
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
      action: 'changed',
      description: '値が変更されたときに呼び出されるコールバック',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態を設定',
    },
    required: {
      control: 'boolean',
      description: '必須項目として設定',
    },
    name: {
      control: 'text',
      description: 'フォーム送信時に使用される名前',
    },
  },
} as Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なRadioGroupの例です。
 */
export const Basic: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1">オプション1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="option-2" />
        <Label htmlFor="option-2">オプション2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="option-3" />
        <Label htmlFor="option-3">オプション3</Label>
      </div>
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '基本的なRadioGroupの例です。3つの選択肢があり、デフォルトで「オプション1」が選択されています。',
      },
    },
  },
};

/**
 * ラベル付きRadioGroupの例です。
 */
export const WithLabels: Story = {
  render: () => (
    <div className="space-y-3">
      <div>
        <h4 className="mb-2 text-sm font-medium">通知設定を選択してください</h4>
        <RadioGroup defaultValue="all">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">すべての通知</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="important" id="important" />
            <Label htmlFor="important">重要な通知のみ</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none">通知なし</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'ラベル付きRadioGroupの例です。グループにタイトルが付いています。',
      },
    },
  },
};

/**
 * 水平レイアウトのRadioGroupの例です。
 */
export const HorizontalLayout: Story = {
  render: () => (
    <div className="space-y-3">
      <div>
        <h4 className="mb-2 text-sm font-medium">表示モード</h4>
        <RadioGroup defaultValue="light" className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">ライトモード</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">ダークモード</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <Label htmlFor="system">システム設定に合わせる</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '水平レイアウトのRadioGroupの例です。選択肢が横並びに表示されます。',
      },
    },
  },
};

/**
 * 無効状態のRadioGroupの例です。
 */
export const Disabled: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium">グループ全体が無効</h4>
        <RadioGroup defaultValue="option-1" disabled>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-1" id="disabled-1" />
            <Label htmlFor="disabled-1" className="text-muted-foreground">
              オプション1
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-2" id="disabled-2" />
            <Label htmlFor="disabled-2" className="text-muted-foreground">
              オプション2
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium">一部のアイテムが無効</h4>
        <RadioGroup defaultValue="option-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-1" id="partially-1" />
            <Label htmlFor="partially-1">オプション1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-2" id="partially-2" disabled />
            <Label htmlFor="partially-2" className="text-muted-foreground">
              オプション2（無効）
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-3" id="partially-3" />
            <Label htmlFor="partially-3">オプション3</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '無効状態のRadioGroupの例です。グループ全体を無効にする場合と、特定のアイテムのみを無効にする場合の両方を示しています。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したRadioGroupの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium text-blue-700">
          カスタムカラー
        </h4>
        <RadioGroup defaultValue="option-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="option-1"
              id="custom-1"
              className="border-blue-400 text-blue-600 focus:ring-blue-400"
            />
            <Label htmlFor="custom-1" className="text-blue-700">
              ブルーオプション
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="option-2"
              id="custom-2"
              className="border-green-400 text-green-600 focus:ring-green-400"
            />
            <Label htmlFor="custom-2" className="text-green-700">
              グリーンオプション
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="option-3"
              id="custom-3"
              className="border-amber-400 text-amber-600 focus:ring-amber-400"
            />
            <Label htmlFor="custom-3" className="text-amber-700">
              アンバーオプション
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium">カスタムサイズ</h4>
        <RadioGroup defaultValue="small">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="size-1" className="h-4 w-4" />
            <Label htmlFor="size-1">小</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="medium"
              id="size-2"
              // デフォルトサイズ
            />
            <Label htmlFor="size-2">中</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" id="size-3" className="h-6 w-6" />
            <Label htmlFor="size-3">大</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したRadioGroupの例です。色やサイズをカスタマイズしています。',
      },
    },
  },
};

/**
 * フォーム内でのRadioGroupの使用例です。
 */
export const InForm: Story = {
  render: function RadioGroupInForm() {
    const [selectedPlan, setSelectedPlan] = React.useState('basic');

    return (
      <div className="w-full max-w-md p-6 border rounded-lg space-y-6">
        <div>
          <h3 className="text-lg font-medium">プラン選択</h3>
          <p className="text-sm text-muted-foreground">
            ニーズに合ったプランをお選びください
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            alert(`選択されたプラン: ${selectedPlan}`);
          }}
        >
          <RadioGroup
            value={selectedPlan}
            onValueChange={setSelectedPlan}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="basic" id="plan-1" className="mt-1" />
              <div>
                <Label htmlFor="plan-1" className="font-medium">
                  ベーシック
                </Label>
                <p className="text-sm text-muted-foreground">
                  基本機能のみ。個人利用に最適。
                </p>
                <p className="text-sm font-medium mt-1">¥1,000/月</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="pro" id="plan-2" className="mt-1" />
              <div>
                <Label htmlFor="plan-2" className="font-medium">
                  プロフェッショナル
                </Label>
                <p className="text-sm text-muted-foreground">
                  高度な機能を含む。小規模チームに最適。
                </p>
                <p className="text-sm font-medium mt-1">¥3,000/月</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="enterprise" id="plan-3" className="mt-1" />
              <div>
                <Label htmlFor="plan-3" className="font-medium">
                  エンタープライズ
                </Label>
                <p className="text-sm text-muted-foreground">
                  すべての機能とカスタムサポート。大規模組織向け。
                </p>
                <p className="text-sm font-medium mt-1">¥10,000/月</p>
              </div>
            </div>
          </RadioGroup>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            プランを選択する
          </button>
        </form>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'フォーム内でのRadioGroupの使用例です。プラン選択フォームとして実装しています。',
      },
    },
  },
};

/**
 * 実際のユースケースでのRadioGroupの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="space-y-8 w-full max-w-md">
      <div className="p-4 border rounded-lg space-y-4">
        <h3 className="font-medium">配送方法</h3>
        <RadioGroup defaultValue="standard">
          <div className="flex items-start space-x-3 p-2 border rounded-md hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="standard" id="shipping-1" className="mt-1" />
            <div>
              <Label htmlFor="shipping-1" className="font-medium">
                標準配送
              </Label>
              <p className="text-sm text-muted-foreground">3-5営業日</p>
              <p className="text-sm font-medium">無料</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2 border rounded-md hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="express" id="shipping-2" className="mt-1" />
            <div>
              <Label htmlFor="shipping-2" className="font-medium">
                速達配送
              </Label>
              <p className="text-sm text-muted-foreground">1-2営業日</p>
              <p className="text-sm font-medium">¥800</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2 border rounded-md hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="same-day" id="shipping-3" className="mt-1" />
            <div>
              <Label htmlFor="shipping-3" className="font-medium">
                当日配送
              </Label>
              <p className="text-sm text-muted-foreground">
                本日中（14時までの注文）
              </p>
              <p className="text-sm font-medium">¥1,500</p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="p-4 border rounded-lg space-y-4">
        <h3 className="font-medium">支払い方法</h3>
        <RadioGroup defaultValue="credit-card">
          <div className="flex items-center space-x-2 p-2">
            <RadioGroupItem value="credit-card" id="payment-1" />
            <Label htmlFor="payment-1">クレジットカード</Label>
          </div>

          <div className="flex items-center space-x-2 p-2">
            <RadioGroupItem value="bank-transfer" id="payment-2" />
            <Label htmlFor="payment-2">銀行振込</Label>
          </div>

          <div className="flex items-center space-x-2 p-2">
            <RadioGroupItem value="convenience-store" id="payment-3" />
            <Label htmlFor="payment-3">コンビニ決済</Label>
          </div>

          <div className="flex items-center space-x-2 p-2">
            <RadioGroupItem value="pay-later" id="payment-4" disabled />
            <Label htmlFor="payment-4" className="text-muted-foreground">
              後払い（現在利用できません）
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのRadioGroupの例です。配送方法や支払い方法の選択に適しています。',
      },
    },
  },
};
