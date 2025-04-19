'use client'; // ダイアログの開閉状態とアクション実行のため

/**
 * @file 確認ダイアログコンポーネント。
 * @description 削除などの破壊的な操作を実行する前にユーザーに確認を求めます。
 * shadcn/ui/alert-dialog を利用します。
 */

import type React from 'react';
import { useState, useTransition } from 'react';
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
} from '@kit/ui/alert-dialog';
import { Button } from '@kit/ui/button';
import { toast } from 'sonner'; // 通知用
import { cn } from '@kit/ui/utils';
import { Loader2 } from 'lucide-react'; // ローディングアイコン

/**
 * ConfirmationDialog コンポーネントの Props
 */
interface ConfirmationDialogProps {
  /** ダイアログを開くトリガーとなる要素 (例: ボタン) */
  trigger: React.ReactNode;
  /** ダイアログのタイトル */
  title: string;
  /** 確認メッセージ */
  description: string;
  /** 確認ボタンのテキスト (デフォルト: '実行') */
  confirmText?: string;
  /** キャンセルボタンのテキスト (デフォルト: 'キャンセル') */
  cancelText?: string;
  /** 確認ボタンが押されたときの非同期処理 */
  onConfirm: () => Promise<void>;
  /** 確認ボタンを破壊的なスタイルにするか (デフォルト: true) */
  isDestructive?: boolean;
  /** トリガー要素の追加CSSクラス */
  triggerClassName?: string;
}

/**
 * 破壊的な操作の前に確認を求めるダイアログコンポーネント。
 * shadcn/ui の AlertDialog を使用します。
 */
const ConfirmationDialog = ({
  trigger,
  title,
  description,
  confirmText = '実行',
  cancelText = 'キャンセル',
  onConfirm,
  isDestructive = true,
  triggerClassName,
}: ConfirmationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition(); // 非同期処理中のローディング状態

  const handleConfirm = async () => {
    startTransition(async () => {
      try {
        await onConfirm();
        setOpen(false); // 成功したらダイアログを閉じる
        // toast.success('操作が完了しました。'); // 成功通知は呼び出し元で行うことが多い
      } catch (error) {
        console.error('Confirmation failed:', error); // error-handling-guidelines
        toast.error('操作に失敗しました。詳細はコンソールを確認してください。');
        // エラー発生時もダイアログは閉じない方が良い場合がある
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild className={triggerClassName}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className={cn(
              isDestructive &&
                'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            )}
            // variant={isDestructive ? 'destructive' : 'default'} // variant プロパティを使う場合はclassNameでの色指定は不要かも
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
