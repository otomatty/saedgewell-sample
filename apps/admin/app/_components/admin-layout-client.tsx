'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from './header';
import { AdminSidebar } from './sidebar';
import { SidebarProvider } from '@kit/ui/sidebar';
import { SidebarInset } from '@kit/ui/sidebar';
import { sidebarOpenAtom } from '~/store/sidebar';
import { useAtom } from 'jotai';
import type { Profile } from '@kit/types/profile';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  profile: Profile;
  projects: Array<{
    id: string;
    name: string;
    emoji: string;
  }>;
}

export function AdminLayoutClient({
  children,
  profile,
  projects,
}: AdminLayoutClientProps) {
  const [open, setOpen] = useAtom(sidebarOpenAtom);
  const router = useRouter();

  useEffect(() => {
    if (!profile || !projects) {
      console.error('Missing required props in AdminLayoutClient');
      router.replace('/');
      return;
    }
  }, [profile, projects, router]);

  if (!profile || !projects) {
    return null;
  }

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AdminSidebar profile={profile} projects={projects} />
      <SidebarInset>
        <AdminHeader
          breadcrumbs={[
            { id: 1, label: '管理画面', href: '/admin' },
            { id: 2, label: 'ダッシュボード', current: true },
          ]}
        />
        <div className="flex flex-1 flex-col gap-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
