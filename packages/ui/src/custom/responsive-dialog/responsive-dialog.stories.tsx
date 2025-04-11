import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ResponsiveDialog } from './index';
import { Button } from '../../shadcn/button';

/**
 * `ResponsiveDialog`コンポーネントは、画面サイズに応じて自動的にダイアログとドロワーを切り替えるレスポンシブなダイアログコンポーネントです。
 *
 * ## 特徴
 * - デスクトップではダイアログ、モバイルではドロワーとして表示
 * - アクセシビリティ対応
 * - カスタマイズ可能なスタイル
 * - タイトルと説明の設定が可能
 *
 * ## 使用例
 * ```tsx
 * <ResponsiveDialog
 *   trigger={<Button>開く</Button>}
 *   title="ダイアログタイトル"
 *   description="ダイアログの説明文をここに記述します。"
 * >
 *   ダイアログの内容
 * </ResponsiveDialog>
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボード操作対応
 */
const meta = {
  title: 'Custom/ResponsiveDialog',
  component: ResponsiveDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ResponsiveDialogコンポーネントは、画面サイズに応じて自動的にダイアログとドロワーを切り替えるレスポンシブなダイアログコンポーネントです。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    trigger: {
      description: 'ダイアログを開くためのトリガー要素',
    },
    title: {
      control: 'text',
      description: 'ダイアログのタイトル',
    },
    description: {
      control: 'text',
      description: 'ダイアログの説明文',
    },
    className: {
      control: 'text',
      description: 'ダイアログのコンテンツに適用する追加のCSSクラス',
    },
    contentClassName: {
      control: 'text',
      description: 'ダイアログのコンテナに適用する追加のCSSクラス',
    },
    onSuccess: {
      description: 'ダイアログが閉じられた後に実行されるコールバック関数',
    },
    children: {
      description: 'ダイアログの内容（React要素または関数）',
    },
  },
} as Meta<typeof ResponsiveDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なResponsiveDialogの例です。
 */
export const Basic: Story = {
  args: {
    trigger: <Button>ダイアログを開く</Button>,
    title: 'ダイアログタイトル',
    description: 'これはダイアログの説明文です。必要な情報をここに記述します。',
    children: (
      <div className="py-4">
        <p>ダイアログの内容がここに表示されます。</p>
        <p className="mt-2">
          画面サイズに応じて、ダイアログまたはドロワーとして表示されます。
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          '基本的なResponsiveDialogの例です。トリガー、タイトル、説明文、内容を設定しています。',
      },
    },
  },
};

/**
 * 関数型の子要素を持つResponsiveDialogの例です。
 */
export const WithFunctionChildren: Story = {
  args: {
    trigger: <Button variant="outline">アクションダイアログ</Button>,
    title: '確認',
    description: 'この操作を実行してもよろしいですか？',
    children: ({ close }) => (
      <div className="py-4">
        <p>この操作は取り消すことができません。</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={close}>
            キャンセル
          </Button>
          <Button
            onClick={() => {
              alert('操作が実行されました');
              close();
            }}
          >
            実行する
          </Button>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          '関数型の子要素を持つResponsiveDialogの例です。close関数を使用してダイアログを閉じることができます。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したResponsiveDialogの例です。
 */
export const CustomStyling: Story = {
  args: {
    trigger: <Button variant="secondary">カスタムスタイル</Button>,
    title: 'カスタムスタイルダイアログ',
    description: 'カスタムスタイルを適用したダイアログの例です。',
    className: 'bg-gray-50 p-4 rounded-lg',
    contentClassName: 'border-2 border-blue-500',
    children: (
      <div className="py-4">
        <p className="text-blue-600 font-medium">
          カスタムスタイルが適用されたコンテンツです。
        </p>
        <p className="mt-2 text-gray-600">
          className と contentClassName
          を使用してスタイルをカスタマイズできます。
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したResponsiveDialogの例です。className と contentClassName を使用してスタイルをカスタマイズしています。',
      },
    },
  },
};

/**
 * 実際のユースケースでのResponsiveDialogの例です。
 */
export const UseCases: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ResponsiveDialog
        trigger={<Button>ユーザー情報</Button>}
        title="ユーザー情報"
        description="ユーザーの詳細情報を表示します。"
      >
        <div className="py-4 space-y-4">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-medium">名前</h4>
            <p className="text-sm text-gray-600">山田 太郎</p>
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-medium">メールアドレス</h4>
            <p className="text-sm text-gray-600">yamada.taro@example.com</p>
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-medium">役職</h4>
            <p className="text-sm text-gray-600">マーケティングマネージャー</p>
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-medium">部署</h4>
            <p className="text-sm text-gray-600">マーケティング部</p>
          </div>
        </div>
      </ResponsiveDialog>

      <ResponsiveDialog
        trigger={<Button variant="outline">設定</Button>}
        title="アプリケーション設定"
        description="アプリケーションの設定を変更します。"
      >
        {({ close }) => (
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">通知を有効にする</span>
              <div className="h-5 w-10 bg-gray-200 rounded-full relative">
                <div className="h-4 w-4 bg-white rounded-full absolute top-0.5 left-0.5" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ダークモード</span>
              <div className="h-5 w-10 bg-blue-500 rounded-full relative">
                <div className="h-4 w-4 bg-white rounded-full absolute top-0.5 right-0.5" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">自動保存</span>
              <div className="h-5 w-10 bg-blue-500 rounded-full relative">
                <div className="h-4 w-4 bg-white rounded-full absolute top-0.5 right-0.5" />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <Button onClick={close}>保存</Button>
            </div>
          </div>
        )}
      </ResponsiveDialog>

      <ResponsiveDialog
        trigger={<Button variant="destructive">削除</Button>}
        title="アイテムの削除"
        description="このアイテムを削除してもよろしいですか？"
      >
        {({ close }) => (
          <div className="py-4">
            <p className="text-sm text-gray-600">
              この操作は取り消すことができません。
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={close}>
                キャンセル
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  alert('アイテムが削除されました');
                  close();
                }}
              >
                削除する
              </Button>
            </div>
          </div>
        )}
      </ResponsiveDialog>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのResponsiveDialogの例です。ユーザー情報表示、設定変更、削除確認などに適しています。',
      },
    },
  },
};
