import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Skeleton } from '@kit/ui/skeleton';
import { PageDetail } from './_components/page-detail';
import { PageLinks } from './_components/page-links';
import { PageCollaborators } from './_components/page-collaborators';
import { BackLink } from '@kit/ui/back-link';
import {
  getKnowledgePageDetail,
  getKnowledgePageLinks,
} from '~/actions/knowledge';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function KnowledgePageDetailPage({ params }: Props) {
  const { id } = await params;
  const [page, links] = await Promise.all([
    getKnowledgePageDetail(id),
    getKnowledgePageLinks(id),
  ]);

  if (!page) return notFound();

  return (
    <div className="container space-y-8 py-8">
      <div className="space-y-4">
        <BackLink href="/admin/knowledge/pages" label="← ページ一覧に戻る" />
        <h1 className="text-3xl font-bold">ページ詳細</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Suspense fallback={<Skeleton className="h-[600px]" />}>
            <Card>
              <CardHeader>
                <CardTitle>ページ情報</CardTitle>
              </CardHeader>
              <CardContent>
                <PageDetail page={page} />
              </CardContent>
            </Card>
          </Suspense>

          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <Card>
              <CardHeader>
                <CardTitle>リンク関係</CardTitle>
              </CardHeader>
              <CardContent>
                <PageLinks links={links} />
              </CardContent>
            </Card>
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <Card>
              <CardHeader>
                <CardTitle>編集者</CardTitle>
              </CardHeader>
              <CardContent>
                <PageCollaborators collaborators={page.collaborators} />
              </CardContent>
            </Card>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'ページ詳細 - ナレッジベース',
  description: 'ナレッジベースのページ詳細を表示します。',
};
