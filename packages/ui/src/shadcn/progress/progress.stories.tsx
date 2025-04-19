import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Progress } from './index';

/**
 * `Progress`コンポーネントは、タスクの進行状況や読み込み状態を視覚的に表示するためのコンポーネントです。
 *
 * ## 特徴
 * - アクセシビリティ対応
 * - カスタマイズ可能なスタイル
 * - 様々な進行状況の表示に対応
 *
 * ## 使用例
 * ```tsx
 * <Progress value={60} />
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - スクリーンリーダー対応
 */
const meta = {
  title: 'Shadcn/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Progressコンポーネントは、タスクの進行状況や読み込み状態を視覚的に表示するためのコンポーネントです。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: '進行状況の値（0〜100）',
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
  },
} as Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なProgressの例です。
 */
export const Basic: Story = {
  args: {
    value: 40,
  },
  parameters: {
    docs: {
      description: {
        story: '基本的なProgressの例です。値は40%に設定されています。',
      },
    },
  },
};

/**
 * 異なる進行状況の値を持つProgressの例です。
 */
export const DifferentValues: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div className="space-y-1">
        <div className="text-sm font-medium">0%</div>
        <Progress value={0} />
      </div>
      <div className="space-y-1">
        <div className="text-sm font-medium">25%</div>
        <Progress value={25} />
      </div>
      <div className="space-y-1">
        <div className="text-sm font-medium">50%</div>
        <Progress value={50} />
      </div>
      <div className="space-y-1">
        <div className="text-sm font-medium">75%</div>
        <Progress value={75} />
      </div>
      <div className="space-y-1">
        <div className="text-sm font-medium">100%</div>
        <Progress value={100} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '異なる進行状況の値（0%、25%、50%、75%、100%）を持つProgressの例です。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したProgressの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <div className="space-y-1">
        <div className="text-sm font-medium">デフォルト</div>
        <Progress value={60} />
      </div>

      <div className="space-y-1">
        <div className="text-sm font-medium text-blue-700">青色テーマ</div>
        <Progress value={60} className="h-2 bg-blue-100 [&>div]:bg-blue-600" />
      </div>

      <div className="space-y-1">
        <div className="text-sm font-medium text-green-700">緑色テーマ</div>
        <Progress
          value={60}
          className="h-2 bg-green-100 [&>div]:bg-green-600"
        />
      </div>

      <div className="space-y-1">
        <div className="text-sm font-medium text-amber-700">黄色テーマ</div>
        <Progress
          value={60}
          className="h-2 bg-amber-100 [&>div]:bg-amber-600"
        />
      </div>

      <div className="space-y-1">
        <div className="text-sm font-medium text-red-700">赤色テーマ</div>
        <Progress value={60} className="h-2 bg-red-100 [&>div]:bg-red-600" />
      </div>

      <div className="space-y-1">
        <div className="text-sm font-medium">高さの変更</div>
        <Progress value={60} className="h-4" />
      </div>

      <div className="space-y-1">
        <div className="text-sm font-medium">角丸の調整</div>
        <Progress value={60} className="h-3 rounded-none" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したProgressの例です。色、高さ、角丸などをカスタマイズしています。',
      },
    },
  },
};

/**
 * アニメーションするProgressの例です。
 */
export const Animated: Story = {
  render: function AnimatedProgress() {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setProgress(progress >= 100 ? 0 : progress + 10);
      }, 500);

      return () => clearTimeout(timer);
    }, [progress]);

    return (
      <div className="w-80 space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>読み込み中...</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'アニメーションするProgressの例です。0%から100%まで自動的に進行します。',
      },
    },
  },
};

/**
 * ラベル付きProgressの例です。
 */
export const WithLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>ダウンロード中</span>
          <span>45%</span>
        </div>
        <Progress value={45} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>アップロード中</span>
          <span>72%</span>
        </div>
        <Progress value={72} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>インストール中</span>
          <span>90%</span>
        </div>
        <Progress value={90} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'ラベル付きProgressの例です。進行状況の説明とパーセンテージを表示しています。',
      },
    },
  },
};

/**
 * 実際のユースケースでのProgressの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-md">
      <div className="p-4 border rounded-lg space-y-4">
        <h3 className="font-medium">ファイルアップロード</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>document.pdf</span>
            <span>75%</span>
          </div>
          <Progress value={75} />
          <div className="text-xs text-muted-foreground">3.5MB / 4.7MB</div>
        </div>
      </div>

      <div className="p-4 border rounded-lg space-y-4">
        <h3 className="font-medium">プロフィール完了度</h3>
        <div className="space-y-2">
          <Progress
            value={60}
            className="h-2 bg-blue-100 [&>div]:bg-blue-600"
          />
          <div className="flex justify-between text-sm">
            <span className="text-blue-700">60% 完了</span>
            <span className="text-muted-foreground">あと2項目</span>
          </div>
        </div>
        <div className="text-sm">
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>プロフィール画像を追加</li>
            <li>連絡先情報を入力</li>
          </ul>
        </div>
      </div>

      <div className="p-4 border rounded-lg space-y-4">
        <h3 className="font-medium">ステップ進行状況</h3>
        <div className="space-y-2">
          <Progress value={66.6} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>ステップ 2/3</span>
            <span>支払い情報</span>
          </div>
        </div>
        <div className="flex justify-between text-sm pt-2">
          <div className="flex gap-2">
            <span className="text-green-600">✓ アカウント</span>
            <span className="font-medium">• 支払い</span>
          </div>
          <span className="text-muted-foreground">• 確認</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのProgressの例です。ファイルアップロード、プロフィール完了度、ステップ進行状況などに適しています。',
      },
    },
  },
};
