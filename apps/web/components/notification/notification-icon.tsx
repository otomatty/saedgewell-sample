import { Bell } from 'lucide-react';
import { useAtom } from 'jotai';
import { Button } from '@kit/ui/button';
import { unreadCountAtom } from '~/store/notification';

interface NotificationIconProps {
  onClick: () => void;
}

/**
 * 通知アイコンコンポーネント
 * @param onClick - クリック時のコールバック関数
 */
export function NotificationIcon({ onClick }: NotificationIconProps) {
  const [unreadCount] = useAtom(unreadCountAtom);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={onClick}
      aria-label="通知"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Button>
  );
}
