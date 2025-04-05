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
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@kit/ui/alert';

// サーバーコンポーネントから渡されるデータとアクションの型定義
interface GitHubSettingsListClientProps {
  initialSettings: GitHubSettings[];
  syncAction: () => Promise<{ success: boolean; error?: Error }>;
}

export function GitHubSettingsListClient({
  initialSettings,
  syncAction,
}: GitHubSettingsListClientProps) {
  // initialSettingsは既に整形済みのため、そのまま使用
  const [settings] = useState(initialSettings);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<string>('');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncTimeout, setSyncTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSync = useCallback(async () => {
    // 既存の同期処理が実行中の場合、前回のタイムアウトタイマーをクリア
    if (syncTimeout) {
      clearTimeout(syncTimeout);
      setSyncTimeout(null);
    }

    setIsSyncing(true);
    setSyncProgress('GitHub接続中...');
    setSyncError(null);

    // 同期処理のタイムアウト設定（30秒）
    const timeoutId = setTimeout(() => {
      setIsSyncing(false);
      setSyncProgress('');
      setSyncError(
        '処理がタイムアウトしました。処理は継続していますがUIからは切断されました。'
      );
      toast.error(
        '同期処理がタイムアウトしました。バックグラウンドで継続しています。'
      );
    }, 30000);

    setSyncTimeout(timeoutId);

    // 進行状況表示のためのインターバル
    const progressSteps = [
      'リポジトリ情報を取得中...',
      'コミット情報を収集中...',
      '貢献データを集計中...',
      'データベースに保存中...',
    ];

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        setSyncProgress(progressSteps[currentStep] as string);
        currentStep++;
      } else {
        // 全ステップ表示後はランダムな待機メッセージ
        const waitingMessages = [
          'GitHub APIからデータを取得中...',
          '処理を継続中...',
          'データを同期中...',
        ];
        const randomIndex = Math.floor(Math.random() * waitingMessages.length);
        const randomMessage = waitingMessages[randomIndex] as string;
        setSyncProgress(randomMessage);
      }
    }, 3000);

    try {
      const result = await syncAction();

      clearInterval(progressInterval);
      clearTimeout(timeoutId);
      setSyncTimeout(null);

      if (!result.success) {
        throw result.error || new Error('同期中に不明なエラーが発生しました。');
      }

      setSyncProgress('同期完了！');
      toast.success('GitHubの貢献データを同期しました。');

      // 少し待ってから状態をリセット
      setTimeout(() => {
        setIsSyncing(false);
        setSyncProgress('');
      }, 1500);
    } catch (error) {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
      setSyncTimeout(null);

      console.error('同期に失敗しました:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setSyncError(errorMessage);
      toast.error(`同期に失敗しました: ${errorMessage}`);
    } finally {
      if (syncTimeout) {
        clearTimeout(syncTimeout);
        setSyncTimeout(null);
      }
    }
  }, [syncAction, syncTimeout]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">登録済みの設定</h2>

      {syncError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>エラーが発生しました: {syncError}</AlertDescription>
        </Alert>
      )}

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
                    className="w-full"
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {syncProgress || '同期中...'}
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        手動同期
                      </>
                    )}
                  </Button>

                  {isSyncing && (
                    <div className="text-xs text-muted-foreground">
                      処理が完了するまでお待ちください...
                    </div>
                  )}
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
    </div>
  );
}
