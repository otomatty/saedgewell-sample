'use client';

import { useState } from 'react';
import { DataTable } from '@kit/ui/data-table';
import { Button } from '@kit/ui/button';
import {
  Eye,
  Grid2x2,
  Link2,
  LayoutGrid,
  Star,
  Table as TableIcon,
} from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Database } from '@kit/supabase/database';
import { useRouter } from 'next/navigation';
import { PageGrid } from './page-grid';
import { Tabs, TabsList, TabsTrigger } from '@kit/ui/tabs';

export type KnowledgePage =
  Database['public']['Tables']['knowledge_pages']['Row'] & {
    project_name: string;
    collaborators: {
      name: string;
      display_name: string;
      photo_url: string | null;
      is_last_editor: boolean;
    }[];
  };

const columns: ColumnDef<KnowledgePage>[] = [
  {
    accessorKey: 'title',
    header: 'タイトル',
    cell: ({ row }) => {
      const page = row.original;
      const router = useRouter();
      return (
        <Button
          variant="link"
          className="p-0 h-auto hover:no-underline"
          onClick={() => router.push(`/admin/knowledge/pages/${page.id}`)}
        >
          <div className="flex items-center space-x-2">
            {page.pin_status > 0 && (
              <Star className="h-4 w-4 text-yellow-500" />
            )}
            <span>{page.title}</span>
          </div>
        </Button>
      );
    },
  },
  {
    accessorKey: 'project_name',
    header: 'プロジェクト',
  },
  {
    accessorKey: 'views',
    header: '閲覧数',
  },
  {
    accessorKey: 'linked_count',
    header: '被リンク数',
    cell: ({ row }) => {
      const count = row.original.linked_count;
      return (
        <div className="flex items-center space-x-1">
          <Link2 className="h-4 w-4" />
          <span>{count}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'updated_at',
    header: '更新日時',
    cell: ({ row }) => {
      return new Date(row.original.updated_at).toLocaleString('ja-JP');
    },
    sortDescFirst: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            router.push(`/admin/knowledge/pages/${row.original.id}`)
          }
          title="詳細を表示"
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];

interface PageListProps {
  initialData: KnowledgePage[];
}

type ViewMode = 'table' | 'grid';

export function PageList({ initialData }: PageListProps) {
  const [pages, setPages] = useState<KnowledgePage[]>(initialData);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as ViewMode)}
        >
          <TabsList>
            <TabsTrigger value="table">
              <TableIcon className="h-4 w-4 mr-2" />
              テーブル
            </TabsTrigger>
            <TabsTrigger value="grid">
              <LayoutGrid className="h-4 w-4 mr-2" />
              グリッド
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {viewMode === 'table' ? (
        <DataTable columns={columns} data={pages} />
      ) : (
        <PageGrid data={pages} />
      )}
    </div>
  );
}
