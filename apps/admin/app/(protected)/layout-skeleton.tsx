'use client';

import { Skeleton } from '@kit/ui/skeleton';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
  SidebarFooter,
} from '@kit/ui/sidebar';

export default function AdminLayoutSkeleton() {
  return (
    <SidebarProvider open={true}>
      <Sidebar collapsible="icon" className="w-64 border-r">
        <div className="h-[var(--sidebar-header-height,56px)] border-b p-4">
          <Skeleton className="h-8 w-full" />
        </div>
        <SidebarContent className="p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-16 mb-2 mt-4" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </SidebarContent>
        <SidebarFooter className="border-t p-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="ml-auto h-4 w-4" />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-4 w-px mx-2" />
          <div className="flex-1" />
          <Skeleton className="h-8 w-8" />
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}
