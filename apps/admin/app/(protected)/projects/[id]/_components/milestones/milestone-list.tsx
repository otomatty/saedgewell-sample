import { Suspense } from 'react';
import { getMilestones } from '@kit/next/actions';
import { MilestoneCard } from './milestone-card';
import { MilestoneForm } from './milestone-form';
import { revalidatePath } from 'next/cache';
import { Button } from '@kit/ui/button';

interface MilestoneListProps {
  projectId: string;
}

/**
 * マイルストーンリストを表示するサーバーコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.projectId - プロジェクトID
 * @returns {Promise<JSX.Element>} マイルストーンリストのUI
 *
 * @example
 * ```tsx
 * <MilestoneList projectId="123" />
 * ```
 */
export async function MilestoneList({ projectId }: MilestoneListProps) {
  const { data: milestones } = await getMilestones(projectId);

  /**
   * マイルストーンの作成/更新/削除後にページを再検証するサーバーアクション
   */
  async function refreshData() {
    'use server';
    revalidatePath(`/projects/${projectId}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">マイルストーン</h2>
        <MilestoneForm projectId={projectId} onSuccess={refreshData} />
      </div>

      <div className="space-y-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">
                マイルストーンを読み込み中...
              </div>
            </div>
          }
        >
          {milestones?.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={{
                id: milestone.id,
                title: milestone.title,
                description: milestone.description,
                status: milestone.status as
                  | 'not_started'
                  | 'in_progress'
                  | 'completed',
                progress: milestone.progress || 0,
                due_date: milestone.due_date,
              }}
              projectId={projectId}
              onDelete={refreshData}
              onUpdate={refreshData}
            />
          ))}
          {(!milestones || milestones.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                マイルストーンがありません。新しいマイルストーンを作成してください。
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
