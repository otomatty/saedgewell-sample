'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select'; // shadcn/ui の Select を想定
import {
  getWorkCategories,
  type WorkCategory,
} from '~/actions/works/works-categories'; // 作成した Server Action をインポート

export function WorkCategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') ?? '';

  const [categories, setCategories] = useState<WorkCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getWorkCategories()
      .then(setCategories)
      .catch((err: Error) => {
        console.error(err);
        setError('カテゴリの読み込みに失敗しました。');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === '__ALL__' || value === '') {
      params.delete('category');
    } else {
      params.set('category', value);
    }
    // ページネーションをリセットする場合
    // params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // ローディング中またはエラー発生時の表示
  if (isLoading) {
    return (
      <div className="w-full sm:w-[200px]">
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="w-full sm:w-[200px]">
      <Select
        value={currentCategory}
        onValueChange={handleCategoryChange}
        disabled={isPending}
      >
        <SelectTrigger className={isPending ? 'opacity-50' : ''}>
          <SelectValue placeholder="カテゴリで絞り込み" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__ALL__">すべてのカテゴリ</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              {' '}
              {/* value にはカテゴリ名を設定 */}
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
