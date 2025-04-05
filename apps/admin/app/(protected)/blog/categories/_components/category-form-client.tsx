'use client';

import { useState } from 'react';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { toast } from 'sonner';

interface CategoryFormClientProps {
  onSubmit: (name: string) => Promise<void>;
}

/**
 * カテゴリー作成フォームのクライアントコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Function} props.onSubmit - フォーム送信時のコールバック関数
 * @returns {JSX.Element} カテゴリー作成フォームのUI
 */
export function CategoryFormClient({ onSubmit }: CategoryFormClientProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('カテゴリー名を入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(name);
      setName('');
      toast.success('カテゴリーを作成しました');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('カテゴリーの作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">カテゴリー名</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="新しいカテゴリー名を入力"
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '作成中...' : '作成'}
      </Button>
    </form>
  );
}
