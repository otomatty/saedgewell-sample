import { Popover, PopoverContent, PopoverTrigger } from '@kit/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { NotificationIcon } from './notification-icon';
import { NotificationList } from './notification-list';
import { NotificationSettings } from './notification-settings';
import type { UpdateNotificationSettings } from '../../../../packages/types/src/notification';

interface NotificationPopoverProps {
  onUpdateSettings: (settings: UpdateNotificationSettings) => Promise<void>;
}

/**
 * 通知ポップオーバーコンポーネント
 * @param onUpdateSettings - 通知設定更新時のコールバック関数
 */
export function NotificationPopover({
  onUpdateSettings,
}: NotificationPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <NotificationIcon onClick={() => {}} />
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <Tabs defaultValue="notifications">
          <TabsList className="w-full">
            <TabsTrigger value="notifications" className="flex-1">
              通知一覧
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              通知設定
            </TabsTrigger>
          </TabsList>
          <TabsContent value="notifications" className="p-0">
            <NotificationList />
          </TabsContent>
          <TabsContent value="settings" className="p-4">
            <NotificationSettings onUpdate={onUpdateSettings} />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
