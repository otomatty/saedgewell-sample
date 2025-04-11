'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Navigation } from './navigation';
import { MobileSidebar } from './mobile-sidebar';
import { Skeleton } from '@kit/ui/skeleton';
import { UserMenu } from './user-menu';
import type { ProfileWithRole } from '@kit/types/profile';
import { ContactDialog } from '~/components/contacts/contact-dialog';
import { ThemeToggle } from '@kit/ui/theme-toggle';
import { LoginDialog } from '~/components/auth/login-dialog';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { Button } from '@kit/ui/button';
import { InfoIcon } from 'lucide-react';

interface HeaderProps {
  profile: ProfileWithRole | null;
}

export const Header = ({ profile }: HeaderProps) => {
  const isAuthenticated = !!profile;
  const supabase = useSupabase();
  const [showDebug, setShowDebug] = useState(false);

  const toggleDebugInfo = async () => {
    setShowDebug(!showDebug);
    if (!showDebug) {
      // 追加のセッション情報を取得
      const { data } = await supabase.auth.getSession();

      // Cookie情報を表示
      if (typeof document !== 'undefined') {
        const cookiesStr = document.cookie;
        const cookies = cookiesStr.split(';').map((c) => c.trim());
        const authCookies = cookies.filter(
          (c) =>
            c.startsWith('sb-') || c.includes('supabase') || c.includes('auth')
        );
      }
    }
  };

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
            {process.env.NODE_ENV !== 'production' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDebugInfo}
                title="デバッグ情報"
              >
                <InfoIcon className="h-5 w-5" />
              </Button>
            )}
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

      {/* デバッグ情報表示エリア */}
      {showDebug && (
        <div className="bg-yellow-100 p-2 text-xs border-t border-yellow-300 overflow-auto max-h-60">
          <div>
            <strong>認証状態:</strong> {isAuthenticated ? '認証済み' : '未認証'}
          </div>
          {profile && (
            <div>
              <strong>ユーザー:</strong> {profile.email} (ID:{' '}
              {profile.id?.slice(0, 8)}...)
            </div>
          )}
          <div>
            <strong>ホスト名:</strong>{' '}
            {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}
          </div>
          <div className="mt-1">
            <strong>デバッグ情報:</strong>{' '}
            詳細はブラウザコンソールを確認してください
          </div>
        </div>
      )}
    </motion.header>
  );
};
