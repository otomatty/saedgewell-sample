import { ScrollArea } from '@kit/ui/scroll-area';
import Link from 'next/link';

interface PageLinksProps {
  id: string;
}

export function PageLinks({ id }: PageLinksProps) {
  return (
    <div className="space-y-6">
      {/* TODO: 実際のデータを使用 */}
      <div>
        <h3 className="text-sm font-medium mb-2">リンク元（5ページ）</h3>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            <Link
              href="/admin/knowledge/pages/4"
              className="block hover:bg-muted p-2 rounded-md transition-colors"
            >
              <div>
                <p className="font-medium">Server Actionsの実装例</p>
                <p className="text-sm text-muted-foreground">tech-notes</p>
              </div>
            </Link>
            <Link
              href="/admin/knowledge/pages/5"
              className="block hover:bg-muted p-2 rounded-md transition-colors"
            >
              <div>
                <p className="font-medium">Next.jsの最新アップデート</p>
                <p className="text-sm text-muted-foreground">tech-notes</p>
              </div>
            </Link>
          </div>
        </ScrollArea>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">リンク先（3ページ）</h3>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            <Link
              href="/admin/knowledge/pages/6"
              className="block hover:bg-muted p-2 rounded-md transition-colors"
            >
              <div>
                <p className="font-medium">TypeScriptのベストプラクティス</p>
                <p className="text-sm text-muted-foreground">tech-notes</p>
              </div>
            </Link>
            <Link
              href="/admin/knowledge/pages/7"
              className="block hover:bg-muted p-2 rounded-md transition-colors"
            >
              <div>
                <p className="font-medium">Supabaseの認証機能</p>
                <p className="text-sm text-muted-foreground">tech-notes</p>
              </div>
            </Link>
          </div>
        </ScrollArea>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">関連ページ（2-hop）</h3>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            <Link
              href="/admin/knowledge/pages/8"
              className="block hover:bg-muted p-2 rounded-md transition-colors"
            >
              <div>
                <p className="font-medium">React Server Components</p>
                <p className="text-sm text-muted-foreground">tech-notes</p>
              </div>
            </Link>
            <Link
              href="/admin/knowledge/pages/9"
              className="block hover:bg-muted p-2 rounded-md transition-colors"
            >
              <div>
                <p className="font-medium">Edge Runtime</p>
                <p className="text-sm text-muted-foreground">tech-notes</p>
              </div>
            </Link>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
