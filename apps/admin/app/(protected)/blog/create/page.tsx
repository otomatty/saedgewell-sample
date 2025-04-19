import { Suspense } from 'react';
import { getBlogCategories } from '@kit/next/actions';
import PostCreateForm from './_components/post-create-form';

export default async function AdminPostsCreatePage() {
  // サーバーサイドでカテゴリー一覧を取得
  const categories = await getBlogCategories();

  return (
    <div className="container space-y-8 py-8">
      <h1 className="text-3xl font-bold">ブログ記事作成</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <PostCreateForm initialCategories={categories} />
      </Suspense>
    </div>
  );
}
