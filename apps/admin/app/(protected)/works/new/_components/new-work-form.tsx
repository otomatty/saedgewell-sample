'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import WorkForm from './work-form';
import { toast } from 'sonner';
import { createWork } from '~/actions/works/create-work';
import type { WorkFormData } from '~/types/works/work-form';

/**
 * @component NewWorkForm
 * @description 実績作成フォームのクライアントコンポーネント。
 * フォーム送信処理とローディング状態を管理します。
 * @returns {React.ReactElement} 新規実績作成フォームのUI。
 */
export default function NewWorkForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォーム送信時の処理を実装
  const handleSubmit = async (data: WorkFormData) => {
    setIsSubmitting(true);

    try {
      const result = await createWork(data);

      if (result.success) {
        toast.success('実績を作成しました', {
          description: result.message,
        });

        // 作成後に詳細ページまたは一覧ページに遷移
        if (result.workId) {
          router.push(`/works/${result.workId}`);
        } else {
          router.push('/works');
        }
      } else {
        toast.error('実績の作成に失敗しました', {
          description: result.message,
        });
      }
    } catch (error) {
      console.error('実績作成中にエラーが発生:', error);
      toast.error('実績の作成に失敗しました', {
        description: '予期せぬエラーが発生しました。',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <WorkForm onSubmit={handleSubmit} isLoading={isSubmitting} />;
}
