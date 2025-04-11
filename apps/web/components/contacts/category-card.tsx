'use client';

import { Card, CardContent } from '@kit/ui/card';
import { cn } from '@kit/ui/utils';
import type { ComponentType } from 'react';

export interface CategoryCardProps {
  /**
   * カテゴリーの一意のID
   */
  id: string;
  /**
   * カテゴリーの名前
   */
  name: string;
  /**
   * カテゴリーの説明
   */
  description: string;
  /**
   * カテゴリーのアイコン
   */
  icon: ComponentType<{ className?: string }>;
  /**
   * カテゴリーが選択された時のコールバック
   */
  onSelect: (id: string) => void;
  /**
   * 追加のクラス名
   */
  className?: string;
}

export const CategoryCard = ({
  id,
  name,
  description,
  icon: Icon,
  onSelect,
  className,
}: CategoryCardProps) => {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:scale-105 hover:shadow-lg',
        className
      )}
      onClick={() => onSelect(id)}
    >
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <Icon className="h-12 w-12 text-primary" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
