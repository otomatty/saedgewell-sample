'use client';

import { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { toast } from 'sonner';
import { Badge } from '@kit/ui/badge';
import { formatDate } from '@kit/shared/utils';
import type { GitHubSettings } from '@kit/types';
import { Button } from '@kit/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@kit/ui/scroll-area';

// ログの型定義
type SyncLog = {
  type: 'info' | 'error' | 'success';
  message: string;
};

// サーバーコンポーネントから渡されるデータとアクションの型定義
interface GitHubSettingsListClientProps {
  initialSettings: GitHubSettings[];
  syncAction: () => Promise<{
    success: boolean;
    error?: Error;
    logs?: SyncLog[];
  }>;
}

export function GitHubSettingsListClient({
  initialSettings,
  syncAction,
}: GitHubSettingsListClientProps) {
  // initialSettingsは既に整形済みのため、そのまま使用
  const [settings] = useState(initialSettings);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<string>('');
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    setSyncProgress('同期処理を開始します...');
    setSyncLogs([{ type: 'info', message: '同期処理を開始します...' }]);
    setShowLogs(true);

    try {
      const result = await syncAction();

      if (!result.success) {
        throw result.error || new Error('同期中に不明なエラーが発生しました。');
      }

      // サーバーから返されたログがあれば表示
      if (result.logs && result.logs.length > 0) {
        setSyncLogs(result.logs);
      }

      toast.success('GitHubの貢献データを同期しました。');
    } catch (error) {
      console.error('同期に失敗しました:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setSyncLogs((prev) => [
        ...prev,
        { type: 'error', message: `同期に失敗しました: ${errorMessage}` },
      ]);
      toast.error(`同期に失敗しました: ${errorMessage}`);
    } finally {
      setIsSyncing(false);
      setSyncProgress('');
    }
  }, [syncAction]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">登録済みの設定</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ユーザー名</TableHead>
            <TableHead>自動同期</TableHead>
            <TableHead>最終同期日時</TableHead>
            <TableHead>更新日時</TableHead>
            <TableHead>アクション</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settings.map((setting) => (
            <TableRow key={setting.id}>
              <TableCell>{setting.username}</TableCell>
              <TableCell>
                <Badge variant={setting.autoSync ? 'default' : 'secondary'}>
                  {setting.autoSync ? '有効' : '無効'}
                </Badge>
              </TableCell>
              <TableCell>
                {setting.lastSyncedAt
                  ? formatDate(setting.lastSyncedAt.toISOString())
                  : '未同期'}
              </TableCell>
              <TableCell>
                {formatDate(setting.updatedAt.toISOString())}
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSync}
                    disabled={isSyncing}
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        同期中...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        手動同期
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLogs(!showLogs)}
                    disabled={syncLogs.length === 0}
                  >
                    {showLogs ? 'ログを隠す' : 'ログを表示'}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {settings.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                設定が登録されていません
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 同期ログ表示エリア */}
      {showLogs && syncLogs.length > 0 && (
        <div className="border rounded-md p-4 mt-4 bg-muted/30">
          <h3 className="text-md font-medium mb-2">同期ログ</h3>
          <ScrollArea className="h-[300px] rounded-md border p-2 bg-background">
            <div className="space-y-1">
              {syncLogs.map((log, index) => (
                <div
                  key={`log-${index}-${log.type}`}
                  className={`text-sm py-1 ${
                    log.type === 'error'
                      ? 'text-destructive'
                      : log.type === 'success'
                        ? 'text-green-600 dark:text-green-400 font-medium'
                        : 'text-muted-foreground'
                  }`}
                >
                  {log.message}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
