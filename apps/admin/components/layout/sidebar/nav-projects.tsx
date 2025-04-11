'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@kit/ui/utils';
import { Skeleton } from '@kit/ui/skeleton';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@kit/ui/sidebar';

interface Project {
  name: string;
  url: string;
  emoji: string;
}

// パスが一致するかどうかを確認するユーティリティ関数
function isActiveLink(currentPath: string, itemPath: string): boolean {
  return currentPath.startsWith(itemPath);
}

export function NavProjects({ projects }: { projects?: Project[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>プロジェクト</SidebarGroupLabel>
      <SidebarMenu>
        {!projects ? (
          <>
            <Skeleton className="mb-2 h-8 w-full" />
            <Skeleton className="mb-2 h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </>
        ) : (
          <>
            {projects.map((item) => {
              const isActive = isActiveLink(pathname, item.url);
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'relative',
                      isActive &&
                        "after:absolute after:right-2 after:top-1/2 after:h-2 after:w-2 after:-translate-y-1/2 after:rounded-full after:bg-primary after:content-['']"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <span className="flex h-4 w-4 items-center justify-center text-base leading-none">
                        {item.emoji}
                      </span>
                      <span className="flex-1">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
