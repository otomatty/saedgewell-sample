'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Badge } from '@kit/ui/badge';
import type { WorkStatus } from '~/types/works/works-list';

// ステータス表示用のヘルパー関数
const getStatusLabel = (status: WorkStatus): string => {
  switch (status) {
    case 'published':
      return '公開';
    case 'draft':
      return '下書き';
    case 'archived':
      return 'アーカイブ';
    case 'featured':
      return '注目';
    default:
      return status;
  }
};

// ステータスに対応するバッジのバリアント
const getStatusBadgeVariant = (
  status: WorkStatus
): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (status) {
    case 'published':
      return 'default';
    case 'draft':
      return 'secondary';
    case 'archived':
      return 'outline';
    case 'featured':
      return 'destructive';
    default:
      return 'default';
  }
};

export function WorkStatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') ?? '';

  const [isPending, startTransition] = useTransition();

  // 利用可能なステータス一覧
  const statuses: WorkStatus[] = ['draft', 'published', 'featured', 'archived'];

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === '__ALL__' || value === '') {
      params.delete('status');
    } else {
      params.set('status', value);
    }
    // ページネーションをリセット
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="w-full sm:w-[200px]">
      <Select
        value={currentStatus}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className={isPending ? 'opacity-50' : ''}>
          <SelectValue placeholder="ステータスで絞り込み" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__ALL__">すべてのステータス</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              <div className="flex items-center">
                <Badge variant={getStatusBadgeVariant(status)} className="mr-2">
                  {getStatusLabel(status)}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
