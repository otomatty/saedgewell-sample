'use client';

import { DataTable } from '@kit/ui/data-table';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Eye, RefreshCw, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Database } from '@kit/supabase/database';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type KnowledgeProject =
  Database['public']['Tables']['knowledge_projects']['Row'];
type KnowledgeSyncLog =
  Database['public']['Tables']['knowledge_sync_logs']['Row'];

interface ProjectListProps {
  projects: (KnowledgeProject & {
    stats: {
      totalPages: number;
      latestSync: KnowledgeSyncLog | null;
    };
  })[];
  onDeleteProject: (projectId: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

interface DeleteDialogProps {
  project: KnowledgeProject;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteDialog = ({
  project,
  isOpen,
  onClose,
  onConfirm,
}: DeleteDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>プロジェクトの削除</DialogTitle>
        <DialogDescription>
          プロジェクト「{project.project_name}」を削除しますか？
          この操作は取り消せません。
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          キャンセル
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          削除
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const LastSyncedCell = ({ value }: { value: string | null }) => (
  <span className="text-muted-foreground">
    {value ? new Date(value).toLocaleString('ja-JP') : '未同期'}
  </span>
);

const StatusCell = ({
  latestSync,
}: { latestSync: KnowledgeSyncLog | null }) => {
  const status = !latestSync
    ? 'error'
    : latestSync.status === 'completed'
      ? 'active'
      : 'syncing';

  return (
    <Badge
      variant={
        status === 'active'
          ? 'default'
          : status === 'syncing'
            ? 'secondary'
            : 'destructive'
      }
    >
      {status === 'active'
        ? '有効'
        : status === 'syncing'
          ? '同期中'
          : 'エラー'}
    </Badge>
  );
};

const ActionsCell = ({
  project,
  onDeleteProject,
}: {
  project: KnowledgeProject;
  onDeleteProject: ProjectListProps['onDeleteProject'];
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await onDeleteProject(project.id);
      if (result.success) {
        toast.success('プロジェクトを削除しました');
        router.refresh();
      } else {
        toast.error('削除に失敗しました', {
          description: result.error ?? '不明なエラーが発生しました',
        });
      }
    } catch (error) {
      toast.error('削除に失敗しました', {
        description: '予期せぬエラーが発生しました',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/admin/knowledge/projects/${project.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <DeleteDialog
        project={project}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export function ProjectList({ projects, onDeleteProject }: ProjectListProps) {
  const router = useRouter();
  const columns: ColumnDef<ProjectListProps['projects'][number]>[] = [
    {
      accessorKey: 'project_name',
      header: 'プロジェクト名',
      cell: ({ row }) => (
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() =>
            router.push(`/admin/knowledge/projects/${row.original.id}`)
          }
        >
          {row.original.project_name}
        </Button>
      ),
    },
    {
      accessorKey: 'stats.totalPages',
      header: 'ページ数',
    },
    {
      accessorKey: 'last_synced_at',
      header: '最終同期',
      cell: ({ row }) => <LastSyncedCell value={row.original.last_synced_at} />,
    },
    {
      accessorKey: 'stats.latestSync',
      header: '状態',
      cell: ({ row }) => (
        <StatusCell latestSync={row.original.stats.latestSync} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ActionsCell project={row.original} onDeleteProject={onDeleteProject} />
      ),
    },
  ];

  return <DataTable columns={columns} data={projects} />;
}
