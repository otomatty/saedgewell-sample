import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ScrollArea } from './index';

/**
 * `ScrollArea`コンポーネントは、コンテンツがオーバーフローした場合にカスタムスクロールバーを表示するコンポーネントです。
 *
 * ## 特徴
 * - カスタマイズ可能なスクロールバー
 * - 垂直・水平方向のスクロールに対応
 * - アクセシビリティ対応
 * - スタイリングのカスタマイズが可能
 *
 * ## 使用例
 * ```tsx
 * <ScrollArea className="h-[200px] w-[350px]">
 *   <div className="p-4">
 *     スクロール可能なコンテンツ
 *   </div>
 * </ScrollArea>
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボード操作対応
 */
const meta = {
  title: 'Shadcn/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ScrollAreaコンポーネントは、コンテンツがオーバーフローした場合にカスタムスクロールバーを表示するコンポーネントです。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
    children: {
      description: 'スクロール可能なコンテンツ',
    },
  },
} as Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なScrollAreaの例です。
 */
export const Basic: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      <div className="space-y-4">
        <h4 className="text-sm font-medium">スクロール可能なコンテンツ</h4>
        <p className="text-sm text-muted-foreground">
          このコンテンツは高さが制限されており、スクロールバーが表示されます。
        </p>
        <p className="text-sm text-muted-foreground">
          ScrollAreaコンポーネントは、コンテンツがオーバーフローした場合にカスタムスクロールバーを表示します。
        </p>
        <p className="text-sm text-muted-foreground">
          このスクロールバーは、ブラウザのデフォルトスクロールバーよりも美しく、カスタマイズ可能です。
        </p>
        <p className="text-sm text-muted-foreground">
          また、すべてのブラウザで一貫した外観を提供します。
        </p>
        <p className="text-sm text-muted-foreground">
          ScrollAreaコンポーネントは、Radix
          UIのScrollAreaプリミティブを使用しています。
        </p>
        <p className="text-sm text-muted-foreground">
          アクセシビリティにも配慮されており、キーボード操作にも対応しています。
        </p>
        <p className="text-sm text-muted-foreground">
          スクロールバーのスタイルは、テーマに合わせてカスタマイズすることができます。
        </p>
      </div>
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '基本的なScrollAreaの例です。高さが制限されたコンテナ内でコンテンツをスクロールできます。',
      },
    },
  },
};

/**
 * 長いコンテンツを持つScrollAreaの例です。
 */
export const LongContent: Story = {
  render: () => (
    <ScrollArea className="h-[300px] w-[400px] rounded-md border p-4">
      <div className="space-y-8">
        <div>
          <h4 className="mb-2 text-sm font-medium">セクション 1</h4>
          <p className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis
            aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam
            ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
          </p>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium">セクション 2</h4>
          <p className="text-sm text-muted-foreground">
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
            ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
            egestas semper.
          </p>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium">セクション 3</h4>
          <p className="text-sm text-muted-foreground">
            Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque
            sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi,
            condimentum sed, commodo vitae, ornare sit amet, wisi.
          </p>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium">セクション 4</h4>
          <p className="text-sm text-muted-foreground">
            Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent
            dapibus, neque id cursus faucibus, tortor neque egestas augue, eu
            vulputate magna eros eu erat. Aliquam erat volutpat.
          </p>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium">セクション 5</h4>
          <p className="text-sm text-muted-foreground">
            Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus,
            metus. Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec
            consectetuer ligula vulputate sem tristique cursus.
          </p>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium">セクション 6</h4>
          <p className="text-sm text-muted-foreground">
            Sed adipiscing ornare risus. Morbi est est, blandit sit amet,
            sagittis vel, euismod vel, velit. Pellentesque egestas sem.
            Suspendisse commodo ullamcorper magna.
          </p>
        </div>
      </div>
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '長いコンテンツを持つScrollAreaの例です。複数のセクションを含む長いコンテンツをスクロールできます。',
      },
    },
  },
};

/**
 * カスタムスタイルを適用したScrollAreaの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <ScrollArea className="h-[250px] w-[350px] rounded-md bg-gray-50 p-6 shadow-md">
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-blue-700">
          カスタムスタイルの例
        </h3>
        <p className="text-sm text-gray-700">
          ScrollAreaコンポーネントは、classNameプロパティを使用してスタイルをカスタマイズすることができます。
        </p>
        <p className="text-sm text-gray-700">
          この例では、背景色、パディング、シャドウなどをカスタマイズしています。
        </p>
        <p className="text-sm text-gray-700">
          また、テキストのスタイルもカスタマイズしています。
        </p>
        <p className="text-sm text-gray-700">
          スクロールバーのスタイルは、テーマに合わせて自動的に調整されます。
        </p>
        <p className="text-sm text-gray-700">
          必要に応じて、スクロールバーのスタイルもカスタマイズすることができます。
        </p>
      </div>
    </ScrollArea>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したScrollAreaの例です。背景色、パディング、シャドウなどをカスタマイズしています。',
      },
    },
  },
};

/**
 * 実際のユースケースでのScrollAreaの例です。
 */
export const UseCases: Story = {
  render: () => {
    // チャットメッセージの配列を作成
    const messages = [
      { id: 'msg1', isUser: true, text: 'こんにちは！今日はどうですか？' },
      {
        id: 'msg2',
        isUser: false,
        text: '元気です！新しいプロジェクトに取り組んでいます。',
      },
      {
        id: 'msg3',
        isUser: true,
        text: 'それは素晴らしいですね！どんなプロジェクトですか？',
      },
      {
        id: 'msg4',
        isUser: false,
        text: 'UIコンポーネントライブラリを開発しています。',
      },
      { id: 'msg5', isUser: true, text: '興味深いですね。進捗はどうですか？' },
      {
        id: 'msg6',
        isUser: false,
        text: '順調です。基本的なコンポーネントはほぼ完成しました。',
      },
      { id: 'msg7', isUser: true, text: 'デモを見せてもらえますか？' },
      {
        id: 'msg8',
        isUser: false,
        text: 'もちろん、来週までには準備できると思います。',
      },
      { id: 'msg9', isUser: true, text: '楽しみにしています！' },
      {
        id: 'msg10',
        isUser: false,
        text: 'ありがとうございます。他に質問はありますか？',
      },
      {
        id: 'msg11',
        isUser: true,
        text: '今のところはありません。また連絡します。',
      },
      { id: 'msg12', isUser: false, text: 'わかりました。それではまた！' },
      { id: 'msg13', isUser: true, text: 'さようなら！' },
      { id: 'msg14', isUser: false, text: 'さようなら！良い一日を！' },
      { id: 'msg15', isUser: true, text: 'あなたも良い一日を！' },
    ];

    // メニュー項目の配列
    const menuItems = [
      { id: 'dashboard', label: 'ダッシュボード' },
      { id: 'projects', label: 'プロジェクト' },
      { id: 'tasks', label: 'タスク' },
      { id: 'calendar', label: 'カレンダー' },
      { id: 'messages', label: 'メッセージ' },
      { id: 'notifications', label: '通知' },
      { id: 'settings', label: '設定' },
      { id: 'help', label: 'ヘルプ' },
      { id: 'feedback', label: 'フィードバック' },
      { id: 'logout', label: 'ログアウト' },
    ];

    return (
      <div className="flex flex-col gap-8">
        {/* チャットウィンドウの例 */}
        <div className="w-[350px] rounded-md border shadow-2xs">
          <div className="border-b p-3">
            <h3 className="font-medium">チャット</h3>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="mt-1 text-xs opacity-70">
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t p-3">
            <div className="flex rounded-md border">
              <input
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-hidden"
                placeholder="メッセージを入力..."
              />
              <button
                type="button"
                className="rounded-r-md bg-blue-500 px-3 py-2 text-sm text-white"
              >
                送信
              </button>
            </div>
          </div>
        </div>

        {/* サイドバーメニューの例 */}
        <div className="w-[250px] rounded-md border shadow-2xs">
          <div className="border-b p-3">
            <h3 className="font-medium">メニュー</h3>
          </div>
          <ScrollArea className="h-[200px]">
            <div className="p-2">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                >
                  {item.label}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '実際のユースケースでのScrollAreaの例です。チャットウィンドウとサイドバーメニューの例を示しています。',
      },
    },
  },
};
