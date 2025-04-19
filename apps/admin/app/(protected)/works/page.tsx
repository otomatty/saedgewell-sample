import React, { Suspense } from 'react';
import { PageHeader } from '@kit/ui/page-header';
import NewWorkButton from './_components/new-work-button';
import WorkStatsDisplay from './_components/work-stats-display';
import WorksDataTable from './_components/works-data-table';
import WorkStatsSkeleton from './_components/work-stats-skeleton';
import {
  getWorkCategoryStats,
  getTopTechnologiesStats,
} from '~/actions/works/works-stats';
import { getWorksList } from '~/actions/works/works-list';
import type { WorkListItem, WorkStatus } from '~/types/works/works-list';
import { WorkCategoryFilter } from './_components/work-category-filter';
import { WorkStatusFilter } from './_components/work-status-filter';

// TODO: 実績一覧データ取得用の Server Action も必要
// import { getWorksList } from '~/actions/works/works-list';

// モックデータの定義を削除
/*
const mockStatsData: WorkStats = {
  // ...
};
const mockTopTechData: TopTechnologyStat[] = [
  // ...
];
*/

export default async function WorksPage({
  searchParams,
}: {
  searchParams?: Promise<{
    status?: string;
    category?: string;
    page?: string;
  }>;
}) {
  const params = searchParams ? await searchParams : {};

  const statusParam = params.status;
  const currentCategory = params.category;
  const currentPage = Number(params.page ?? '1');

  const validStatuses: WorkStatus[] = [
    'draft',
    'published',
    'featured',
    'archived',
  ];
  const currentStatus = validStatuses.includes(statusParam as WorkStatus)
    ? (statusParam as WorkStatus)
    : undefined;

  const statsPromise = getWorkCategoryStats();
  const topTechPromise = getTopTechnologiesStats();
  const worksListDataPromise = getWorksList({
    filterByStatus: currentStatus,
    filterByCategoryName: currentCategory,
    page: currentPage,
    pageSize: 15,
  });

  return (
    <>
      <div className="container">
        <PageHeader
          title="実績一覧"
          description="登録された実績の管理を行います"
          breadcrumbs={[
            { href: '/dashboard', label: 'ダッシュボード' },
            { href: '/works', label: '実績一覧' },
          ]}
          actions={<NewWorkButton />}
        />
      </div>

      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Suspense fallback={<WorkStatsSkeleton />}>
            {(async () => {
              const [statsData, topTechData] = await Promise.all([
                statsPromise,
                topTechPromise,
              ]);
              return (
                <WorkStatsDisplay
                  stats={statsData ?? undefined}
                  topTechnologies={topTechData ?? undefined}
                />
              );
            })()}
          </Suspense>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <WorkStatusFilter />
            <WorkCategoryFilter />
          </div>

          <Suspense
            key={`${currentStatus}-${currentCategory}-${currentPage}`}
            fallback={<WorksDataTable isLoading />}
          >
            {(async () => {
              let worksListData: { data: WorkListItem[]; count: number } = {
                data: [],
                count: 0,
              };
              let fetchError = null;
              try {
                worksListData = await worksListDataPromise;
              } catch (error) {
                console.error('Failed to fetch works list:', error);
                fetchError = error;
              }

              if (fetchError) {
                return <WorksDataTable data={[]} isLoading={false} />;
              }

              return (
                <WorksDataTable
                  data={worksListData.data}
                  isLoading={false}
                  pagination={{
                    totalItems: worksListData.count,
                    pageSize: 15,
                    currentPage,
                  }}
                  baseUrl={`/works?status=${currentStatus || ''}&category=${
                    currentCategory || ''
                  }&page=`}
                />
              );
            })()}
          </Suspense>
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: '実績一覧',
  description: '登録された実績の管理を行います。',
};
