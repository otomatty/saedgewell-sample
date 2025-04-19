import { ScrollArea } from '@kit/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@kit/ui/avatar';
import { Badge } from '@kit/ui/badge';

interface PageCollaboratorsProps {
  id: string;
}

export function PageCollaborators({ id }: PageCollaboratorsProps) {
  return (
    <div className="space-y-4">
      {/* TODO: 実際のデータを使用 */}
      <div>
        <h3 className="text-sm font-medium mb-2">最終編集者</h3>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">saedgewell</p>
            <p className="text-sm text-muted-foreground">1時間前</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">編集者一覧</h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">collaborator1</p>
                <p className="text-sm text-muted-foreground">2時間前</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">collaborator2</p>
                <p className="text-sm text-muted-foreground">3時間前</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">編集履歴</h3>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            <div className="text-sm">
              <p className="text-muted-foreground">2024-02-14 15:30</p>
              <p>Server Actionsの説明を追加</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">2024-02-14 14:00</p>
              <p>パフォーマンス最適化の項目を追加</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">2024-02-14 13:00</p>
              <p>ページを作成</p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
