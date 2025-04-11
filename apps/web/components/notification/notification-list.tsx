import { useAtom } from 'jotai';
import { ScrollArea } from '@kit/ui/scroll-area';
import { notificationsAtom } from '~/store/notification';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { cn } from '@kit/ui/utils';

/**
 * 通知一覧コンポーネント
 */
export function NotificationList() {
  const [notifications] = useAtom(notificationsAtom);

  if (notifications.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        通知はありません
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-1 p-1">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              'flex flex-col gap-1 rounded-lg p-3 text-sm transition-colors hover:bg-muted/50',
              !notification.isRead && 'bg-muted'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{notification.title}</span>
              <time className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                  locale: ja,
                })}
              </time>
            </div>
            <p className="text-muted-foreground">{notification.content}</p>
            {notification.link && (
              <a
                href={notification.link}
                className="text-xs text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                詳細を見る
              </a>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
