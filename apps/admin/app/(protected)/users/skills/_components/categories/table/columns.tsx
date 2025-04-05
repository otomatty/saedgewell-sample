'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { SkillCategory } from '@kit/types/skills';
import { DataTableColumnHeader, DataTableRowActions } from '@kit/ui/data-table';

export const categoryColumns: ColumnDef<SkillCategory>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="カテゴリー名" />
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="説明" />
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="作成日時" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return date.toLocaleString('ja-JP');
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="更新日時" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('updated_at'));
      return date.toLocaleString('ja-JP');
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
