'use client';

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '@kit/next/actions';
import { getMilestones } from '@kit/next/actions';
import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Textarea } from '@kit/ui/textarea';
import { MoreHorizontal, Pencil, Plus, Trash } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface TaskListProps {
  projectId: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  priority: number | null;
  due_date: string | null;
  milestone_id: string | null;
  project_milestones: {
    id: string;
    title: string;
  } | null;
  is_archived: boolean;
}

interface Milestone {
  id: string;
  title: string;
}

export function TaskList({ projectId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  const convertTask = useCallback(
    (task: {
      id: string;
      title: string;
      description: string | null;
      status: string;
      priority: number | null;
      due_date: string | null;
      project_milestones: Array<{ id: string; title: string }>;
      is_archived: boolean | null;
    }): Task => {
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status as 'todo' | 'in_progress' | 'done',
        priority: task.priority,
        due_date: task.due_date,
        milestone_id: task.project_milestones?.[0]?.id || null,
        project_milestones: task.project_milestones?.[0] || null,
        is_archived: task.is_archived ?? false,
      };
    },
    []
  );

  useEffect(() => {
    async function fetchData() {
      const [tasksResult, milestonesResult] = await Promise.all([
        getTasks(projectId),
        getMilestones(projectId),
      ]);

      if (tasksResult.data) {
        setTasks(tasksResult.data.map(convertTask));
      }
      if (milestonesResult.data) setMilestones(milestonesResult.data);
    }
    fetchData();
  }, [projectId, convertTask]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const milestoneId = formData.get('milestoneId') as string;
    const priority = formData.get('priority') as string;
    const dueDateStr = formData.get('dueDate') as string;
    const dueDate = dueDateStr ? new Date(dueDateStr) : undefined;

    if (editingTask) {
      const { error } = await updateTask(editingTask.id, {
        project_id: projectId,
        title,
        description,
        milestone_id: milestoneId || null,
        status: editingTask.status,
        priority: priority ? Number.parseInt(priority) : null,
        due_date: dueDate ? dueDate.toISOString() : null,
        is_archived: editingTask.is_archived ?? false,
      });

      if (error) {
        toast.error('タスクの更新に失敗しました');
      } else {
        toast.success('タスクを更新しました');
        setOpen(false);
        setEditingTask(null);
        const { data } = await getTasks(projectId);
        if (data) setTasks(data.map(convertTask));
      }
    } else {
      const { error } = await createTask({
        project_id: projectId,
        title,
        description,
        milestone_id: milestoneId || null,
        status: 'todo',
        priority: priority ? Number.parseInt(priority) : null,
        due_date: dueDate ? dueDate.toISOString() : null,
        is_archived: false,
      });

      if (error) {
        toast.error('タスクの作成に失敗しました');
      } else {
        toast.success('タスクを作成しました');
        setOpen(false);
        const { data } = await getTasks(projectId);
        if (data) setTasks(data.map(convertTask));
      }
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    const { error } = await deleteTask(id, projectId);

    if (error) {
      toast.error('タスクの削除に失敗しました');
    } else {
      toast.success('タスクを削除しました');
      const { data } = await getTasks(projectId);
      if (data) setTasks(data.map(convertTask));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">タスク</h2>
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            if (!value) setEditingTask(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              タスクを作成
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'タスクを編集' : 'タスクを作成'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">タイトル</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="タスク名を入力"
                  required
                  defaultValue={editingTask?.title || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="タスクの説明を入力"
                  rows={3}
                  defaultValue={editingTask?.description || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="milestoneId">マイルストーン</Label>
                <Select
                  name="milestoneId"
                  defaultValue={editingTask?.milestone_id || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="マイルストーンを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {milestones.map((milestone) => (
                      <SelectItem key={milestone.id} value={milestone.id}>
                        {milestone.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">優先度</Label>
                <Input
                  type="number"
                  id="priority"
                  name="priority"
                  placeholder="優先度を入力"
                  min={0}
                  max={100}
                  defaultValue={editingTask?.priority || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">期限</Label>
                <Input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  defaultValue={
                    editingTask?.due_date
                      ? new Date(editingTask.due_date)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {editingTask ? '更新' : '作成'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{task.title}</CardTitle>
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
                          setEditingTask(task);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        編集
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem
                      className="text-destructive"
                      onSelect={() => handleDelete(task.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {task.description && (
                <CardDescription>{task.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div>ステータス: {task.status}</div>
                  {task.priority !== null && <div>優先度: {task.priority}</div>}
                </div>
                <div className="flex items-center gap-4">
                  {task.project_milestones && (
                    <div>マイルストーン: {task.project_milestones.title}</div>
                  )}
                  {task.due_date && (
                    <div>
                      期限: {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              タスクがありません。新しいタスクを作成してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
