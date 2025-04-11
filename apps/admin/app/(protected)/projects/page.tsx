import { Suspense } from 'react';
import { PageHeader } from '@kit/ui/page-header';
import { CreateProjectButton } from './_components/create-project-button';
import { ProjectList } from './_components/project-list';
import { Card, CardContent } from '@kit/ui/card';

const LOADING_ITEMS = Array.from(
  { length: 3 },
  (_, i) => `project-list-skeleton-${i + 1}`
);

export const metadata = {
  title: 'プロジェクト管理',
  description: 'プロジェクトの作成と管理を行います。',
};

export default function ProjectsPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="プロジェクト" actions={<CreateProjectButton />} />
      <div className="container">
        <Suspense
          fallback={
            <div className="space-y-4">
              {LOADING_ITEMS.map((id) => (
                <Card key={id}>
                  <CardContent className="p-6">
                    <div className="h-24 bg-muted animate-pulse rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <ProjectList />
        </Suspense>
      </div>
    </div>
  );
}
