'use client';

import { Button } from '@kit/ui/button';
import { toast } from 'sonner';
import { syncEmails } from '~/lib/server/gmail/service';
import type { GmailSyncError } from '~/types/gmail';
import { useState } from 'react';

export function SyncEmailsButton() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncEmails();

      if (!result.success && result.errors) {
        // エラーごとにトースト通知を表示
        for (const error of result.errors) {
          const title =
            error.type === 'attachment'
              ? '添付ファイルの同期エラー'
              : 'メールの同期エラー';

          const description = error.details
            ? `${error.message}\n${
                error.details.fileName
                  ? `ファイル: ${error.details.fileName}\n`
                  : ''
              }${
                error.details.emailSubject
                  ? `メール件名: ${error.details.emailSubject}\n`
                  : ''
              }${
                error.details.errorMessage
                  ? `エラー: ${error.details.errorMessage}`
                  : ''
              }`
            : error.message;

          toast.error(title, {
            description,
          });
        }
      } else {
        // 成功通知
        toast.success('同期完了', {
          description: 'メールの同期が完了しました',
        });
      }
    } catch (error) {
      // 予期せぬエラー
      toast.error('エラー', {
        description: 'メールの同期中に予期せぬエラーが発生しました',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button onClick={handleSync} disabled={isSyncing} variant="default">
      {isSyncing ? '同期中...' : 'メールを同期'}
    </Button>
  );
}
