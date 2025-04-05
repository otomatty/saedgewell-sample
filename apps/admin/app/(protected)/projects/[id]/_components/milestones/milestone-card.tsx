import { deleteMilestone } from '@kit/next/actions';
import { MilestoneCardClient } from './milestone-card-client';

interface MilestoneCardProps {
  milestone: {
    id: string;
    title: string;
    description: string | null;
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number;
    due_date: string | null;
  };
  projectId: string;
  onDelete: () => void;
  onUpdate: () => void;
}

/**
 * マイルストーンカードのサーバーコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Object} props.milestone - マイルストーンの情報
 * @param {string} props.projectId - プロジェクトID
 * @param {Function} props.onDelete - 削除時のコールバック関数
 * @param {Function} props.onUpdate - 更新時のコールバック関数
 * @returns {JSX.Element} マイルストーンカードのUI
 */
export function MilestoneCard({
  milestone,
  projectId,
  onDelete,
  onUpdate,
}: MilestoneCardProps) {
  async function handleDeleteMilestone(milestoneId: string) {
    'use server';
    await deleteMilestone(milestoneId, projectId);
    onDelete();
  }

  return (
    <MilestoneCardClient
      milestone={milestone}
      projectId={projectId}
      onDelete={handleDeleteMilestone}
      onUpdate={onUpdate}
    />
  );
}
