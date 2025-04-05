'use client';

import Link from 'next/link';
import { Button } from '@kit/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ドキュメントナビゲーションのプロパティ
 */
export interface DocNavigationProps {
  adjacentDocs?: {
    prev: { title: string; slug: string[] } | null;
    next: { title: string; slug: string[] } | null;
  };
}

/**
 * ドキュメントの前後ページへのナビゲーションを表示するコンポーネント
 * @param adjacentDocs 前後のドキュメント情報
 */
export function DocNavigation({ adjacentDocs }: DocNavigationProps) {
  if (!adjacentDocs) return null;

  return (
    <div className="flex justify-between items-center mt-12 mb-8 w-full max-w-[1000px] mx-auto border-t border-gray-200 dark:border-gray-800 pt-6">
      <div>
        {adjacentDocs.prev && (
          <Link href={`/${adjacentDocs.prev.slug.join('/')}`} passHref>
            <Button variant="ghost" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="text-xs text-muted-foreground">
                  前のページ
                </span>
                <span className="text-sm font-medium">
                  {adjacentDocs.prev.title}
                </span>
              </div>
            </Button>
          </Link>
        )}
      </div>
      <div>
        {adjacentDocs.next && (
          <Link href={`/${adjacentDocs.next.slug.join('/')}`} passHref>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground">
                  次のページ
                </span>
                <span className="text-sm font-medium">
                  {adjacentDocs.next.title}
                </span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
