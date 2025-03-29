import { Suspense } from 'react';
import { PageHeader } from '@kit/ui/page-header';
import { ProjectHeader } from './_components/ProjectHeader';
import { MilestoneList } from './_components/MilestoneList';
import { TaskList } from './_components/TaskList';
import { ProgressLogList } from './_components/ProgressLogList';
import { getProjectById } from '@kit/next/actions';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const { data: project, error } = await getProjectById(id);

  if (error || !project) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <PageHeader title={project.name} />
      <div className="container">
        <div className="space-y-6">
          <ProjectHeader project={project} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Suspense
                fallback={
                  <Card>
                    <CardHeader>
                      <CardTitle>マイルストーン</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                }
              >
                <MilestoneList projectId={project.id} />
              </Suspense>

              <Suspense
                fallback={
                  <Card>
                    <CardHeader>
                      <CardTitle>タスク</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                }
              >
                <TaskList projectId={project.id} />
              </Suspense>
            </div>

            <Suspense
              fallback={
                <Card>
                  <CardHeader>
                    <CardTitle>進捗ログ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 bg-muted animate-pulse rounded" />
                  </CardContent>
                </Card>
              }
            >
              <ProgressLogList projectId={project.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
