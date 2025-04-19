import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { ScrollArea } from '@kit/ui/scroll-area';
import { Badge } from '@kit/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export function SyncStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>同期状態</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {/* TODO: 同期状態データの取得と表示 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="font-medium">saedgewell-portfolio</p>
                  <p className="text-sm text-muted-foreground">
                    3 pages updated
                  </p>
                </div>
              </div>
              <Badge>成功</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="font-medium">tech-notes</p>
                  <p className="text-sm text-muted-foreground">同期中...</p>
                </div>
              </div>
              <Badge variant="secondary">処理中</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="font-medium">private-notes</p>
                  <p className="text-sm text-muted-foreground">API Error</p>
                </div>
              </div>
              <Badge variant="destructive">エラー</Badge>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
