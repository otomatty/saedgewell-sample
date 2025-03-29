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
import { saveGitHubSettings, syncGitHubContributions } from '@kit/next/actions';
import { useState } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
  username: z.string().min(1, 'ユーザー名を入力してください'),
  accessToken: z.string().min(1, 'アクセストークンを入力してください'),
  autoSync: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export function GitHubSettingsForm() {
  const [isSyncing, setIsSyncing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      accessToken: '',
      autoSync: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log('フォーム送信データ:', data);

      if (!data.username || !data.accessToken) {
        throw new Error('ユーザー名とアクセストークンは必須です');
      }

      const result = await saveGitHubSettings({
        username: data.username,
        accessToken: data.accessToken,
        autoSync: data.autoSync ?? false,
      });

      console.log('保存結果:', result);

      if (!result.success) {
        throw result.error;
      }

      toast.success('GitHub連携の設定を更新しました。');
    } catch (error) {
      console.error('設定保存エラー:', error);
      toast.error('設定の更新に失敗しました。');
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncGitHubContributions();
      if (result.success) {
        toast.success('GitHubの貢献データを同期しました。');
      } else {
        throw new Error('同期に失敗しました');
      }
    } catch (error) {
      toast.error('同期に失敗しました。');
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
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            console.log('フォーム送信イベント発火');
            handleSubmit(onSubmit)(e);
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="username">GitHubユーザー名</Label>
            <Input
              id="username"
              {...register('username')}
              placeholder="octocat"
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
            />
            {errors.accessToken && (
              <p className="text-sm text-destructive">
                {errors.accessToken.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="autoSync" {...register('autoSync')} />
            <Label htmlFor="autoSync">自動同期を有効にする</Label>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={isSubmitting}>
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
