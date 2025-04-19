'use client';

import * as React from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';

import { DataTablePagination } from './pagination';
import { DataTableToolbar } from './toolbar';

// サブコンポーネントをエクスポート
export { DataTableColumnHeader } from './column-header';
export { DataTableRowActions } from './row-actions';
export { DataTablePagination } from './pagination';
export { DataTableToolbar } from './toolbar';

/**
 * データテーブルのプロパティの型定義
 * @template TData テーブルのデータ型
 * @template TValue セルの値の型
 */
interface DataTableProps<TData, TValue> {
  /** テーブルのカラム定義 */
  columns: ColumnDef<TData, TValue>[];
  /** テーブルのデータ配列 */
  data: TData[];
  /** フィルター可能なカラムの設定
   * @example
   * ```tsx
   * filterableColumns={[
   *   {
   *     id: "status",
   *     title: "ステータス",
   *     options: [
   *       { label: "有効", value: "active" },
   *       { label: "無効", value: "inactive" }
   *     ]
   *   }
   * ]}
   * ```
   */
  filterableColumns?: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  /** 検索可能なカラムの設定
   * @example
   * ```tsx
   * searchableColumns={[
   *   {
   *     id: "name",
   *     title: "名前"
   *   }
   * ]}
   * ```
   */
  searchableColumns?: {
    id: string;
    title: string;
  }[];
  /** 行の削除処理
   * @param row 削除する行のデータ
   */
  deleteRow?: (row: TData) => Promise<void>;
  /** 行の編集処理
   * @param row 編集する行のデータ
   */
  editRow?: (row: TData) => Promise<void>;
  /** 新規作成ボタンの設定
   * @param onClick ボタンがクリックされたときに呼び出される関数
   * @param label ボタンのラベル
   */
  create?: {
    content: React.ReactNode;
  };
}

/**
 * 再利用可能なデータテーブルコンポーネント
 *
 * @description
 * このコンポーネントは以下の機能を提供します：
 * - ソート機能
 * - フィルタリング機能
 * - 検索機能
 * - ページネーション
 * - 行の選択
 * - カラムの表示/非表示
 * - 行の編集/削除
 *
 * @example
 * ```tsx
 * import { DataTable } from "@/components/ui/data-table";
 * import { columns } from "./columns";
 *
 * export default function Page() {
 *   const data = [
 *     {
 *       id: 1,
 *       name: "Example",
 *       status: "active"
 *     }
 *   ];
 *
 *   return (
 *     <DataTable
 *       columns={columns}
 *       data={data}
 *       searchableColumns={[
 *         {
 *           id: "name",
 *           title: "名前"
 *         }
 *       ]}
 *       filterableColumns={[
 *         {
 *           id: "status",
 *           title: "ステータス",
 *           options: [
 *             { label: "有効", value: "active" },
 *             { label: "無効", value: "inactive" }
 *           ]
 *         }
 *       ]}
 *       onEdit={async (row) => {
 *         // 編集処理
 *       }}
 *       onDelete={async (row) => {
 *         // 削除処理
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  filterableColumns = [],
  searchableColumns = [],
  deleteRow,
  editRow,
  create,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        create={create}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  データがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
