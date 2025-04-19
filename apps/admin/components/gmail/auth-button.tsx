'use client';

import { Mail } from 'lucide-react';
import { startGmailAuth, checkGmailAuthStatus } from '~/actions/mail/gmail';
import { Button } from '@kit/ui/button';
import { toast } from 'sonner';

/**
 * Gmail認証を開始するためのボタンコンポーネント
 *
 * @description
 * - 認証状態を確認し、未認証の場合のみ認証フローを開始します
 * - 認証済みの場合はトーストメッセージで通知します
 * - エラーが発生した場合はトーストメッセージでエラー内容を表示します
 */
export function GmailAuthButton() {
  /**
   * ボタンクリック時の処理
   * - 認証状態を確認
   * - 未認証の場合は認証フローを開始
   * - エラー発生時はトーストメッセージで通知
   */
  const handleClick = async () => {
    try {
      const isAuthenticated = await checkGmailAuthStatus();
      if (isAuthenticated) {
        toast.success('既に認証済みです');
        return;
      }

      await startGmailAuth();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : '認証に失敗しました。'
      );
    }
  };

  return (
    <Button onClick={handleClick} variant="outline" className="w-full">
      <Mail className="mr-2 h-4 w-4" />
      Gmailで認証
    </Button>
  );
}
