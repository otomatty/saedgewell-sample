'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@kit/ui/tabs';
import { DocTypeGrid } from './doc-type-grid';
import { JournalList } from './journal-list';
import { TagFilter } from './tag-filter';
import type { DocType, DocCategory } from '~/types/mdx';

interface DocTypeTabsProps {
  categories: DocCategory[];
  docTypes: DocType[];
  docTypesByCategory: Record<string, DocType[]>;
}

export function DocTypeTabs({
  categories,
  docTypes,
  docTypesByCategory,
}: DocTypeTabsProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?.id || '');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // 利用可能なタグを収集し、使用頻度でソート
  const allTags = useMemo(() => {
    // タグの使用回数をカウント
    const tagCounts = new Map<string, number>();

    for (const docType of docTypes) {
      if (Array.isArray(docType.tags)) {
        // 新しい形式: タグが配列の場合
        for (const tag of docType.tags) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      } else if (docType.tags && typeof docType.tags === 'object') {
        // 互換性のための処理: 旧形式のタグ
        for (const [tagType, tagList] of Object.entries(docType.tags)) {
          if (Array.isArray(tagList)) {
            for (const tag of tagList) {
              tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            }
          }
        }
      }
    }

    // タグをMap形式に変換し、使用頻度でソート
    const tagsMap = new Map<string, { id: string; count: number }>();

    // 使用頻度でソートしたタグのリストを作成
    const sortedTags = [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1]) // 使用回数で降順ソート
      .map(([tagId, count]) => ({ id: tagId, count }));

    // ソートされたタグをMapに追加
    for (const tag of sortedTags) {
      tagsMap.set(tag.id, tag);
    }

    return tagsMap;
  }, [docTypes]);

  // タグでフィルタリングされたドキュメントタイプを取得
  const getFilteredDocTypes = (docs: DocType[]) => {
    if (!activeTag) return docs;

    return docs.filter((docType) => {
      // Journalsカテゴリの場合は、フィルタリングをJournalListに任せる
      if (docType.category === 'journals' && !docType.parentId) {
        return true;
      }

      if (Array.isArray(docType.tags)) {
        // 新しい形式: タグが配列の場合
        return docType.tags.includes(activeTag);
      }

      if (docType.tags && typeof docType.tags === 'object') {
        // 互換性のための処理: 旧形式のタグ
        for (const tagList of Object.values(docType.tags)) {
          if (Array.isArray(tagList) && tagList.includes(activeTag)) {
            return true;
          }
        }
      }

      return false;
    });
  };

  // 現在のタブに基づいてドキュメントを取得
  const getCurrentDocTypes = () => {
    return getFilteredDocTypes(docTypesByCategory[activeTab] || []);
  };

  // タグをリセット
  const resetTags = () => {
    setActiveTag(null);
  };

  // タブ変更時にタグもリセット
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    resetTags();
  };

  // タグ選択時の処理
  const handleTagClick = (tagId: string) => {
    if (activeTag === tagId) {
      resetTags();
    } else {
      setActiveTag(tagId);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue={categories[0]?.id || ''}
        value={activeTab}
        onValueChange={handleTabChange}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-8 flex justify-center">
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="min-w-32"
              >
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* タグフィルター */}
        <TagFilter
          allTags={allTags}
          activeTag={activeTag}
          onTagClick={handleTagClick}
          onReset={resetTags}
        />

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">{category.title}</h2>
              {category.description && (
                <p className="mb-6 text-muted-foreground">
                  {category.description}
                </p>
              )}
              {/* 日記カテゴリの場合は特別なレイアウトを使用 */}
              {category.id === 'journals' ? (
                <JournalList
                  docTypes={getCurrentDocTypes()}
                  activeTag={activeTag}
                  emptyMessage={`条件に一致する${category.title}はありません。`}
                />
              ) : (
                <DocTypeGrid
                  docTypes={getCurrentDocTypes()}
                  emptyMessage={`条件に一致する${category.title}はありません。`}
                />
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
