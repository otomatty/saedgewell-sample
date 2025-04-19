'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DocNavigationProps } from '../doc-navigation';

/**
 * コンパクトなミニナビゲーションコンポーネント
 * モバイル表示や限られたスペースでの使用に適しています
 */
export function MiniNavigation({ adjacentDocs }: DocNavigationProps) {
  if (!adjacentDocs) return null;

  return (
    <div className="flex justify-between items-center my-4 w-full">
      <div>
        {adjacentDocs.prev && (
          <Link
            href={`/${adjacentDocs.prev.slug.join('/')}`}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            title={adjacentDocs.prev.title}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="sr-only md:not-sr-only md:line-clamp-1 md:max-w-[100px]">
              {adjacentDocs.prev.title}
            </span>
          </Link>
        )}
      </div>
      <div>
        {adjacentDocs.next && (
          <Link
            href={`/${adjacentDocs.next.slug.join('/')}`}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            title={adjacentDocs.next.title}
          >
            <span className="sr-only md:not-sr-only md:line-clamp-1 md:max-w-[100px]">
              {adjacentDocs.next.title}
            </span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
