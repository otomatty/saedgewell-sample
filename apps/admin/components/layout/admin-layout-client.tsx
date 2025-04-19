'use client';

import { usePathname } from 'next/navigation';
import { AdminHeader } from './header';
import { AdminSidebar } from './sidebar';
import { SidebarProvider } from '@kit/ui/sidebar';
import { SidebarInset } from '@kit/ui/sidebar';
import { sidebarOpenAtom } from '~/store/sidebar';
import { useAtom } from 'jotai';
import type { Profile } from '@kit/types/profile';
import { use } from 'react';

// getProfileForLayout の戻り値の型 (Pick<...>) を定義
type ProfileForLayout = Pick<
  Profile,
  'id' | 'email' | 'fullName' | 'avatarUrl' | 'role' | 'isAdmin'
>;

// breadcrumbsの型定義
interface Breadcrumb {
  id: number;
  href?: string;
  label: string;
  current?: boolean;
}

interface AdminLayoutClientProps {
  children: React.ReactNode;
  profile?: Promise<ProfileForLayout | undefined> | ProfileForLayout;
  projects?:
    | Promise<Array<{ id: string; name: string; emoji: string }>>
    | Array<{ id: string; name: string; emoji: string }>;
}

// パス部分を読みやすいラベルに変換
const pathToLabel: Record<string, string> = {
  home: 'ホーム',
  users: 'ユーザー管理',
  projects: 'プロジェクト',
  settings: '設定',
  // 必要に応じて追加
};

export function AdminLayoutClient({
  children,
  profile: profileProp,
  projects: projectsProp,
}: AdminLayoutClientProps) {
  const [open, setOpen] = useAtom(sidebarOpenAtom);
  const pathname = usePathname();

  // useフックでPromiseを解決
  // profileProp が Promise のインスタンスかチェック
  const profile =
    profileProp instanceof Promise ? use(profileProp) : profileProp;
  // projectsProp が Promise のインスタンスかチェック
  const projects =
    projectsProp instanceof Promise ? use(projectsProp) : projectsProp;

  // 現在のパスからbreadcrumbsを生成する関数
  const generateBreadcrumbs = (): Breadcrumb[] => {
    const pathSegments = pathname.split('/').filter(Boolean);

    // 常に管理画面をルートとして表示
    const breadcrumbs: Breadcrumb[] = [
      { id: 1, label: 'ホーム', href: '/home' },
    ];

    // パス階層に応じてbreadcrumbsを生成
    let currentPath = '/home';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        id: breadcrumbs.length + 1,
        label: pathToLabel[segment] || segment, // マッピングがあればそれを使用、なければセグメント名そのまま
        href: currentPath,
        current: index === pathSegments.length - 1, // 最後のセグメントが現在のページ
      });
    });

    // breadcrumbsが1つしかない場合（管理画面のルートのみ）はホームを追加
    if (breadcrumbs.length === 1) {
      breadcrumbs.push({
        id: 2,
        label: 'ホーム',
        current: true,
      });
    }

    return breadcrumbs;
  };

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AdminSidebar profile={profile} projects={projects} />
      <SidebarInset>
        <AdminHeader breadcrumbs={generateBreadcrumbs()} />
        <div className="flex flex-1 flex-col gap-4 p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
