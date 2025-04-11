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
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import type { ProfileWithRole } from '~/types/profile';

interface UserMenuProps {
  profile: ProfileWithRole;
}

export const UserMenu = ({ profile }: UserMenuProps) => {
  const signOut = useSignOut();

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
            アプリケーションへ
          </Link>
        </DropdownMenuItem>
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
