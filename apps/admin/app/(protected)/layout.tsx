import { Suspense } from 'react';
import { requireAdmin } from '@kit/next/actions';
import { getProfileForLayout } from '@kit/next/actions';
import { getProjects } from '@kit/next/actions';
import { redirect } from 'next/navigation';
import { AdminLayoutClient } from '~/components/layout/admin-layout-client';
import AdminLoading from './layout-skeleton';

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
    const profile = await getProfileForLayout();
    if (!profile) {
      console.error('Profile not found or access denied during layout load');
      redirect('/');
    }
    return profile;
  } catch (error) {
    console.error('Error in ProfileLoader:', error);
    redirect('/');
  }
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch (error) {
    console.error('Admin access denied:', error);
    redirect('/');
  }

  const profilePromise = ProfileLoader();
  const projectsPromise = ProjectsLoader();

  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminLayoutClient profile={profilePromise} projects={projectsPromise}>
        {children}
      </AdminLayoutClient>
    </Suspense>
  );
}
