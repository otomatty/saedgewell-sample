'use client';

import { Button } from '@kit/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Database } from '@kit/supabase/database';

type KnowledgePageLink = Pick<
  Database['public']['Tables']['knowledge_pages']['Row'],
  'id' | 'title'
> & {
  project_name: string;
};

interface PageLinksProps {
  links: {
    incomingLinks: KnowledgePageLink[];
    outgoingLinks: KnowledgePageLink[];
    relatedPages: KnowledgePageLink[];
  };
}

export function PageLinks({ links }: PageLinksProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {links.incomingLinks.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">
            リンク元 ({links.incomingLinks.length})
          </h3>
          <div className="space-y-1">
            {links.incomingLinks.map((link) => (
              <Button
                key={link.id}
                variant="link"
                className="h-auto p-0"
                onClick={() => router.push(`/admin/knowledge/pages/${link.id}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-sm">{link.title}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({link.project_name})
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {links.outgoingLinks.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">
            リンク先 ({links.outgoingLinks.length})
          </h3>
          <div className="space-y-1">
            {links.outgoingLinks.map((link) => (
              <Button
                key={link.id}
                variant="link"
                className="h-auto p-0"
                onClick={() => router.push(`/admin/knowledge/pages/${link.id}`)}
              >
                <span className="text-sm">{link.title}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({link.project_name})
                </span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ))}
          </div>
        </div>
      )}

      {links.relatedPages.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">
            関連ページ ({links.relatedPages.length})
          </h3>
          <div className="space-y-1">
            {links.relatedPages.map((link) => (
              <Button
                key={link.id}
                variant="link"
                className="h-auto p-0"
                onClick={() => router.push(`/admin/knowledge/pages/${link.id}`)}
              >
                <span className="text-sm">{link.title}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({link.project_name})
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {links.incomingLinks.length === 0 &&
        links.outgoingLinks.length === 0 &&
        links.relatedPages.length === 0 && (
          <div className="text-sm text-muted-foreground">
            リンク関係はありません
          </div>
        )}
    </div>
  );
}
