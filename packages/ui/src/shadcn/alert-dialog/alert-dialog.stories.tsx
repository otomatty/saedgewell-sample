import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './index';

/**
 * `AlertDialog`コンポーネントは、ユーザーに重要な情報を伝え、確認を求めるためのモーダルダイアログです。
 *
 * ## 特徴
 * - 破壊的な操作の前に確認を求める
 * - キーボードナビゲーションとスクリーンリーダーに対応
 * - レスポンシブデザイン
 * - カスタマイズ可能なコンテンツとアクション
 *
 * ## 使用例
 * ```tsx
 * <AlertDialog>
 *   <AlertDialogTrigger asChild>
 *     <Button variant="destructive">削除</Button>
 *   </AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
 *       <AlertDialogDescription>
 *         この操作は元に戻せません。このデータはサーバーから完全に削除されます。
 *       </AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>キャンセル</AlertDialogCancel>
 *       <AlertDialogAction>削除</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 *
 * ## アクセシビリティ
 * - フォーカストラップ
 * - WAI-ARIA準拠
 * - キーボードナビゲーション（Escキーでの閉じる機能を含む）
 */
const meta = {
  title: 'Shadcn/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AlertDialogコンポーネントは、ユーザーに重要な情報を伝え、確認を求めるためのモーダルダイアログです。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'AlertDialogの子要素',
      control: false,
    },
  },
} as Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なAlertDialogの例です。
 * 削除操作の確認を求めるダイアログを表示します。
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '基本的なAlertDialogの例です。削除操作の確認を求めるダイアログを表示します。',
      },
    },
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">アイテムを削除</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は元に戻せません。このデータはサーバーから完全に削除されます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction>削除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * アカウント削除の確認ダイアログの例です。
 * より重大な操作に対する警告を表示します。
 */
export const AccountDeletion: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'アカウント削除の確認ダイアログの例です。より重大な操作に対する警告を表示します。',
      },
    },
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">アカウントを削除</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>アカウントを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は元に戻せません。アカウントを削除すると、すべてのデータが失われます。
            <br />
            <br />
            削除を確認するには、以下のボタンをクリックしてください。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            アカウントを完全に削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * 設定変更の確認ダイアログの例です。
 * 非破壊的な操作に対する確認を表示します。
 */
export const SettingsChange: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '設定変更の確認ダイアログの例です。非破壊的な操作に対する確認を表示します。',
      },
    },
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>設定を変更</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>設定を変更しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この設定を変更すると、アプリケーションの動作が変わる可能性があります。
            変更後も設定画面から元に戻すことができます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction>変更を適用</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * カスタムスタイルのAlertDialogの例です。
 * ダイアログのスタイルをカスタマイズしています。
 */
export const CustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルのAlertDialogの例です。ダイアログのスタイルをカスタマイズしています。',
      },
    },
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">カスタムダイアログを開く</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-primary/20 bg-background/95 backdrop-blur-xs">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-primary">
            カスタムスタイル
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            カスタムスタイルを適用したAlertDialogの例です。
            背景のぼかし効果やカラースキームをカスタマイズしています。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-primary/20 hover:bg-primary/10">
            閉じる
          </AlertDialogCancel>
          <AlertDialogAction className="bg-primary/80 hover:bg-primary">
            確認
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * 長いコンテンツを持つAlertDialogの例です。
 * スクロール可能なコンテンツを表示します。
 */
export const LongContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '長いコンテンツを持つAlertDialogの例です。スクロール可能なコンテンツを表示します。',
      },
    },
  },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>利用規約を表示</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>利用規約</AlertDialogTitle>
          <AlertDialogDescription className="max-h-[50vh] overflow-y-auto text-left">
            <div className="space-y-4">
              <p>
                以下の利用規約（以下「本規約」）は、当社が提供するサービス（以下「本サービス」）の利用条件を定めるものです。
              </p>
              <h3 className="text-base font-semibold">第1条（適用）</h3>
              <p>
                本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。
              </p>
              <h3 className="text-base font-semibold">第2条（利用登録）</h3>
              <p>
                登録希望者が当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
              </p>
              <h3 className="text-base font-semibold">
                第3条（ユーザーIDおよびパスワードの管理）
              </h3>
              <p>
                ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
              </p>
              <h3 className="text-base font-semibold">第4条（禁止事項）</h3>
              <p>
                ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
              </p>
              <ul className="list-disc pl-5">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>
                  当社、本サービスの他のユーザー、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
                </li>
                <li>当社のサービスの運営を妨害するおそれのある行為</li>
                <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                <li>不正アクセスをし、またはこれを試みる行為</li>
                <li>他のユーザーに成りすます行為</li>
                <li>
                  当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
                </li>
                <li>その他、当社が不適切と判断する行為</li>
              </ul>
              <h3 className="text-base font-semibold">
                第5条（本サービスの提供の停止等）
              </h3>
              <p>
                当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>閉じる</AlertDialogCancel>
          <AlertDialogAction>同意する</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
