'use client';

import { useState } from 'react';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { toast } from 'sonner';
import type { BlogCategory } from '@kit/types/blog';

interface PostFormClientProps {
  initialCategories: BlogCategory[];
  onSubmit: (data: {
    title: string;
    slug: string;
    content: string;
    categoryIds: string[];
  }) => Promise<void>;
}

/**
 * 投稿作成フォームのクライアントコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {BlogCategory[]} props.initialCategories - 初期カテゴリーリスト
 * @param {Function} props.onSubmit - フォーム送信時のコールバック関数
 * @returns {JSX.Element} 投稿作成フォームのUI
 */
export function PostFormClient({
  initialCategories,
  onSubmit,
}: PostFormClientProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('タイトルを入力してください');
      return;
    }

    if (!slug.trim()) {
      toast.error('スラッグを入力してください');
      return;
    }

    if (!content.trim()) {
      toast.error('コンテンツを入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ title, slug, content, categoryIds });
      toast.success('投稿を作成しました');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('投稿の作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="投稿のタイトルを入力"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="slug">スラッグ</Label>
        <Input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="投稿のスラッグを入力"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="content">コンテンツ</Label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="投稿の内容を入力"
          disabled={isSubmitting}
          className="w-full rounded-md border border-input px-3 py-2 shadow-xs focus-visible:outline-hidden focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div>
        <Label htmlFor="categoryIds">カテゴリー</Label>
        <select
          id="categoryIds"
          multiple
          value={categoryIds}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions);
            setCategoryIds(selectedOptions.map((option) => option.value));
          }}
          disabled={isSubmitting}
          className="w-full rounded-md border border-input px-3 py-2"
        >
          {initialCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '作成中...' : '作成'}
      </Button>
    </form>
  );
}
