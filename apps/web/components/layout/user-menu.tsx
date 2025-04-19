'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@kit/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import type { ProfileWithRole } from '@kit/types/profile';
import { useMemo } from 'react';

interface UserMenuProps {
  profile: ProfileWithRole;
}

export const UserMenu = ({ profile }: UserMenuProps) => {
  const signOut = useSignOut();

  // 環境に応じた管理者ページのURLを生成
  const adminUrl = useMemo(() => {
    // ホスト名を取得（クライアントサイドでのみ実行される）
    const host = typeof window !== 'undefined' ? window.location.host : '';

    // 開発環境と本番環境の判定
    let adminDomain = '';

    if (host.includes('saedgewell.test')) {
      // 開発環境: *.saedgewell.test
      adminDomain = 'admin.saedgewell.test/home';
    } else if (host.includes('saedgewell.net')) {
      // 本番環境: *.saedgewell.net
      adminDomain = 'admin.saedgewell.net/home';
    } else if (host.includes('localhost')) {
      // ローカル開発環境
      const port = process.env.NEXT_PUBLIC_ADMIN_PORT || '3002';
      adminDomain = `localhost:${port}/home`;
    } else {
      // その他の環境（フォールバック）
      return '/admin';
    }

    // プロトコルを含めた完全なURLを返す
    const protocol =
      typeof window !== 'undefined' ? window.location.protocol : 'https:';
    return `${protocol}//${adminDomain}`;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={profile.avatarUrl ?? '/images/default-avatar.png'}
            alt={profile.fullName ?? 'ユーザー'}
          />
          <AvatarFallback>
            {profile.fullName?.[0]?.toUpperCase() ?? 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{profile.fullName ?? 'ユーザー'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/app/dashboard" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            ダッシュボード
          </Link>
        </DropdownMenuItem>
        {profile.isAdmin && (
          <DropdownMenuItem asChild>
            <Link
              href={adminUrl}
              className="cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Settings className="mr-2 h-4 w-4" />
              管理者ページ
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
