'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import { Button } from '@kit/ui/button';
import { toast } from 'sonner';
import { MoreHorizontal, Trash } from 'lucide-react';
import { MilestoneForm } from './milestone-form';

interface MilestoneCardClientProps {
  milestone: {
    id: string;
    title: string;
    description: string | null;
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number;
    due_date: string | null;
  };
  projectId: string;
  onDelete: (milestoneId: string) => Promise<void>;
  onUpdate: () => void;
}

/**
 * マイルストーンカードのクライアントコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Object} props.milestone - マイルストーンの情報
 * @param {string} props.projectId - プロジェクトID
 * @param {Function} props.onDelete - 削除時のコールバック関数
 * @param {Function} props.onUpdate - 更新時のコールバック関数
 * @returns {JSX.Element} マイルストーンカードのUI
 */
export function MilestoneCardClient({
  milestone,
  projectId,
  onDelete,
  onUpdate,
}: MilestoneCardClientProps) {
  async function handleDelete() {
    try {
      await onDelete(milestone.id);
      toast.success('マイルストーンを削除しました');
    } catch (error) {
      toast.error('マイルストーンの削除に失敗しました');
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{milestone.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <MilestoneForm
                projectId={projectId}
                milestone={milestone}
                onSuccess={onUpdate}
              />
              <DropdownMenuItem
                className="text-destructive"
                onSelect={handleDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {milestone.description && (
          <CardDescription>{milestone.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>進捗: {milestone.progress}%</div>
          {milestone.due_date && (
            <div>期限: {new Date(milestone.due_date).toLocaleDateString()}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
