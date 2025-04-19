'use client'; // テーブルのソート、フィルター、ページネーション、削除アクションのため

/**
 * @file 実績一覧データテーブルコンポーネント。
 * @description 実績データをテーブル形式で表示し、ソート、フィルター、ページネーション、削除機能を提供します。
 * shadcn/ui/table と tanstack/react-table を利用することを推奨。
 */

import type React from 'react';
import Link from 'next/link';
import { DataTable } from '@kit/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@kit/ui/skeleton';
import { Button } from '@kit/ui/button'; // 編集ボタン用
import { ArrowUpDown, Edit, MoreHorizontal, Trash2 } from 'lucide-react'; // ソートアイコン、編集アイコン、削除アイコン
import { Badge } from '@kit/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@kit/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import { Pagination } from '@kit/ui/pagination';
import type { WorkListItem, WorkStatus } from '~/types/works/works-list';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteWork } from '~/actions/works/delete-work';

/**
 * @interface WorksDataTableProps
 * @description WorksDataTable コンポーネントの Props 型定義。
 */
interface WorksDataTableProps {
  data?: WorkListItem[];
  isLoading?: boolean; // ローディング状態を追加
  pagination?: {
    totalItems: number;
    pageSize: number;
    currentPage: number;
  };
  baseUrl?: string; // ページネーションのベースURL
}

/**
 * @constant columns
 * @description DataTable 用のカラム定義。
 */
const columns: ColumnDef<WorkListItem>[] = [
  {
    id: 'thumbnail',
    header: 'サムネイル',
    cell: ({ row }) => {
      const thumbnailUrl = row.original.thumbnail_url;
      const title = row.original.title ?? '';
      return (
        <Avatar className="h-9 w-9">
          <AvatarImage src={thumbnailUrl ?? undefined} alt={title} />
          <AvatarFallback>{title?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        タイトル
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      // 詳細ページへのリンク
      <Link
        href={`/works/${row.original.id}`}
        className="hover:underline font-medium"
      >
        {row.getValue('title')}
      </Link>
    ),
  },
  {
    accessorKey: 'status',
    header: 'ステータス',
    cell: ({ row }) => {
      const status = row.getValue('status') as WorkStatus;
      const variant: 'default' | 'secondary' | 'outline' | 'destructive' =
        status === 'published'
          ? 'default'
          : status === 'draft'
            ? 'secondary'
            : status === 'archived'
              ? 'outline'
              : 'destructive'; // featured や予期せぬ値
      const text =
        status === 'published'
          ? '公開'
          : status === 'draft'
            ? '下書き'
            : status === 'archived'
              ? 'アーカイブ'
              : status === 'featured'
                ? '注目'
                : status;
      return <Badge variant={variant}>{text}</Badge>;
    },
    // TODO: ステータスでのフィルタリングUI
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'category',
    header: 'カテゴリ',
    // TODO: カテゴリでのフィルタリングUI
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'published_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        公開日
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue('published_at') as Date | null;
      return date ? date.toLocaleDateString() : '-'; // 未公開はハイフン表示
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        更新日
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue('updated_at') as Date;
      return date.toLocaleDateString();
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const work = row.original;
      const router = useRouter();

      // 削除処理 (確認ダイアログ + Server Action 呼び出し)
      const handleDelete = async () => {
        if (confirm(`「${work.title}」を削除してもよろしいですか？`)) {
          try {
            const result = await deleteWork(work.id);

            if (result.success) {
              toast.success('削除完了', {
                description: result.message,
              });
              // 一覧を更新
              router.refresh();
            } else {
              toast.error('削除エラー', {
                description: result.message,
              });
            }
          } catch (error) {
            console.error('削除エラー:', error);
            toast.error('削除エラー', {
              description: '削除処理中にエラーが発生しました',
            });
          }
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">アクションを開く</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/works/${work.id}/edit`}>編集</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

/**
 * @function WorksDataTable
 * @description 実績データの一覧をテーブル形式で表示するコンポーネント。
 * @param {WorksDataTableProps} props - コンポーネントの Props。
 * @returns {React.ReactElement} 実績データテーブルまたはロード中のスケルトン。
 */
const WorksDataTable: React.FC<WorksDataTableProps> = ({
  data = [],
  isLoading = false,
  pagination,
  baseUrl,
}) => {
  // ローディング状態の場合、スケルトンを表示
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="divide-y divide-border">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center p-4 border-b">
            {/* Filter Skeleton */}
            <Skeleton className="h-8 w-1/4" />
            {/* Placeholder for potential buttons/actions */}
            <Skeleton className="h-8 w-1/6" />
          </div>
          {/* Table Header Skeleton */}
          <div className="flex items-center p-4 bg-muted/50">
            <Skeleton className="h-6 w-1/3 mr-4" />
            <Skeleton className="h-6 w-1/4 mr-4" />
            <Skeleton className="h-6 w-1/4 mr-4" />
            <Skeleton className="h-6 w-8 ml-auto" />
          </div>
          {/* Row Skeletons */}
          {[...Array(5)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={`skeleton-row-${i}`} className="flex items-center p-4">
              <Skeleton className="h-6 w-1/3 mr-4" />
              <Skeleton className="h-6 w-1/4 mr-4" />
              <Skeleton className="h-6 w-1/4 mr-4" />
              <Skeleton className="h-6 w-8 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // データがない場合の表示 (任意でカスタマイズ)
  // if (!data || data.length === 0) {
  //   return <p className="text-center text-muted-foreground py-8">実績データがありません。</p>;
  // }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data}
        // TODO: フィルタリング機能の input を DataTable に渡す
        // filterColumn="title"
        // filterPlaceholder="タイトルで検索..."
        // isLoading={isLoading} // DataTable 側でローディング表示を持つ場合
      />

      {pagination && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={Math.ceil(pagination.totalItems / pagination.pageSize)}
            baseUrl={baseUrl ?? '/works?page='}
          />
        </div>
      )}
    </div>
  );
};

export default WorksDataTable;
