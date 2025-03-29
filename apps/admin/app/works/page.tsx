import { Suspense } from 'react';
import { getWorks } from '@kit/next/actions';
import { WorksHeader } from './_components/WorksHeader';
import { WorksTable } from './_components/WorksTable';
import { WorksTableSkeleton } from './_components/WorksTableSkeleton';
import { PageHeader } from '@kit/ui/page-header';

export default async function WorksPage() {
  const works = await getWorks({
    status: 'published',
    category: 'company',
    query: '',
  });

  return (
    <>
      <PageHeader title="作品管理" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <WorksHeader />
        <Suspense fallback={<WorksTableSkeleton />}>
          <WorksTable works={works} />
        </Suspense>
      </div>
    </>
  );
}
