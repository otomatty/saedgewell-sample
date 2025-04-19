'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Switch } from '@kit/ui/switch';
import { toast } from 'sonner';
import { useCallback, useEffect, useState } from 'react';
import {
  getProjectSyncSettings,
  updateProjectSyncSettings,
} from '~/actions/knowledge';

interface ProjectSettingsProps {
  projectId: string;
}

export function ProjectSettings({ projectId }: ProjectSettingsProps) {
  const [scrapboxCookie, setScrapboxCookie] = useState('');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const settings = await getProjectSyncSettings(projectId);
      if (settings.error) {
        throw new Error(settings.error);
      }
      setScrapboxCookie(settings.scrapbox_cookie || '');
      setAutoSyncEnabled(settings.auto_sync_enabled);
      setIsPrivate(settings.is_private);
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

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProjectSyncSettings(projectId, {
        scrapbox_cookie: scrapboxCookie,
        auto_sync_enabled: autoSyncEnabled,
        is_private: isPrivate,
      });

      if (result.success) {
        toast.success('設定を保存しました', {
          description: 'プロジェクトの同期設定を更新しました。',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('設定の保存に失敗しました', {
        description:
          error instanceof Error
            ? error.message
            : '不明なエラーが発生しました。',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>同期設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Scrapbox Cookie</Label>
            <Input
              type="password"
              placeholder="connect.sid=..."
              value={scrapboxCookie}
              onChange={(e) => setScrapboxCookie(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              非公開プロジェクトの場合、プロジェクト固有のCookieを設定できます。
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>自動同期</Label>
              <p className="text-sm text-muted-foreground">
                1時間ごとに自動で同期を実行します
              </p>
            </div>
            <Switch
              checked={autoSyncEnabled}
              onCheckedChange={setAutoSyncEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>非公開プロジェクト</Label>
              <p className="text-sm text-muted-foreground">
                このプロジェクトは非公開として扱われます
              </p>
            </div>
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          <Button className="w-full" onClick={handleSave} disabled={isSaving}>
            {isSaving ? '保存中...' : '設定を保存'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>表示設定</CardTitle>
          <CardDescription>
            プロジェクトの表示に関する設定を行います
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>プロジェクト名</Label>
            <Input placeholder="プロジェクト名を入力" />
          </div>

          <div className="space-y-2">
            <Label>Scrapbox URL</Label>
            <Input placeholder="Scrapboxのプロジェクトページ URL" />
          </div>

          <Button>設定を保存</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">危険な操作</CardTitle>
          <CardDescription>
            これらの操作は取り消すことができません
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>プロジェクトの削除</Label>
            <p className="text-sm text-muted-foreground">
              プロジェクトとそれに関連するすべてのデータを削除します
            </p>
            <Button variant="destructive">プロジェクトを削除</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
