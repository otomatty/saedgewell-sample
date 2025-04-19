'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from '@kit/ui/navigation-menu';
import { cn } from '@kit/ui/utils';

// 環境変数の型定義
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_DOCS_URL: string;
    }
  }
}

type NavigationSubItem = {
  title: string;
  href: string;
  description: string;
};

type NavigationItem = {
  title: string;
  href: string;
  items?: NavigationSubItem[];
};

const navigationItems: NavigationItem[] = [
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
    href: '/services',
    items: [
      {
        title: 'サービス一覧',
        href: '/services',
        description: '提供しているサービスの詳細をご確認いただけます。',
      },
      {
        title: '開発プロセス',
        href: '/services/process',
        description:
          'プロジェクトの進め方や各フェーズでの成果物について詳しくご説明します。',
      },
      {
        title: '料金',
        href: '/services/pricing',
        description: '各種成果物の料金体系をご確認いただけます。',
      },
      {
        title: '見積もり',
        href: '/services/estimate',
        description:
          '簡単な質問に答えるだけで、おおよその見積もり金額を算出できます。',
      },
    ],
  },
  {
    title: 'Resources',
    href: '/blog',
    items: [
      {
        title: 'ブログ',
        href: '/blog',
        description: '技術情報や開発に関する記事を公開しています。',
      },
      {
        title: 'スガイのメモ',
        href:
          process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_DOCS_URL || 'https://docs.saedgewell.net'
            : 'https://docs.saedgewell.test',
        description: '日々の開発や学習で得た知見をまとめています。',
      },
      {
        title: '実験場',
        href: '/sunaba',
        description: '様々なコンポーネントの動作確認や実験を行える場所です。',
      },
    ],
  },
];

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {navigationItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            {item.items ? (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {item.items.map((subItem) => (
                      <li key={subItem.href}>
                        <Link href={subItem.href} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={cn(
                              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              {
                                'bg-accent': pathname === subItem.href,
                              }
                            )}
                            {...(subItem.href.startsWith('http') && {
                              target: '_blank',
                              rel: 'noopener noreferrer',
                            })}
                          >
                            <div className="text-sm font-medium leading-none">
                              {subItem.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {subItem.description}
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), 'h-9', {
                    'bg-accent': pathname === item.href,
                  })}
                >
                  {item.title}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
