import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Switch } from '@kit/ui/switch';

export function ProjectSettings() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>プロジェクト名</Label>
        <Input placeholder="my-project" />
      </div>

      <div className="space-y-2">
        <Label>Scrapbox Cookie</Label>
        <Input type="password" placeholder="connect.sid=..." />
        <p className="text-sm text-muted-foreground">
          ScrapboxのCookieを入力してください。これは非公開プロジェクトへのアクセスに必要です。
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>自動同期</Label>
          <p className="text-sm text-muted-foreground">
            1時間ごとに自動で同期を実行します
          </p>
        </div>
        <Switch />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>非公開プロジェクト</Label>
          <p className="text-sm text-muted-foreground">
            このプロジェクトは非公開として扱われます
          </p>
        </div>
        <Switch />
      </div>

      <div className="pt-4">
        <Button className="w-full">設定を保存</Button>
      </div>
    </div>
  );
}
