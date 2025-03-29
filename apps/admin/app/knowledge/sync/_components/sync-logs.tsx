'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { Badge } from '@kit/ui/badge';
import { ScrollArea } from '@kit/ui/scroll-area';
import type { Database } from '@kit/supabase/database';
import { getSyncLogs } from '~/actions/knowledge';
type SyncLog = Database['public']['Tables']['knowledge_sync_logs']['Row'];

const columns = [
  {
    accessorKey: 'sync_started_at',
    header: '開始時刻',
    cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
      const date = row.getValue('sync_started_at');
      return date ? new Date(date as string).toLocaleString('ja-JP') : '-';
    },
  },
  {
    accessorKey: 'duration',
    header: '所要時間',
    cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
      const start = new Date(row.getValue('sync_started_at') as string);
      const end = row.getValue('sync_completed_at')
        ? new Date(row.getValue('sync_completed_at') as string)
        : new Date();
      const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
      return `${duration}秒`;
    },
  },
  {
    accessorKey: 'status',
    header: '状態',
    cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
      const status = row.getValue('status') as string;
      const variant = {
        completed: 'success',
        failed: 'destructive',
        running: 'default',
      }[status] as 'success' | 'destructive' | 'default';

      const label =
        {
          completed: '完了',
          failed: '失敗',
          running: '実行中',
        }[status] || status;

      return (
        <Badge
          variant={
            variant as
              | 'destructive'
              | 'default'
              | 'secondary'
              | 'outline'
              | null
          }
        >
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'pages_processed',
    header: '処理ページ数',
    cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
      const processed = row.getValue('pages_processed') as unknown as number;
      const updated = row.getValue('pages_updated') as unknown as number;
      return `${processed}/${updated}`;
    },
  },
];

export function SyncLogs() {
  const [logs, setLogs] = useState<SyncLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await getSyncLogs();
        setLogs(logs);
      } catch (error) {
        console.error('Failed to fetch sync logs:', error);
      }
    };
    fetchLogs();

    // 30秒ごとに更新
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              {columns.map((column) => (
                <TableCell key={column.accessorKey}>
                  {column.cell({
                    row: {
                      getValue: (key: string) =>
                        log[key as keyof SyncLog] as string,
                    },
                  })}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
