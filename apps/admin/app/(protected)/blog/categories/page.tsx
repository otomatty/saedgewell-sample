import { Suspense } from 'react';
import { getBlogCategories } from '@kit/next/actions';
import { CategoryList } from './_components/category-list';
import CategoryCreateForm from './_components/category-create-form';

export default async function AdminCategoriesPage() {
  // サーバーサイドでカテゴリー一覧を取得
  const categories = await getBlogCategories();

  return (
    <div className="container space-y-8 py-8">
      <h1 className="text-3xl font-bold">カテゴリー管理</h1>

      <div>
        <h2 className="text-2xl font-bold">カテゴリー一覧</h2>
        <CategoryList categories={categories} />
      </div>

      <div>
        <h2 className="text-2xl font-bold">カテゴリー作成</h2>
        <CategoryCreateForm />
      </div>
    </div>
  );
}
