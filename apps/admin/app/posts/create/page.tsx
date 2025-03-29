'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBlogPost } from '@kit/next/actions';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import CategorySelect from './_components/category-select';

const AdminPostsCreatePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBlogPost(title, slug, content, categoryIds);
    router.push('/admin/posts');
  };

  return (
    <div className="container space-y-8 py-8">
      <h1 className="text-3xl font-bold">ブログ記事作成</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="slug">スラッグ</Label>
          <Input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="content">コンテンツ</Label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-md border border-input px-3 py-2 shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div>
          <Label htmlFor="categoryIds">カテゴリー</Label>
          <CategorySelect value={categoryIds} onChange={setCategoryIds} />
        </div>
        <Button type="submit">作成</Button>
      </form>
    </div>
  );
};

export default AdminPostsCreatePage;
