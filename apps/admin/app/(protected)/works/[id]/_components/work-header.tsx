'use client';

import { useState } from 'react';
import { Button } from '@kit/ui/button';
import { Edit, Check, X } from 'lucide-react';
import { Badge } from '@kit/ui/badge';
import { formatDate } from '@kit/shared/utils';
import { Input } from '@kit/ui/input';
import { toast } from 'sonner';
import { updateWorkTitle } from '../../../../../actions/works/update-work-title';

interface WorkHeaderProps {
  title: string;
  status: string;
  publishedAt?: Date;
  workId: string;
}

/**
 * 実績ヘッダーコンポーネント
 * タイトル、ステータス、公開日時を表示します
 * タイトルはインライン編集可能
 */
export function WorkHeader({
  title: initialTitle,
  status,
  publishedAt,
  workId,
}: WorkHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [tempTitle, setTempTitle] = useState(initialTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 編集モードの切り替え
  const handleEditClick = () => {
    setTempTitle(title);
    setIsEditing(true);
  };

  // 編集のキャンセル
  const handleCancel = () => {
    setTempTitle(title);
    setIsEditing(false);
  };

  // 編集の保存
  const handleSave = async () => {
    if (tempTitle.trim() === '') {
      toast.error('タイトルを入力してください');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateWorkTitle(workId, tempTitle);
      setTitle(tempTitle);
      setIsEditing(false);
      toast.success('タイトルを更新しました');
    } catch (error) {
      console.error('タイトルの更新に失敗しました:', error);
      toast.error('タイトルの更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <Input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="text-2xl font-bold"
              autoFocus
              disabled={isSubmitting}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold">{title}</h1>
            <Button variant="ghost" size="icon" onClick={handleEditClick}>
              <Edit className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge
          variant={status === 'published' ? 'default' : 'secondary'}
          className="capitalize"
        >
          {status === 'published' ? '公開' : 'ドラフト'}
        </Badge>
        {publishedAt && (
          <span>
            {status === 'published' ? '公開日：' : '作成日：'}
            {formatDate(publishedAt.toISOString())}
          </span>
        )}
      </div>
    </div>
  );
}
