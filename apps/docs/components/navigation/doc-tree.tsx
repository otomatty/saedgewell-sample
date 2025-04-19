'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@kit/ui/utils';
import { ChevronRight, Folder } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@kit/ui/collapsible';
import type { DocNode } from '~/types/mdx';
import { getDocPath } from '~/lib/utils/path';

interface DocTreeProps {
  items: DocNode[];
  className?: string;
  docType: string;
}

export function DocTree({ items, className, docType }: DocTreeProps) {
  const pathname = usePathname();

  // トップページ（/）または404ページの場合は何も表示しない
  if (
    pathname === '/' ||
    pathname === '/404' ||
    !pathname.startsWith(`/${docType}`)
  ) {
    return null;
  }

  // アンダースコアで始まるディレクトリを除外したアイテムをフィルタリング
  const filteredItems = items.filter((item) => {
    const slugParts = item.slug?.split('/') || [];
    return !slugParts.some((part) => part.startsWith('_'));
  });

  return (
    <div className={cn('space-y-1', className)}>
      {filteredItems.map((item) => (
        <TreeItem
          key={item.slug || item.title}
          item={item}
          docType={docType}
          pathname={pathname}
        />
      ))}
    </div>
  );
}

interface TreeItemProps {
  item: DocNode;
  docType: string;
  pathname: string;
}

function TreeItem({ item, docType, pathname }: TreeItemProps) {
  // 正しいパスを生成して現在のページかどうかを判定
  const itemPath = getDocPath(docType, item.slug);
  const isCurrentPage = pathname === itemPath;
  const isDirectory = !item.slug || item.children?.length > 0;

  // ファイルの場合
  if (!isDirectory) {
    return (
      <Link
        href={itemPath}
        className={cn(
          'block w-full rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
          isCurrentPage
            ? 'bg-accent text-accent-foreground'
            : 'text-foreground/60'
        )}
      >
        {item.title}
      </Link>
    );
  }

  // ディレクトリの場合
  return (
    <Collapsible
      className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      defaultOpen={
        isCurrentPage ||
        item.children?.some((child) => {
          const childPath = getDocPath(docType, child.slug);
          return pathname === childPath;
        })
      }
    >
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
            'text-foreground/60'
          )}
        >
          <ChevronRight className="h-4 w-4 shrink-0 transition-transform" />
          <Folder className="h-4 w-4 shrink-0" />
          {item.title}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-4 space-y-1">
          {item.children?.map((child) => (
            <TreeItem
              key={child.slug || child.title}
              item={child}
              docType={docType}
              pathname={pathname}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
