import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@kit/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getWorkDetail } from '~/actions/works/get-work-detail';
import { WorkHeader } from './_components/work-header';
import { WorkInfo } from './_components/work-info';
import { WorkGallery } from './_components/work-gallery';
import { ChallengesList } from './_components/challenges-list';
import { TechnologiesList } from './_components/technologies-list';

interface WorkDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * 実績詳細ページ
 * サーバーサイドでデータを取得し、クライアントサイドでインライン編集可能なコンポーネントを表示します。
 * @param params URLパラメータ (idを含む)
 */
export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  try {
    // paramsを先にawaitする
    const resolvedParams = await params;
    const workId = resolvedParams.id;

    const workDetail = await getWorkDetail(workId);

    return (
      <div className="space-y-8">
        {/* 戻るボタン */}
        <div>
          <Link href="/works">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              実績一覧に戻る
            </Button>
          </Link>
        </div>

        {/* ヘッダー（タイトル、ステータス、編集ボタン） */}
        <div className="flex items-start justify-between">
          <WorkHeader
            title={workDetail.work.title}
            status={workDetail.work.status}
            publishedAt={
              workDetail.work.created_at
                ? new Date(workDetail.work.created_at)
                : undefined
            }
            workId={workId}
          />
        </div>

        {/* 実績情報 */}
        <WorkInfo work={workDetail.work} workDetail={workDetail.detail} />

        {/* 画像ギャラリー */}
        <WorkGallery workId={workId} initialImages={workDetail.images} />

        {/* 技術一覧 */}
        <TechnologiesList
          technologies={workDetail.technologies.map((item) => ({
            technology: {
              id: item.technology.id,
              name: item.technology.name,
              slug: item.technology.name.toLowerCase().replace(/\s+/g, '-'),
              category: item.technology.category,
            },
          }))}
          workId={workId}
        />

        {/* 課題一覧 */}
        {workDetail.challenges.length > 0 && (
          <ChallengesList
            challenges={workDetail.challenges}
            solutions={workDetail.solutions}
            workId={workId}
          />
        )}

        {/* 担当業務（実装予定） */}
        {workDetail.responsibilities.length > 0 && (
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">担当業務</h2>
            <ul className="space-y-2 list-disc pl-6">
              {workDetail.responsibilities.map((responsibility) => (
                <li key={responsibility.id}>{responsibility.description}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 成果（実装予定） */}
        {workDetail.results.length > 0 && (
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">成果</h2>
            <ul className="space-y-2 list-disc pl-6">
              {workDetail.results.map((result) => (
                <li key={result.id}>{result.description}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('実績詳細の取得に失敗しました:', error);
    notFound();
  }
}
