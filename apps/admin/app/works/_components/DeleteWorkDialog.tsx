'use client';

import { useTransition } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@kit/ui/alert-dialog';
import { toast } from 'sonner';
import { deleteWork, deleteWorks } from '@kit/next/actions';

interface DeleteWorkDialogProps {
  workId?: string;
  workIds?: string[];
  workTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteWorkDialog({
  workId,
  workIds,
  workTitle,
  isOpen,
  onClose,
}: DeleteWorkDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        if (workId) {
          await deleteWork(workId);
        } else if (workIds) {
          await deleteWorks(workIds);
        }
        toast.success('削除完了', {
          description: '実績を削除しました。',
        });
        onClose();
      } catch (error) {
        toast.error('エラー', {
          description: '実績の削除に失敗しました。',
        });
      }
    });
  };

  const getDialogTitle = () => {
    if (workTitle) {
      return `「${workTitle}」を削除します。この操作は取り消せません。`;
    }
    return `選択した${workIds?.length}件の実績を削除します。この操作は取り消せません。`;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>実績の削除</AlertDialogTitle>
          <AlertDialogDescription>{getDialogTitle()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>キャンセル</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleDelete}>
            {isPending ? '削除中...' : '削除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
