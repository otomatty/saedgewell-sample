import { createBlogPost } from '@kit/next/actions';
import { redirect } from 'next/navigation';
import { PostFormClient } from './post-form-client';
import type { BlogCategory } from '@kit/types/blog';

interface PostCreateFormProps {
  initialCategories: BlogCategory[];
}

/**
 * 投稿作成フォームのサーバーコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {BlogCategory[]} props.initialCategories - 初期カテゴリーリスト
 * @returns {JSX.Element} 投稿作成フォームのUI
 */
export default function PostCreateForm({
  initialCategories,
}: PostCreateFormProps) {
  async function handleCreatePost(data: {
    title: string;
    slug: string;
    content: string;
    categoryIds: string[];
  }) {
    'use server';

    await createBlogPost(data.title, data.slug, data.content, data.categoryIds);
    redirect('/posts');
  }

  return (
    <PostFormClient
      initialCategories={initialCategories}
      onSubmit={handleCreatePost}
    />
  );
}
