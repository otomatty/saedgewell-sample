import { useAtom } from 'jotai';
import { notificationSettingsAtom } from '~/store/notification';
import { Switch } from '@kit/ui/switch';
import { Label } from '@kit/ui/label';
import type { UpdateNotificationSettings } from '../../../../packages/types/src/notification';

interface NotificationSettingsProps {
  onUpdate: (settings: UpdateNotificationSettings) => Promise<void>;
}

/**
 * 通知設定コンポーネント
 * @param onUpdate - 設定更新時のコールバック関数
 */
export function NotificationSettings({ onUpdate }: NotificationSettingsProps) {
  const [settings] = useAtom(notificationSettingsAtom);

  if (!settings) {
    return null;
  }

  const handleToggle = async (key: keyof UpdateNotificationSettings) => {
    await onUpdate({
      [key]: !settings[key],
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="project-updates">プロジェクト更新通知</Label>
          <Switch
            id="project-updates"
            checked={settings.projectUpdates}
            onCheckedChange={() => handleToggle('projectUpdates')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="chat-messages">チャットメッセージ通知</Label>
          <Switch
            id="chat-messages"
            checked={settings.chatMessages}
            onCheckedChange={() => handleToggle('chatMessages')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="milestones">マイルストーン通知</Label>
          <Switch
            id="milestones"
            checked={settings.milestones}
            onCheckedChange={() => handleToggle('milestones')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="documents">ドキュメント通知</Label>
          <Switch
            id="documents"
            checked={settings.documents}
            onCheckedChange={() => handleToggle('documents')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="system-notifications">システム通知</Label>
          <Switch
            id="system-notifications"
            checked={settings.systemNotifications}
            onCheckedChange={() => handleToggle('systemNotifications')}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">メール通知</Label>
          <Switch
            id="email-notifications"
            checked={settings.emailNotifications}
            onCheckedChange={() => handleToggle('emailNotifications')}
          />
        </div>
      </div>
    </div>
  );
}
