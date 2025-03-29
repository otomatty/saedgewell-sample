'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navigation } from './Navigation';
import { MobileSidebar } from './MobileSidebar';
import { Skeleton } from '@kit/ui/skeleton';
import { UserMenu } from './UserMenu';
import type { ProfileWithRole } from '@kit/types/profile';
import { ContactDialog } from '~/components/contacts/contact-dialog';
import { ThemeToggle } from '@kit/ui/theme-toggle';
import { LoginDialog } from '~/components/auth/login-dialog';

interface HeaderProps {
  profile: ProfileWithRole | null;
}

export const Header = ({ profile }: HeaderProps) => {
  const isAuthenticated = !!profile;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60"
    >
      <div className="container flex h-16 items-center mx-auto px-4">
        <div className="mr-8">
          <Link href="/" className="text-xl font-bold">
            Saedgewell
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* デスクトップ用のナビゲーションとユーザーメニュー */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Navigation />
            <ThemeToggle />
            <ContactDialog />
            {profile ? (
              <UserMenu profile={profile} />
            ) : isAuthenticated ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : (
              <LoginDialog />
            )}
          </div>

          {/* モバイル用のサイドバー */}
          <MobileSidebar profile={profile} />
        </div>
      </div>
    </motion.header>
  );
};
