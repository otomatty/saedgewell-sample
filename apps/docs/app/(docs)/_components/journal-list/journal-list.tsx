'use client';

import { useRef } from 'react';
import { YearMonthSection } from './year-month-section';
import {
  useFilteredParentEntries,
  useActiveYearMonthTracking,
} from './use-journal-data';
import type { DocType } from '~/types/mdx';

interface JournalListProps {
  docTypes: DocType[];
  emptyMessage?: string;
  activeTag?: string | null;
}

export function JournalList({
  docTypes,
  emptyMessage = '日記はまだありません。',
  activeTag = null,
}: JournalListProps) {
  // 日記データの取得と処理
  const {
    entriesByParent,
    entriesByYearMonth,
    activeYearMonth,
    setActiveYearMonth,
    allFilteredChildrenEmpty,
  } = useFilteredParentEntries(docTypes, activeTag);

  // セクション参照の管理
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // スクロール時のアクティブなセクション追跡
  useActiveYearMonthTracking(sectionRefs, activeYearMonth, setActiveYearMonth);

  // タグフィルタリングが適用されていて、表示する子エントリがない場合
  if (allFilteredChildrenEmpty) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border bg-muted/50 p-8">
        <p className="text-center text-muted-foreground">
          {activeTag
            ? `「${activeTag}」のタグが付いた日記はありません。`
            : emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0 relative">
      {/* スティッキーヘッダー（現在見えている年月を表示） */}
      <div className="sticky top-20 z-10 bg-background py-3 border-b mb-6">
        <h2 className="text-xl font-bold">{activeYearMonth}</h2>
      </div>

      {/* 年月ごとのセクション */}
      {entriesByYearMonth.map(({ yearMonth, entries }) => (
        <YearMonthSection
          key={yearMonth}
          yearMonth={yearMonth}
          entries={entries}
          entriesByParent={entriesByParent}
          activeTag={activeTag}
          sectionRef={(el) => {
            sectionRefs.current[yearMonth] = el;
          }}
        />
      ))}
    </div>
  );
}
