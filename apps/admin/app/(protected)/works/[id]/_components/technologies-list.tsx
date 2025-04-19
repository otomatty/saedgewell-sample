'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import Link from 'next/link';
import { Button } from '@kit/ui/button';
import { Edit, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { TechnologySelector } from '../../_components/technology-selector';
import { updateWorkTechnologies } from '../../../../../actions/works/update-work-technologies';

interface TechnologiesListProps {
  technologies: Array<{
    technology: {
      id: string;
      name: string;
      slug: string;
      icon_url?: string | null;
      website_url?: string | null;
      category?: string | null;
    };
  }>;
  workId: string;
}

/**
 * 使用技術一覧コンポーネント
 */
export function TechnologiesList({
  technologies,
  workId,
}: TechnologiesListProps) {
  // 編集モードの状態
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 現在の技術ID一覧
  const currentTechnologyIds = technologies.map((tech) => tech.technology.id);

  // 編集中の技術ID一覧
  const [selectedTechnologyIds, setSelectedTechnologyIds] =
    useState<string[]>(currentTechnologyIds);

  // 編集モードの切り替え
  const handleEditClick = () => {
    setSelectedTechnologyIds(currentTechnologyIds);
    setIsEditing(true);
  };

  // 編集のキャンセル
  const handleCancel = () => {
    setSelectedTechnologyIds(currentTechnologyIds);
    setIsEditing(false);
  };

  // 編集の保存
  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await updateWorkTechnologies(workId, selectedTechnologyIds);
      setIsEditing(false);
      toast.success('使用技術を更新しました');
      // ページのリロードが必要
      window.location.reload();
    } catch (error) {
      console.error('使用技術の更新に失敗しました:', error);
      toast.error('使用技術の更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 編集モードのレンダリング
  if (isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>使用技術</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TechnologySelector
              selectedTechnologies={selectedTechnologyIds}
              onChange={setSelectedTechnologyIds}
              disabled={isSubmitting}
            />

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                キャンセル
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
                <Check className="mr-2 h-4 w-4" />
                保存
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 技術がなければ表示しない代わりに「追加」ボタンを表示
  if (!technologies.length) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>使用技術</CardTitle>
          <Button variant="outline" size="sm" onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            追加
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            使用技術が設定されていません
          </p>
        </CardContent>
      </Card>
    );
  }

  // カテゴリー別に技術をグループ化
  const groupedTechnologies = technologies.reduce<
    Record<string, typeof technologies>
  >((acc, tech) => {
    // techまたはtechnologyがnullまたはundefinedの場合は処理をスキップ
    if (!tech || !tech.technology) {
      return acc;
    }

    const category = tech.technology.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tech);
    return acc;
  }, {});

  // カテゴリーの日本語表示
  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      frontend: 'フロントエンド',
      backend: 'バックエンド',
      database: 'データベース',
      infrastructure: 'インフラ',
      programming: 'プログラミング',
      language: '言語',
      framework: 'フレームワーク',
      library: 'ライブラリ',
      tool: 'ツール',
      ai: 'AI',
      other: 'その他',
    };

    return categoryMap[category] || category;
  };

  // カテゴリーの順序
  const categoryOrder = [
    'frontend',
    'backend',
    'database',
    'infrastructure',
    'language',
    'framework',
    'library',
    'tool',
    'ai',
    'programming',
    'other',
  ];

  // カテゴリーをソート
  const sortedCategories = Object.keys(groupedTechnologies).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>使用技術</CardTitle>
        <Button variant="outline" size="sm" onClick={handleEditClick}>
          <Edit className="mr-2 h-4 w-4" />
          編集
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedCategories.map((category) => {
            // カテゴリーに対応する技術のリストが存在することを確認
            const techList = groupedTechnologies[category];
            if (!techList || techList.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {getCategoryLabel(category)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techList.map((tech) => {
                    // techとtechnologyが存在することを確認
                    if (!tech || !tech.technology) return null;

                    return (
                      <Badge
                        key={tech.technology.id}
                        variant="outline"
                        className="text-sm py-1 px-3"
                      >
                        {tech.technology.website_url ? (
                          <Link
                            href={tech.technology.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {tech.technology.name}
                          </Link>
                        ) : (
                          tech.technology.name
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
