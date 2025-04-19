import { createBlogCategory } from '@kit/next/actions';
import { revalidatePath } from 'next/cache';
import { CategoryFormClient } from './category-form-client';

interface CategoryCreateFormProps {
  onSuccess?: () => void;
}

/**
 * カテゴリー作成フォームのサーバーコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Function} props.onSuccess - 作成成功時のコールバック関数
 * @returns {JSX.Element} カテゴリー作成フォームのUI
 */
export default function CategoryCreateForm({
  onSuccess,
}: CategoryCreateFormProps) {
  async function handleCreateCategory(name: string) {
    'use server';

    await createBlogCategory(name);
    revalidatePath('/posts/categories');
    onSuccess?.();
  }

  return <CategoryFormClient onSubmit={handleCreateCategory} />;
}
