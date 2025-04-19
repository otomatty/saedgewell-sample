import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Switch } from '@kit/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';

export function SyncSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>自動同期</Label>
          <p className="text-sm text-muted-foreground">
            定期的に自動で同期を実行します
          </p>
        </div>
        <Switch />
      </div>

      <div className="space-y-2">
        <Label>同期間隔</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="同期間隔を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15分</SelectItem>
            <SelectItem value="30">30分</SelectItem>
            <SelectItem value="60">1時間</SelectItem>
            <SelectItem value="180">3時間</SelectItem>
            <SelectItem value="360">6時間</SelectItem>
            <SelectItem value="720">12時間</SelectItem>
            <SelectItem value="1440">24時間</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>同期エラー通知</Label>
        <Input placeholder="通知用のメールアドレス" type="email" />
        <p className="text-sm text-muted-foreground">
          同期エラーが発生した場合に通知を送信します
        </p>
      </div>

      <div className="pt-4">
        <Button className="w-full">設定を保存</Button>
      </div>
    </div>
  );
}
