'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@kit/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Textarea } from '@kit/ui/textarea';
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
import { toast } from 'sonner';
import {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from '@kit/next/actions';
import { Plus, MoreHorizontal, Pencil, Trash } from 'lucide-react';

interface MilestoneListProps {
  projectId: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  due_date: string | null;
}

export function MilestoneList({ projectId }: MilestoneListProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [open, setOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const convertMilestone = useCallback(
    (milestone: {
      id: string;
      title: string;
      description: string | null;
      status: string;
      progress: number | null;
      due_date: string | null;
    }): Milestone => ({
      id: milestone.id,
      title: milestone.title,
      description: milestone.description,
      status: milestone.status as 'not_started' | 'in_progress' | 'completed',
      progress: milestone.progress || 0,
      due_date: milestone.due_date,
    }),
    []
  );

  useEffect(() => {
    async function fetchMilestones() {
      const { data } = await getMilestones(projectId);
      if (data) {
        setMilestones(data.map(convertMilestone));
      }
    }
    fetchMilestones();
  }, [projectId, convertMilestone]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const dueDateStr = formData.get('dueDate') as string;
    const dueDate = dueDateStr ? new Date(dueDateStr) : undefined;

    if (editingMilestone) {
      const { error } = await updateMilestone(editingMilestone.id, {
        project_id: projectId,
        title,
        description,
        due_date: dueDate ? dueDate.toISOString() : null,
        status: editingMilestone.status,
        progress: editingMilestone.progress,
      });

      if (error) {
        toast.error('マイルストーンの更新に失敗しました');
      } else {
        toast.success('マイルストーンを更新しました');
        setOpen(false);
        setEditingMilestone(null);
        const { data } = await getMilestones(projectId);
        if (data) setMilestones(data.map(convertMilestone));
      }
    } else {
      const { error } = await createMilestone({
        project_id: projectId,
        title,
        description,
        due_date: dueDate ? dueDate.toISOString() : null,
        status: 'not_started',
        progress: 0,
      });

      if (error) {
        toast.error('マイルストーンの作成に失敗しました');
      } else {
        toast.success('マイルストーンを作成しました');
        setOpen(false);
        const { data } = await getMilestones(projectId);
        if (data) setMilestones(data.map(convertMilestone));
      }
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    const { error } = await deleteMilestone(id, projectId);

    if (error) {
      toast.error('マイルストーンの削除に失敗しました');
    } else {
      toast.success('マイルストーンを削除しました');
      const { data } = await getMilestones(projectId);
      if (data) setMilestones(data.map(convertMilestone));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">マイルストーン</h2>
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            if (!value) setEditingMilestone(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              マイルストーンを作成
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMilestone
                  ? 'マイルストーンを編集'
                  : 'マイルストーンを作成'}
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
                  defaultValue={editingMilestone?.title || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="マイルストーンの説明を入力"
                  rows={3}
                  defaultValue={editingMilestone?.description || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">期限</Label>
                <Input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  defaultValue={
                    editingMilestone?.due_date
                      ? new Date(editingMilestone.due_date)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {editingMilestone ? '更新' : '作成'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {milestones.map((milestone) => (
          <Card key={milestone.id}>
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
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          setEditingMilestone(milestone);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        編集
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem
                      className="text-destructive"
                      onSelect={() => handleDelete(milestone.id)}
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
                  <div>
                    期限: {new Date(milestone.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {milestones.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              マイルストーンがありません。新しいマイルストーンを作成してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
