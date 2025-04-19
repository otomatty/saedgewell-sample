'use client';

import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Switch } from '@kit/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';

// フォームのスキーマ定義
const formSchema = z.object({
  username: z.string().min(1, 'ユーザー名を入力してください'),
  accessToken: z.string().min(1, 'アクセストークンを入力してください'),
  autoSync: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

// サーバーコンポーネントから渡されるアクションの型定義
interface GitHubSettingsFormClientProps {
  saveSettingsAction: (
    data: FormData
  ) => Promise<{ success: boolean; error?: Error; warning?: string }>;
  syncAction: () => Promise<{ success: boolean; error?: Error }>;
}

export function GitHubSettingsFormClient({
  saveSettingsAction,
  syncAction,
}: GitHubSettingsFormClientProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // フォームリセット用に追加
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '', // 初期値は空にするか、サーバーから渡すか検討
      accessToken: '',
      autoSync: false,
    },
  });

  // フォーム送信時の処理
  const onSubmit = async (data: FormData) => {
    try {
      const result = await saveSettingsAction(data);
      if (!result.success) {
        throw (
          result.error || new Error('設定保存中に不明なエラーが発生しました。')
        );
      }

      // 警告がある場合は警告トースト
      if (result.warning) {
        toast.warning(result.warning);
      } else {
        toast.success('GitHub連携の設定を更新しました。');
      }

      reset(); // 保存成功後にフォームをリセット
      // 必要に応じて親コンポーネントに通知やデータ再取得のトリガー
    } catch (error) {
      console.error('設定保存エラー:', error);
      toast.error(
        `設定の更新に失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  // 同期ボタンクリック時の処理
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncAction();
      if (!result.success) {
        throw result.error || new Error('同期中に不明なエラーが発生しました。');
      }
      toast.success('GitHubの貢献データを同期しました。');
    } catch (error) {
      console.error('同期エラー:', error);
      toast.error(
        `同期に失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub連携設定</CardTitle>
        <CardDescription>
          GitHubとの連携設定を行います。アクセストークンは
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub Developer Settings
          </a>
          から取得してください。
          <div className="mt-2 text-sm border border-muted p-2 rounded-md bg-muted/30">
            <p className="font-medium">トークンの設定方法:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>
                <strong>クラシックトークン</strong>の場合: <code>repo</code>
                スコープを選択して、プライベートリポジトリへのアクセスを許可してください。
              </li>
              <li>
                <strong>Fine-grained token</strong>の場合: 「Repository
                access」で「All repositories」を選択し、「Repository
                permissions」の「Contents」と「Metadata」に「Read-only」権限を設定してください。
              </li>
            </ul>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">GitHubユーザー名</Label>
            <Input
              id="username"
              {...register('username')}
              placeholder="octocat"
              disabled={isSubmitting || isSyncing}
            />
            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessToken">アクセストークン</Label>
            <Input
              id="accessToken"
              type="password"
              {...register('accessToken')}
              placeholder="ghp_xxxxxxxxxxxxxxxx"
              disabled={isSubmitting || isSyncing}
            />
            {errors.accessToken && (
              <p className="text-sm text-destructive">
                {errors.accessToken.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="autoSync"
              {...register('autoSync')}
              disabled={isSubmitting || isSyncing}
            />
            <Label htmlFor="autoSync">自動同期を有効にする</Label>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={isSubmitting || isSyncing}>
              {isSubmitting ? '保存中...' : '設定を保存'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSync}
              disabled={isSyncing || isSubmitting}
            >
              {isSyncing ? '同期中...' : '今すぐ同期'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
