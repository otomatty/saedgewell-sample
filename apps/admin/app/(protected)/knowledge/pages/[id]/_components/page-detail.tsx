'use client';

import { Star } from 'lucide-react';
import { Badge } from '@kit/ui/badge';
import type { Database } from '@kit/supabase/database';
import type { Json } from '@kit/supabase/database';

type KnowledgePage = Database['public']['Tables']['knowledge_pages']['Row'] & {
  project_name: string;
  collaborators: {
    name: string;
    display_name: string;
    photo_url: string | null;
    is_last_editor: boolean;
  }[];
  details: {
    lines: string[] | Json;
    icons: string[];
    files: string[];
  } | null;
};

interface PageDetailProps {
  page: KnowledgePage;
}

export function PageDetail({ page }: PageDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            {page.pin_status > 0 && (
              <Star className="h-4 w-4 text-yellow-500" />
            )}
            <h2 className="text-2xl font-bold">{page.title}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{page.project_name}</p>
        </div>
        <Badge variant={page.persistent ? 'default' : 'destructive'}>
          {page.persistent ? '有効' : '無効'}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="font-semibold">メタデータ</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">閲覧数</dt>
              <dd>{page.views}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">被リンク数</dt>
              <dd>{page.linked_count}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">スナップショット数</dt>
              <dd>{page.snapshot_count}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">ページランク</dt>
              <dd>{page.page_rank.toFixed(2)}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">タイムライン</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">作成日時</dt>
              <dd>{new Date(page.created_at).toLocaleString('ja-JP')}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">更新日時</dt>
              <dd>{new Date(page.updated_at).toLocaleString('ja-JP')}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">最終アクセス</dt>
              <dd>
                {page.last_accessed_at
                  ? new Date(page.last_accessed_at).toLocaleString('ja-JP')
                  : 'なし'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">最終スナップショット</dt>
              <dd>
                {page.snapshot_created_at
                  ? new Date(page.snapshot_created_at).toLocaleString('ja-JP')
                  : 'なし'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {page.descriptions.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">説明</h3>
          <div className="space-y-1">
            {page.descriptions.map((description: string) => (
              <p
                key={`${crypto.randomUUID()}`}
                className="text-sm text-muted-foreground"
              >
                {description}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
