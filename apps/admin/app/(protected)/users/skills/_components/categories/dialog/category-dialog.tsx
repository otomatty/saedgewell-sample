'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ResponsiveDialog } from '@kit/ui/responsive-dialog';
import { CategoryForm } from './category-form';
import { categoryActions } from '@kit/next/actions';
import type { SkillCategory } from '@kit/types/skills';

interface Props {
  trigger: React.ReactNode;
  defaultValues?: SkillCategory;
}

export function CategoryDialog({ trigger, defaultValues }: Props) {
  const router = useRouter();

  const handleSubmit = async (
    values: {
      name: string;
      description: string;
    },
    close: () => void
  ) => {
    try {
      if (defaultValues) {
        await categoryActions.updateSkillCategory(defaultValues.id, values);
        toast.success('カテゴリーを更新しました');
      } else {
        await categoryActions.createSkillCategory(values);
        toast.success('カテゴリーを作成しました');
      }
      router.refresh();
      close();
    } catch (error) {
      console.error('Failed to save category:', error);
      toast.error(
        defaultValues
          ? 'カテゴリーの更新に失敗しました'
          : 'カテゴリーの作成に失敗しました'
      );
    }
  };

  return (
    <ResponsiveDialog
      trigger={trigger}
      title={defaultValues ? 'カテゴリーを編集' : 'カテゴリーを作成'}
      description={
        defaultValues
          ? '既存のカテゴリーを編集します。'
          : '新しいカテゴリーを作成します。'
      }
    >
      {({ close }) => (
        <CategoryForm
          defaultValues={defaultValues}
          onSubmit={async (values) => handleSubmit(values, close)}
          onCancel={close}
        />
      )}
    </ResponsiveDialog>
  );
}
