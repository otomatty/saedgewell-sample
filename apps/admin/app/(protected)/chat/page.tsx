import { Skeleton } from '@kit/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { PageHeader } from '@kit/ui/page-header';

export default function ChatPage() {
  return (
    <>
      <PageHeader title="チャット" />
      <div className="grid gap-4 md:grid-cols-[300px_1fr] container">
        {/* チャットリスト */}
        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader>
            <CardTitle>会話一覧</CardTitle>
            <CardDescription>最近のチャット履歴</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* チャット本文 */}
        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader>
            <CardTitle>メッセージ</CardTitle>
            <CardDescription>選択された会話の内容</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="ml-auto h-16 w-3/4" />
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="ml-auto h-16 w-3/4" />
                <Skeleton className="h-16 w-3/4" />
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
