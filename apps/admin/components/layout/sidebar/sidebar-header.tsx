'use client';

import Link from 'next/link';
import Image from 'next/image';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@kit/ui/sidebar';

export function AdminSidebarHeader() {
  return (
    <SidebarHeader className="border-b">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Image
                  src="/images/saedgewell_logo_light.svg"
                  alt="Saedgewell"
                  width={32}
                  height={32}
                />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">Saedgewell</span>
                <span className="truncate text-xs text-muted-foreground">
                  Portfolio
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
