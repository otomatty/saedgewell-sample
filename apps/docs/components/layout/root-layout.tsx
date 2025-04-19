'use client';

import type { ReactNode } from 'react';
import { Header } from './header';
import Sidebar from './sidebar';
import Footer from './footer';
import { SidebarInset, SidebarProvider } from '@kit/ui/sidebar';
import type { ProfileWithRole } from '@kit/types/profile';
import { useEffect } from 'react';

interface RootLayoutProps {
  children: ReactNode;
  profile: ProfileWithRole | null;
}

export default function RootLayout({ children, profile }: RootLayoutProps) {
  // デバッグ用のログ出力
  useEffect(() => {
    console.log('[ROOT-LAYOUT-DEBUG] Received profile:', {
      isAuthenticated: !!profile,
      profileId: profile?.id,
      profileEmail: profile?.email,
      profileData: profile
        ? `${JSON.stringify(profile).slice(0, 100)}...`
        : 'null',
    });
  }, [profile]);

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header profile={profile} />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
