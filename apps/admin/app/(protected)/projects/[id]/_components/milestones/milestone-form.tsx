import { handleSubmitMilestone } from './milestone-actions';
import { MilestoneFormClient } from './milestone-form-client';

interface MilestoneFormProps {
  projectId: string;
  milestone?: {
    id: string;
    title: string;
    description: string | null;
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number;
    due_date: string | null;
  };
  onSuccess: () => void;
}

/**
 * マイルストーンフォームのサーバーコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.projectId - プロジェクトID
 * @param {Object} props.milestone - 編集対象のマイルストーン（新規作成時は未指定）
 * @param {Function} props.onSuccess - 作成/更新成功時のコールバック関数
 * @returns {JSX.Element} マイルストーンフォームのUI
 */
export function MilestoneForm({
  projectId,
  milestone,
  onSuccess,
}: MilestoneFormProps) {
  return (
    <MilestoneFormClient
      projectId={projectId}
      milestone={milestone}
      onSubmit={async (data) => {
        await handleSubmitMilestone(projectId, milestone?.id, data);
        onSuccess();
      }}
    />
  );
}
