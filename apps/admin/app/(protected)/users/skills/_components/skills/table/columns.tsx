'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Skill } from '@kit/types/skills';
import { DataTableColumnHeader, DataTableRowActions } from '@kit/ui/data-table';
import { SkillForm } from '../dialog/skill-form';

// サーバーアクションを直接importしない
// import { skillActions } from '@kit/next/actions';

export interface SkillColumnProps {
  onDeleteSkill: (skillId: string) => Promise<void>;
}

// columnsを関数として定義し、サーバーアクションをpropsとして受け取る
export const createSkillColumns = (
  props: SkillColumnProps
): ColumnDef<Skill>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="スキル名" />
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="説明" />
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="カテゴリー" />
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
    cell: ({ row }) => (
      <DataTableRowActions
        row={row.original}
        editForm={
          <SkillForm
            categories={[]}
            onSuccess={async () => {}}
            onCancel={() => {}}
            defaultValues={row.original}
          />
        }
        editTitle="スキルの編集"
        onDelete={async (skill: Skill) => {
          try {
            await props.onDeleteSkill(skill.id);
          } catch (error) {
            console.error('Failed to delete skill:', error);
            throw new Error('スキルの削除に失敗しました');
          }
        }}
      />
    ),
  },
];
