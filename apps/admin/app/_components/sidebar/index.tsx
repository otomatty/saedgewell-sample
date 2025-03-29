'use client';
// library
import type * as React from 'react';

import { AdminNavMain } from './nav-main';
import { AdminNavUser } from './nav-user';
import { AdminSidebarHeader } from './sidebar-header';
import { Sidebar, SidebarContent, SidebarFooter } from '@kit/ui/sidebar';

import type { Profile } from '@kit/types/profile';
import { navItems } from './nav-items';

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  profile: Profile;
  projects: Array<{
    id: string;
    name: string;
    emoji: string;
  }>;
}

export function AdminSidebar({
  profile,
  projects,
  ...props
}: AdminSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props} className="w-64 border-r">
      <AdminSidebarHeader />
      <SidebarContent>
        <AdminNavMain items={navItems} projects={projects} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <AdminNavUser profile={profile} />
      </SidebarFooter>
    </Sidebar>
  );
}
