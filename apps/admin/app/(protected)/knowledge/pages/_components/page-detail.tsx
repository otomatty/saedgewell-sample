import { Badge } from '@kit/ui/badge';
import { ScrollArea } from '@kit/ui/scroll-area';

interface PageDetailProps {
  id: string;
}

export function PageDetail({ id }: PageDetailProps) {
  return (
    <div className="space-y-6">
      {/* TODO: 実際のデータを使用 */}
      <div>
        <h2 className="text-2xl font-bold">Next.js 15の新機能</h2>
        <p className="text-muted-foreground">tech-notes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-sm font-medium">作成日時</p>
          <p className="text-sm text-muted-foreground">2024-02-01 10:00</p>
        </div>
        <div>
          <p className="text-sm font-medium">更新日時</p>
          <p className="text-sm text-muted-foreground">2024-02-14 15:30</p>
        </div>
        <div>
          <p className="text-sm font-medium">最終アクセス</p>
          <p className="text-sm text-muted-foreground">1時間前</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">説明</p>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Next.js 15で導入された新機能について
          </p>
          <p className="text-sm text-muted-foreground">
            Server Actionsの改善点
          </p>
          <p className="text-sm text-muted-foreground">パフォーマンス最適化</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">本文</p>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-4">
            <h1 className="text-xl font-bold"># Next.js 15の新機能</h1>
            <p>## Server Actions の改善</p>
            <ul className="list-disc list-inside space-y-2">
              <li>フォームのバリデーション機能の強化</li>
              <li>エラーハンドリングの改善</li>
            </ul>
            <p>## パフォーマンスの最適化</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Partial Prerendering の導入</li>
              <li>キャッシュの最適化</li>
            </ul>
          </div>
        </ScrollArea>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">メタデータ</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">📝 編集可能</Badge>
          <Badge variant="secondary">⚡ 更新頻度: 高</Badge>
          <Badge variant="secondary">👀 閲覧数: 100</Badge>
          <Badge variant="secondary">🔗 リンク数: 5</Badge>
        </div>
      </div>
    </div>
  );
}
