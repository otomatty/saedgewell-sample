'use client';

import { ResponsiveDialog } from '@kit/ui/responsive-dialog';
import { SkillForm } from './skill-form';
import type { SkillCategory } from '@kit/types/skills';
import type { z } from 'zod';
import type { formSchema } from './skill-form';
import { Button } from '@kit/ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import type { SkillCreateData } from './form/use-skill-form';
import type { Skill } from '@kit/types/skills';

type FormData = z.infer<typeof formSchema>;

interface CreateSkillDialogProps {
  categories: SkillCategory[];
  onSubmit: (values: FormData) => Promise<void>;
  onCreateSkill?: (data: SkillCreateData) => Promise<Skill>;
}

/**
 * スキル作成ダイアログ
 * @description ResponsiveDialogを使用して、スキル作成フォームを表示するダイアログコンポーネント
 */
export function CreateSkillDialog({
  categories,
  onSubmit,
  onCreateSkill,
}: CreateSkillDialogProps) {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (values: FormData) => {
    await onSubmit(values);
    setIsSuccess(true);
  };

  return (
    <ResponsiveDialog
      title="スキルを追加"
      description="新しいスキルを追加します"
      trigger={
        <Button>
          <PlusIcon className="h-4 w-4" />
          スキルを追加
        </Button>
      }
      onSuccess={() => setIsSuccess(false)}
    >
      {({ close }) => (
        <SkillForm
          categories={categories}
          onCreateSkill={onCreateSkill}
          onSuccess={() => {
            setIsSuccess(true);
            close();
          }}
          onCancel={close}
        />
      )}
    </ResponsiveDialog>
  );
}
