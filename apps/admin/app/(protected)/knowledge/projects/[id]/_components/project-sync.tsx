'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { getProjectSyncLogs } from '~/actions/knowledge';
import {
  syncProject,
  updateProjectSyncSettings,
  getProjectSyncSettings,
} from '~/actions/knowledge';
import { toast } from 'sonner';
import type { Database } from '@kit/supabase/database';
import { Skeleton } from '@kit/ui/skeleton';
import { DataTable } from '@kit/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { RefreshCcw } from 'lucide-react';
import { Switch } from '@kit/ui/switch';
import { Label } from '@kit/ui/label';

type SyncLog = Database['public']['Tables']['knowledge_sync_logs']['Row'];

interface ProjectSyncProps {
  projectId: string;
}

export function ProjectSync({ projectId }: ProjectSyncProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const settings = await getProjectSyncSettings(projectId);
      if (settings.error) {
        throw new Error(settings.error);
      }
      setAutoSyncEnabled(settings.auto_sync_enabled);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('設定の取得に失敗しました', {
        description:
          error instanceof Error
            ? error.message
            : '不明なエラーが発生しました。',
      });
    }
  }, [projectId]);

  const fetchSyncLogs = useCallback(async () => {
    try {
      const logs = await getProjectSyncLogs(projectId);
      setSyncLogs(
        logs.map((log) => ({
          ...log,
          created_at: log.sync_started_at,
        }))
      );
    } catch (error) {
      console.error('Failed to fetch sync logs:', error);
      toast.error('同期ログの取得に失敗しました', {
        description:
          error instanceof Error
            ? error.message
            : '不明なエラーが発生しました。',
      });
    }
  }, [projectId]);

  useEffect(() => {
    fetchSettings();
    fetchSyncLogs();
  }, [fetchSettings, fetchSyncLogs]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncProject(projectId);
      if (result.success) {
        toast.success('同期が完了しました', {
          description: 'プロジェクトの同期が正常に完了しました。',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to sync project:', error);
      toast.error('同期に失敗しました', {
        description:
          error instanceof Error
            ? error.message
            : '不明なエラーが発生しました。',
      });
    } finally {
      setIsSyncing(false);
      fetchSyncLogs();
    }
  };

  const handleAutoSyncToggle = async () => {
    try {
      const result = await updateProjectSyncSettings(projectId, {
        auto_sync_enabled: !autoSyncEnabled,
      });

      if (result.success) {
        setAutoSyncEnabled(!autoSyncEnabled);
        toast.success('設定を更新しました', {
          description: `自動同期を${!autoSyncEnabled ? '有効' : '無効'}にしました。`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to update auto sync setting:', error);
      toast.error('設定の更新に失敗しました', {
        description:
          error instanceof Error
            ? error.message
            : '不明なエラーが発生しました。',
      });
    }
  };

  const columns: ColumnDef<SyncLog>[] = [
    {
      accessorKey: 'sync_started_at',
      header: '開始日時',
      cell: ({ row }) =>
        format(new Date(row.original.sync_started_at), 'yyyy/MM/dd HH:mm:ss', {
          locale: ja,
        }),
    },
    {
      accessorKey: 'sync_completed_at',
      header: '完了日時',
      cell: ({ row }) =>
        row.original.sync_completed_at
          ? format(
              new Date(row.original.sync_completed_at),
              'yyyy/MM/dd HH:mm:ss',
              { locale: ja }
            )
          : '-',
    },
    {
      accessorKey: 'status',
      header: 'ステータス',
      cell: ({ row }) => {
        const status = row.original.status;
        switch (status) {
          case 'completed':
            return '完了';
          case 'processing':
            return '処理中';
          case 'error':
            return 'エラー';
          default:
            return status;
        }
      },
    },
    {
      accessorKey: 'pages_processed',
      header: '処理ページ数',
    },
    {
      accessorKey: 'pages_updated',
      header: '更新ページ数',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>同期設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>自動同期</Label>
              <p className="text-sm text-muted-foreground">
                1時間ごとに自動で同期を実行します
              </p>
            </div>
            <Switch
              checked={autoSyncEnabled}
              onCheckedChange={handleAutoSyncToggle}
            />
          </div>

          <Button onClick={handleSync} disabled={isSyncing} className="w-full">
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
            />
            {isSyncing ? '同期中...' : '今すぐ同期'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>同期ログ</CardTitle>
        </CardHeader>
        <CardContent>
          {syncLogs ? (
            <DataTable columns={columns} data={syncLogs} />
          ) : (
            <Skeleton className="h-[400px]" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
