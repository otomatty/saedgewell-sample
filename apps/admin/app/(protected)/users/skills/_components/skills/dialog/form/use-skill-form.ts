'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Skill } from '@kit/types/skills';
// サーバーアクションを直接インポートしない
// import { skillActions } from '@kit/next/actions';
import type { ManualSkillFormData } from './manual-skill-form';

// 入力データと更新データの型
export type SkillCreateData = Omit<ManualSkillFormData, 'started_at'> & {
  started_at: string;
};
export type SkillUpdateData = SkillCreateData & { id: string };

interface UseSkillFormProps {
  skill?: Skill;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onCreateSkill?: (data: SkillCreateData) => Promise<Skill>;
  onUpdateSkill?: (data: SkillUpdateData) => Promise<Skill>;
}

export function useSkillForm({
  skill,
  onSuccess,
  onError,
  onCreateSkill,
  onUpdateSkill,
}: UseSkillFormProps = {}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ManualSkillFormData) => {
    try {
      setIsSubmitting(true);

      const formattedData: SkillCreateData = {
        ...values,
        started_at: values.started_at.toISOString(),
      };

      console.log('送信するデータ:', formattedData);

      if (skill) {
        // 更新処理
        const updateData: SkillUpdateData = {
          id: skill.id,
          ...formattedData,
        };
        console.log('更新処理を実行:', updateData);

        if (onUpdateSkill) {
          await onUpdateSkill(updateData);
        } else {
          throw new Error('更新アクションが設定されていません');
        }
      } else {
        // 新規作成処理
        console.log('新規作成処理を実行:', formattedData);

        if (onCreateSkill) {
          await onCreateSkill(formattedData);
        } else {
          throw new Error('作成アクションが設定されていません');
        }
      }

      // 成功時の処理
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error('スキルの保存に失敗:', error);
      if (error instanceof Error) {
        console.error('エラーの詳細:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }
      onError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
}
