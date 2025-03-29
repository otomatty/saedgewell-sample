import { Suspense } from 'react';
import { requireAdmin } from '@kit/next/actions';
import { getProfile } from '@kit/next/actions';
import { getProjects } from '@kit/next/actions';
import { redirect } from 'next/navigation';
import { AdminLayoutClient } from '../_components/admin-layout-client';
import { Skeleton } from '@kit/ui/skeleton';

// プロジェクトデータを取得するコンポーネント
async function ProjectsLoader() {
  try {
    const { data: projects, error } = await getProjects();
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return (projects || []).map((project) => ({
      id: project.id,
      name: project.name,
      emoji: project.emoji || '📁',
    }));
  } catch (error) {
    console.error('Unexpected error in ProjectsLoader:', error);
    return [];
  }
}

// プロフィールデータを取得するコンポーネント
async function ProfileLoader() {
  try {
    const profile = await getProfile();
    if (!profile) {
      console.error('Profile not found');
      redirect('/');
    }
    return profile;
  } catch (error) {
    console.error('Error in ProfileLoader:', error);
    redirect('/');
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
    const [profile, projects] = await Promise.all([
      ProfileLoader(),
      ProjectsLoader(),
    ]);

    return (
      <AdminLayoutClient profile={profile} projects={projects}>
        <Suspense fallback={<div className="p-8">読み込み中...</div>}>
          {children}
        </Suspense>
      </AdminLayoutClient>
    );
  } catch (error) {
    console.error('Admin access denied:', error);
    redirect('/');
  }
}

// 非同期データ取得を行うレイアウトコンポーネント
async function AsyncAdminLayout({ children }: { children: React.ReactNode }) {
  try {
    const [profile, projects] = await Promise.all([
      ProfileLoader(),
      ProjectsLoader(),
    ]);

    return (
      <AdminLayoutClient profile={profile} projects={projects}>
        <Suspense
          fallback={
            <div className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-4 w-[350px]" />
                <div className="grid gap-4">
                  <Skeleton className="h-[125px]" />
                  <Skeleton className="h-[125px]" />
                </div>
              </div>
            </div>
          }
        >
          {children}
        </Suspense>
      </AdminLayoutClient>
    );
  } catch (error) {
    console.error('Error in AsyncAdminLayout:', error);
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">エラーが発生しました</p>
          <p className="text-sm text-muted-foreground">
            管理画面の読み込み中にエラーが発生しました。
          </p>
        </div>
      </div>
    );
  }
}
