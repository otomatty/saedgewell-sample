'use client';

import { X } from 'lucide-react';
import { Button } from '../../button';
import { Input } from '../../input';
import { DataTableViewOptions } from '../view-options';
import type { Table } from '@tanstack/react-table';
export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  searchableColumns?: {
    id: string;
    title: string;
  }[];
  create?: {
    content: React.ReactNode;
  };
}
/**
 * データテーブルのツールバーコンポーネント
 *
 * @description
 * このコンポーネントは以下の機能を提供します：
 * - 検索フィールド（設定されている場合）
 * - フィルターのリセット
 * - カラム表示オプション
 * - 新規作成ボタンとダイアログ（設定されている場合）
 *
 * @example
 * ```tsx
 * <DataTableToolbar
 *   table={table}
 *   searchableColumns={[
 *     {
 *       id: "name",
 *       title: "名前"
 *     }
 *   ]}
 *   createButton={{
 *     label: "新規作成",
 *     dialog: {
 *       title: "新規作成",
 *       content: <CreateForm />
 *     }
 *   }}
 * />
 * ```
 */
export function DataTableToolbar<TData>({
  table,
  searchableColumns = [],
  create,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.id) && (
                <Input
                  key={column.id}
                  placeholder={`${column.title}で検索...`}
                  value={
                    (table.getColumn(column.id)?.getFilterValue() as string) ??
                    ''
                  }
                  onChange={(event) =>
                    table
                      .getColumn(column.id)
                      ?.setFilterValue(event.target.value)
                  }
                  className="h-8 w-[150px] lg:w-[250px]"
                />
              )
          )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            フィルターをリセット
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {create?.content}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
