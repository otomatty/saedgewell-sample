'use client';

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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { categoryActions } from '@kit/next/actions';
import type { SkillCategory } from '@kit/types/skills';

interface Props {
  category: SkillCategory;
  trigger: React.ReactNode;
}

export function DeleteCategoryDialog({ category, trigger }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await categoryActions.deleteSkillCategory(category.id);
      toast.success('カテゴリーを削除しました');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('カテゴリーの削除に失敗しました');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>カテゴリーの削除</AlertDialogTitle>
          <AlertDialogDescription>
            「{category.name}」を削除してもよろしいですか？
            <br />
            この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
