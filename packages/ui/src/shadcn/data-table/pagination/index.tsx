'use client';

import { Button } from '../../button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../select';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import type { Table, Column } from '@tanstack/react-table';

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export interface DataTableDeleteDialogProps<TData> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (row: TData) => Promise<void>;
  row: TData;
}

export interface DataTableEditDialogProps<TData> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (row: TData) => Promise<void>;
  row: TData;
  title?: string;
  children: React.ReactNode;
}

export interface DataTableHeaderProps<TData> {
  column: Column<TData>;
  title: string;
  className?: string;
}

export interface DataTableFilterProps<TData> {
  column: Column<TData>;
  title: string;
  options: {
    label: string;
    value: string;
  }[];
}

export interface DataTableSearchProps<TData> {
  column: Column<TData>;
  title: string;
}

/**
 * データテーブルのページネーションコンポーネント
 *
 * @description
 * このコンポーネントは以下の機能を提供します：
 * - ページサイズの変更（10, 20, 30, 40, 50行）
 * - ページ移動（最初、前、次、最後）
 * - 現在のページ位置の表示
 * - 選択行数の表示
 *
 * レスポンシブ対応：
 * - モバイル: 前後のページ移動のみ
 * - デスクトップ: 最初/最後のページへの移動を追加
 *
 * @example
 * ```tsx
 * <DataTablePagination table={table} />
 * ```
 */
export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} /{' '}
        {table.getFilteredRowModel().rows.length} 行を選択中
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">1ページあたりの行数</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}{' '}
          ページ
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">最初のページへ</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">前のページへ</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">次のページへ</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">最後のページへ</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
