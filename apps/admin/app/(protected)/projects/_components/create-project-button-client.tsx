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
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { EmojiPicker } from '~/components/emoji-picker';

// Server Actionの型定義
interface CreateProjectActionParams {
  name: string;
  description: string;
  emoji: string;
}

interface CreateProjectButtonClientProps {
  createProjectAction: (
    params: CreateProjectActionParams
  ) => Promise<{ success: boolean; error?: Error }>;
}

export function CreateProjectButtonClient({
  createProjectAction,
}: CreateProjectButtonClientProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emoji, setEmoji] = useState('👋');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    try {
      const result = await createProjectAction({ name, description, emoji });

      if (!result.success) {
        throw (
          result.error ||
          new Error('プロジェクト作成中に不明なエラーが発生しました。')
        );
      }

      toast.success('プロジェクトを作成しました');
      setOpen(false);
      // フォームリセットはDialogが閉じることで行われることが多いが、
      // 必要であればここでフォームのリセット処理を追加
      // e.currentTarget.reset(); // 例
      setEmoji('👋'); // 絵文字もリセット
    } catch (error) {
      console.error('プロジェクト作成エラー:', error);
      toast.error(
        `プロジェクトの作成に失敗しました: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          プロジェクトを作成
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規プロジェクト</DialogTitle>
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
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="プロジェクトの説明を入力"
              rows={3}
              disabled={loading}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? '作成中...' : '作成'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
