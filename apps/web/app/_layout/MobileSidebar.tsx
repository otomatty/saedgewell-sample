'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@kit/ui/sheet';
import { Separator } from '@kit/ui/separator';
import { Button } from '@kit/ui/button';
import { Menu, ChevronDown, LogOut } from 'lucide-react';
import { cn } from '@kit/ui/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@kit/ui/avatar';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@kit/ui/collapsible';
import type { Profile, ProfileWithRole } from '~/types/profile';
import { LoginDialog } from '~/components/auth/login-dialog';

const navigationItems = [
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Works',
    href: '/works',
  },
  {
    title: 'Services',
    items: [
      {
        title: 'サービス一覧',
        href: '/services',
      },
      {
        title: '開発プロセス',
        href: '/services/process',
      },
      {
        title: '料金',
        href: '/services/pricing',
      },
      {
        title: '見積もり',
        href: '/services/estimate',
      },
    ],
  },
  {
    title: 'Blog',
    href: '/blog',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
] as const;

interface MobileSidebarProps {
  profile: ProfileWithRole | null;
}

export const MobileSidebar = ({ profile }: MobileSidebarProps) => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const supabase = getSupabaseBrowserClient();
  const isAuthenticated = !!profile;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>メニュー</SheetTitle>

        <nav className="flex flex-col gap-1 p-4">
          {navigationItems.map((item) => {
            if ('items' in item) {
              const isActive = item.items.some(
                (subItem) => subItem.href === pathname
              );
              return (
                <Collapsible
                  key={item.title}
                  open={servicesOpen}
                  onOpenChange={setServicesOpen}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-between px-4 py-2 text-sm font-medium',
                        {
                          'bg-accent': isActive,
                        }
                      )}
                    >
                      {item.title}
                      <ChevronDown
                        className={cn('h-4 w-4 transition-transform', {
                          'rotate-180': servicesOpen,
                        })}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 px-4">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'block px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors',
                          {
                            'bg-accent': pathname === subItem.href,
                          }
                        )}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            }
            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors',
                  {
                    'bg-accent': pathname === item.href,
                  }
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
          {isAuthenticated && profile ? (
            <>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={profile.avatarUrl ?? '/images/default-avatar.png'}
                    alt={profile.fullName ?? 'ユーザー'}
                  />
                  <AvatarFallback>
                    {profile.fullName?.[0]?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {profile.fullName ?? 'ユーザー'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile.email}
                  </p>
                </div>
              </div>
              <Separator />
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </Button>
            </>
          ) : (
            <LoginDialog />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
