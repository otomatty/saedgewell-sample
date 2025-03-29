'use client';

import { useState } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import { updateProject, deleteProject } from '@kit/next/actions';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EmojiPicker } from '~/components/emoji-picker';
import { toast } from 'sonner';

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    emoji: string | null;
  };
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emoji, setEmoji] = useState(project.emoji || '👋');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const { error } = await updateProject(project.id, {
      name,
      description,
      emoji,
    });

    if (error) {
      toast.error('プロジェクトの更新に失敗しました');
    } else {
      toast.success('プロジェクトを更新しました');
      setOpen(false);
    }

    setLoading(false);
  }

  async function handleDelete() {
    const { error } = await deleteProject(project.id);

    if (error) {
      toast.error('プロジェクトの削除に失敗しました');
    } else {
      toast.success('プロジェクトを削除しました');
      router.push('/admin/projects');
    }
  }

  const handleEdit = () => {
    setDropdownOpen(false);
    setTimeout(() => setOpen(true), 100);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {project.emoji && <span className="text-2xl">{project.emoji}</span>}
        <h1 className="text-3xl font-bold">{project.name}</h1>
      </div>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            編集
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onSelect={handleDelete}
          >
            <Trash className="h-4 w-4 mr-2" />
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>プロジェクトを編集</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emoji">絵文字</Label>
              <EmojiPicker value={emoji} onChange={setEmoji} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">プロジェクト名</Label>
              <Input
                id="name"
                name="name"
                placeholder="プロジェクト名を入力"
                required
                defaultValue={project.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="プロジェクトの説明を入力"
                rows={3}
                defaultValue={project.description || ''}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                更新
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
