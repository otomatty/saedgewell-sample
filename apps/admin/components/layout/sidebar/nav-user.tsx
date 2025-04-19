'use client';
// library
import { useRouter } from 'next/navigation';
// ui
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@kit/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@kit/ui/sidebar';
// types
import type { Profile } from '@kit/types/profile';
import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import { Skeleton } from '@kit/ui/skeleton';

// ProfileForLayout 型をインポートまたは定義 (AdminSidebar と合わせる)
type ProfileForLayout = Pick<
  Profile,
  'id' | 'email' | 'fullName' | 'avatarUrl' | 'role' | 'isAdmin'
>;

interface AdminNavUserProps {
  profile?: ProfileForLayout;
}

export function AdminNavUser({ profile }: AdminNavUserProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const signOut = useSignOut();

  if (!profile) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 p-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="ml-auto h-4 w-4" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={profile.avatarUrl ?? '/images/default-avatar.png'}
                  alt={profile.fullName ?? 'ユーザー'}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {profile.fullName}
                </span>
                <span className="truncate text-xs">{profile.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={profile.avatarUrl ?? '/images/default-avatar.png'}
                    alt={profile.fullName ?? 'ユーザー'}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {profile.fullName}
                  </span>
                  <span className="truncate text-xs">{profile.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* ホームに戻る */}
            <DropdownMenuItem onClick={() => router.push('/')}>
              <LogOut />
              ホームに戻る
            </DropdownMenuItem>
            {/* ログアウト */}
            <DropdownMenuItem
              onClick={() => signOut.mutate()}
              className="text-destructive"
            >
              <LogOut />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
