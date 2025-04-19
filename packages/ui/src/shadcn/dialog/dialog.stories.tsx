import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { useState } from 'react';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from './index';

/**
 * `Dialog`コンポーネントは、ユーザーの注意を引くためのモーダルダイアログを提供します。
 *
 * ## 特徴
 * - アクセシブルなモーダルダイアログ
 * - キーボードナビゲーション
 * - フォーカストラップ
 * - アニメーション効果
 *
 * ## 使用例
 * ```tsx
 * <Dialog>
 *   <DialogTrigger>ダイアログを開く</DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>タイトル</DialogTitle>
 *       <DialogDescription>説明文をここに記述します。</DialogDescription>
 *     </DialogHeader>
 *     <div>ダイアログの内容</div>
 *     <DialogFooter>
 *       <Button>アクション</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 *
 * ## アクセシビリティ
 * - WAI-ARIA準拠
 * - キーボードナビゲーション対応
 * - スクリーンリーダー対応
 */
const meta = {
  title: 'Shadcn/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Dialogコンポーネントは、ユーザーの注意を引くためのモーダルダイアログを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Dialogの子要素',
      control: false,
    },
  },
} as Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なダイアログの例です。
 */
export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>基本的なダイアログ</DialogTitle>
          <DialogDescription>
            これは基本的なダイアログの例です。閉じるには「X」ボタンをクリックするか、ESCキーを押してください。
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          ダイアログの内容をここに配置します。テキスト、画像、フォームなど、様々なコンテンツを表示できます。
        </div>
        <DialogFooter>
          <Button type="submit">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * フォームを含むダイアログの例です。
 */
export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">フォームを開く</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>プロフィール編集</DialogTitle>
          <DialogDescription>
            プロフィール情報を更新します。完了したら保存ボタンをクリックしてください。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              名前
            </Label>
            <Input id="name" defaultValue="山田太郎" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              ユーザー名
            </Label>
            <Input
              id="username"
              defaultValue="yamada_taro"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * 確認ダイアログの例です。
 */
export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">アカウント削除</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>アカウント削除の確認</DialogTitle>
          <DialogDescription>
            本当にアカウントを削除しますか？この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          アカウントを削除すると、すべてのデータが完全に削除され、復元できなくなります。
        </div>
        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <Button variant="destructive">削除する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * カスタムスタイルを適用したダイアログの例です。
 */
export const CustomStyling: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">カスタムダイアログ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 text-white border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">カスタムスタイル</DialogTitle>
          <DialogDescription className="text-slate-400">
            ダイアログにカスタムスタイルを適用した例です。
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-slate-300">
          Tailwind CSSを使用して、ダイアログの外観をカスタマイズできます。
          背景色、テキスト色、ボーダーなど、様々なスタイルを変更できます。
        </div>
        <DialogFooter>
          <Button className="bg-blue-600 hover:bg-blue-700">完了</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * 状態を管理するダイアログの例です。
 */
export const WithState: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">状態管理ダイアログ</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>状態管理</DialogTitle>
            <DialogDescription>
              Reactの状態を使用してダイアログの開閉を制御できます。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            このダイアログはReactの状態（useState）によって制御されています。
            プログラムによる開閉や、特定の条件での開閉が可能です。
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};
