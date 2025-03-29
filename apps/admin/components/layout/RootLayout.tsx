import { requireAdmin } from '@kit/next/actions';
import { getProfile } from '@kit/next/actions';
import { getProjects } from '@kit/next/actions';
import { redirect } from 'next/navigation';
import { AdminLayoutClient } from './admin-layout-client';

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

export default async function RootLayout({
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
        {children}
      </AdminLayoutClient>
    );
  } catch (error) {
    console.error('Admin access denied:', error);
    redirect('/');
  }
}
