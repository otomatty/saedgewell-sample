'use client';

import { useState } from 'react';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Textarea } from '@kit/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface MilestoneFormClientProps {
  projectId: string;
  milestone?: {
    id: string;
    title: string;
    description: string | null;
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number;
    due_date: string | null;
  };
  onSubmit: (data: {
    title: string;
    description: string;
    dueDate: Date | undefined;
    status?: 'not_started' | 'in_progress' | 'completed';
    progress?: number;
  }) => Promise<void>;
}

/**
 * マイルストーンフォームのクライアントコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.projectId - プロジェクトID
 * @param {Object} props.milestone - 編集対象のマイルストーン（新規作成時は未指定）
 * @param {Function} props.onSubmit - フォーム送信時のコールバック関数
 * @returns {JSX.Element} マイルストーンフォームのUI
 */
export function MilestoneFormClient({
  projectId,
  milestone,
  onSubmit,
}: MilestoneFormClientProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const dueDateStr = formData.get('dueDate') as string;
    const dueDate = dueDateStr ? new Date(dueDateStr) : undefined;

    try {
      await onSubmit({
        title,
        description,
        dueDate,
        status: milestone?.status,
        progress: milestone?.progress,
      });
      toast.success(
        milestone
          ? 'マイルストーンを更新しました'
          : 'マイルストーンを作成しました'
      );
      setOpen(false);
    } catch (error) {
      toast.error(
        milestone
          ? 'マイルストーンの更新に失敗しました'
          : 'マイルストーンの作成に失敗しました'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        {milestone ? (
          <button
            type="button"
            className="w-full text-left px-2 py-1 hover:bg-accent"
          >
            編集
          </button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            マイルストーンを作成
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {milestone ? 'マイルストーンを編集' : 'マイルストーンを作成'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              name="title"
              placeholder="マイルストーン名を入力"
              required
              defaultValue={milestone?.title || ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="マイルストーンの説明を入力"
              rows={3}
              defaultValue={milestone?.description || ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">期限</Label>
            <Input
              type="date"
              id="dueDate"
              name="dueDate"
              defaultValue={
                milestone?.due_date
                  ? new Date(milestone.due_date).toISOString().split('T')[0]
                  : ''
              }
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {milestone ? '更新' : '作成'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
