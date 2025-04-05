'use client';

import { LoginDialog } from '~/components/auth/login-dialog';
import { UserMenu } from './user-menu';
import type { ProfileWithRole } from '@kit/types/profile';
import { Skeleton } from '@kit/ui/skeleton';
import { ThemeToggle } from '@kit/ui/theme-toggle';
import { Logo } from '~/components/icons/logo';
import Link from 'next/link';
import { useEffect } from 'react';

interface HeaderProps {
  profile: ProfileWithRole | null;
}

export const Header = ({ profile }: HeaderProps) => {
  const isAuthenticated = !!profile;

  // デバッグ用のログ出力（クライアントサイド）
  useEffect(() => {
    console.log('[HEADER-DEBUG] Received profile:', {
      isAuthenticated,
      profileExists: !!profile,
      profileId: profile?.id,
      profileEmail: profile?.email,
      profileData: profile
        ? `${JSON.stringify(profile).slice(0, 100)}...`
        : 'null',
    });
  }, [profile, isAuthenticated]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
          {/* TODO: ナビゲーションメニューを追加 */}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {profile ? (
            <UserMenu profile={profile} />
          ) : isAuthenticated ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            <LoginDialog />
          )}
        </div>
      </div>
    </header>
  );
};
