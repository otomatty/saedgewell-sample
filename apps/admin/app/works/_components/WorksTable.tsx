'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import type { Work } from '@kit/types/works';
import { Button } from '@kit/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@kit/ui/dropdown-menu';
import { Badge } from '@kit/ui/badge';
import { DeleteWorkDialog } from './DeleteWorkDialog';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@kit/ui/data-table';

type WorkStatus = Work['status'];
type WorkCategory = Work['category'];

const statusMap: Record<
  WorkStatus,
  { label: string; variant: 'secondary' | 'default' | 'destructive' }
> = {
  draft: { label: '下書き', variant: 'secondary' },
  published: { label: '公開済み', variant: 'default' },
  archived: { label: 'アーカイブ', variant: 'destructive' },
} as const;

const categoryMap: Record<WorkCategory, { label: string; variant: 'default' }> =
  {
    company: { label: '企業案件', variant: 'default' },
    freelance: { label: 'フリーランス案件', variant: 'default' },
    personal: { label: '個人開発', variant: 'default' },
  } as const;

interface WorksTableProps {
  works: Work[];
}

export function WorksTable({ works }: WorksTableProps) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkIds, setSelectedWorkIds] = useState<string[]>([]);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const handleDelete = (work: Work) => {
    setSelectedWork(work);
    setIsDeleteDialogOpen(true);
  };

  const handleBulkDelete = () => {
    setIsBulkDeleteDialogOpen(true);
  };

  const toggleAll = (checked: boolean) => {
    setSelectedWorkIds(checked ? works.map((work) => work.id) : []);
  };

  const toggleWork = (workId: string, checked: boolean) => {
    setSelectedWorkIds((prev) =>
      checked ? [...prev, workId] : prev.filter((id) => id !== workId)
    );
  };

  const columns: ColumnDef<Work>[] = [
    {
      accessorKey: 'title',
      header: 'タイトル',
      cell: ({ row }) => {
        const work = row.original;
        return (
          <div className="flex items-center space-x-2">
            {work.thumbnail_url && (
              <img
                src={work.thumbnail_url}
                alt={work.title}
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            <span>{work.title}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'カテゴリー',
      cell: ({ row }) => {
        const category = row.getValue('category') as Work['category'];
        return (
          <Badge variant="outline">
            {category === 'company'
              ? '会社'
              : category === 'freelance'
                ? 'フリーランス'
                : '個人'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'ステータス',
      cell: ({ row }) => {
        const status = row.getValue('status') as Work['status'];
        return (
          <Badge
            variant={
              status === 'published'
                ? 'default'
                : status === 'draft'
                  ? 'secondary'
                  : 'destructive'
            }
          >
            {status === 'published'
              ? '公開'
              : status === 'draft'
                ? '下書き'
                : 'アーカイブ'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const work = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">メニューを開く</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>アクション</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/works/${work.slug}`}>編集</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div className="space-y-4">
        {selectedWorkIds.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              選択した{selectedWorkIds.length}件を削除
            </Button>
          </div>
        )}
        <div className="rounded-md border">
          <DataTable columns={columns} data={works} />
        </div>
      </div>

      {selectedWork && (
        <DeleteWorkDialog
          workId={selectedWork.id}
          workTitle={selectedWork.title}
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedWork(null);
          }}
        />
      )}

      <DeleteWorkDialog
        workIds={selectedWorkIds}
        isOpen={isBulkDeleteDialogOpen}
        onClose={() => {
          setIsBulkDeleteDialogOpen(false);
          setSelectedWorkIds([]);
        }}
      />
    </>
  );
}
