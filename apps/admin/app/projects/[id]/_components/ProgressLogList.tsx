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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
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
  getProgressLogs,
  createProgressLog,
  deleteProgressLog,
} from '@kit/next/actions';
import { getMilestones } from '@kit/next/actions';
import { getTasks } from '@kit/next/actions';
import { Plus, MoreHorizontal, Trash } from 'lucide-react';

interface ProgressLogListProps {
  projectId: string;
}

interface ProgressLog {
  id: string;
  description: string;
  log_type: 'milestone' | 'task' | 'general';
  hours_spent: number | null;
  milestone_id: string | null;
  task_id: string | null;
  created_at: string;
  project_milestones: {
    id: string;
    title: string;
  } | null;
  tasks: {
    id: string;
    title: string;
  } | null;
}

interface Milestone {
  id: string;
  title: string;
}

interface Task {
  id: string;
  title: string;
}

export function ProgressLogList({ projectId }: ProgressLogListProps) {
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const convertProgressLog = useCallback(
    (log: {
      id: string;
      description: string;
      log_type: string;
      hours_spent: number | null;
      milestone_id: string | null;
      task_id: string | null;
      created_at: string | null;
      project_milestones: { id: string; title: string } | null;
      tasks: { id: string; title: string } | null;
    }): ProgressLog => ({
      id: log.id,
      description: log.description,
      log_type: log.log_type as 'milestone' | 'task' | 'general',
      hours_spent: log.hours_spent,
      milestone_id: log.milestone_id,
      task_id: log.task_id,
      created_at: log.created_at || new Date().toISOString(),
      project_milestones: log.project_milestones,
      tasks: log.tasks,
    }),
    []
  );

  useEffect(() => {
    async function fetchData() {
      const [logsResult, milestonesResult, tasksResult] = await Promise.all([
        getProgressLogs(projectId),
        getMilestones(projectId),
        getTasks(projectId),
      ]);

      if (logsResult.data) {
        setLogs(logsResult.data.map(convertProgressLog));
      }
      if (milestonesResult.data) {
        const convertedMilestones: Milestone[] = milestonesResult.data.map(
          (milestone) => ({
            id: milestone.id,
            title: milestone.title,
          })
        );
        setMilestones(convertedMilestones);
      }
      if (tasksResult.data) {
        const convertedTasks: Task[] = tasksResult.data.map((task) => ({
          id: task.id,
          title: task.title,
        }));
        setTasks(convertedTasks);
      }
    }
    fetchData();
  }, [projectId, convertProgressLog]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const description = formData.get('description') as string;
    const logType = formData.get('logType') as 'milestone' | 'task' | 'general';
    const milestoneId =
      logType === 'milestone'
        ? (formData.get('milestoneId') as string)
        : undefined;
    const taskId =
      logType === 'task' ? (formData.get('taskId') as string) : undefined;
    const hoursSpentStr = formData.get('hoursSpent') as string;
    const hoursSpent = hoursSpentStr
      ? Number.parseFloat(hoursSpentStr)
      : undefined;

    const { error } = await createProgressLog({
      project_id: projectId,
      description,
      log_type: logType,
      milestone_id: milestoneId || null,
      task_id: taskId || null,
      hours_spent: hoursSpent || null,
    });

    if (error) {
      toast.error('進捗ログの作成に失敗しました');
    } else {
      toast.success('進捗ログを作成しました');
      setOpen(false);
      const { data } = await getProgressLogs(projectId);
      if (data) setLogs(data.map(convertProgressLog));
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    const { error } = await deleteProgressLog(id, projectId);

    if (error) {
      toast.error('進捗ログの削除に失敗しました');
    } else {
      toast.success('進捗ログを削除しました');
      const { data } = await getProgressLogs(projectId);
      if (data) setLogs(data.map(convertProgressLog));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">進捗ログ</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              進捗ログを作成
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>進捗ログを作成</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logType">ログタイプ</Label>
                <Select name="logType" defaultValue="general">
                  <SelectTrigger>
                    <SelectValue placeholder="ログタイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">一般</SelectItem>
                    <SelectItem value="milestone">マイルストーン</SelectItem>
                    <SelectItem value="task">タスク</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="進捗の説明を入力"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hoursSpent">作業時間（時間）</Label>
                <Input
                  type="number"
                  id="hoursSpent"
                  name="hoursSpent"
                  placeholder="作業時間を入力"
                  min={0}
                  step={0.5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="milestoneId">マイルストーン</Label>
                <Select name="milestoneId">
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
                <Label htmlFor="taskId">タスク</Label>
                <Select name="taskId">
                  <SelectTrigger>
                    <SelectValue placeholder="タスクを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  作成
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {log.log_type === 'milestone' && 'マイルストーン: '}
                  {log.log_type === 'task' && 'タスク: '}
                  {log.project_milestones?.title ||
                    log.tasks?.title ||
                    '一般的な進捗'}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onSelect={() => handleDelete(log.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{log.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  {new Date(log.created_at).toLocaleDateString()}{' '}
                  {new Date(log.created_at).toLocaleTimeString()}
                </div>
                {log.hours_spent !== null && (
                  <div>作業時間: {log.hours_spent}時間</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {logs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              進捗ログがありません。新しい進捗ログを作成してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
