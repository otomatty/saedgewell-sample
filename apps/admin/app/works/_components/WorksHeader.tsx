'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@kit/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Input } from '@kit/ui/input';

export function WorksHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value === 'all') {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">実績管理</h2>
        <p className="text-sm text-muted-foreground">
          実績の作成、編集、削除を行います。
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="タイトルで検索..."
            className="h-9 w-[150px] lg:w-[250px]"
            defaultValue={searchParams.get('query') ?? ''}
          />
          <Select
            defaultValue={searchParams.get('status') ?? 'all'}
            onValueChange={(value) => {
              router.push(`${pathname}?${createQueryString('status', value)}`);
            }}
          >
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="draft">下書き</SelectItem>
              <SelectItem value="published">公開済み</SelectItem>
              <SelectItem value="archived">アーカイブ</SelectItem>
            </SelectContent>
          </Select>
          <Select
            defaultValue={searchParams.get('category') ?? 'all'}
            onValueChange={(value) => {
              router.push(
                `${pathname}?${createQueryString('category', value)}`
              );
            }}
          >
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="カテゴリー" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="company">企業案件</SelectItem>
              <SelectItem value="freelance">フリーランス案件</SelectItem>
              <SelectItem value="personal">個人開発</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button asChild>
          <Link href="/admin/works/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>
    </div>
  );
}
