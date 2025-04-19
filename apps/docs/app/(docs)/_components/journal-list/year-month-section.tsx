'use client';

import { Calendar } from 'lucide-react';
import { Separator } from '@kit/ui/separator';
import { DocCard } from '../doc-card';
import { GitHubCommits } from '../github-commits';
import { getFormattedDay, isWeekend } from '~/lib/utils/date';
import type { DocType } from '~/types/mdx';

interface YearMonthSectionProps {
  yearMonth: string;
  entries: DocType[];
  entriesByParent: Record<string, DocType[]>;
  activeTag: string | null;
  sectionRef: (node: HTMLDivElement | null) => void;
}

export function YearMonthSection({
  yearMonth,
  entries,
  entriesByParent,
  activeTag,
  sectionRef,
}: YearMonthSectionProps) {
  return (
    <div ref={sectionRef} className="mb-12" data-year-month={yearMonth}>
      {/* 年月ヘッダー（visibility:hidden で表示されないがスペースは確保） */}
      <h2 className="text-xl font-bold mb-6 invisible">{yearMonth}</h2>

      {/* 各日付のエントリ */}
      <div className="space-y-8">
        {entries.map((parent) => {
          // この親エントリに対応する子エントリがあるか確認
          const childEntries = entriesByParent[parent.id] || [];
          const hasChildren = childEntries.length > 0;

          // タグフィルタリングが適用されていて子エントリがない場合はスキップ
          if (activeTag && !hasChildren) {
            return null;
          }

          return (
            <div key={parent.id} className="space-y-4">
              {/* 日付ヘッダー（曜日付き） */}
              <h3
                className={`text-lg font-semibold flex items-center gap-2 ${
                  parent.date && isWeekend(parent.date)
                    ? parent.date.includes('-01-') // 1月1日は特別
                      ? 'text-red-500'
                      : new Date(parent.date).getDay() === 0 // 日曜日は赤
                        ? 'text-red-500'
                        : 'text-blue-500' // 土曜日は青
                    : ''
                }`}
              >
                <Calendar className="size-5" />
                {parent.date ? getFormattedDay(parent.date) : parent.title}
              </h3>

              {/* GitHubコミット表示（存在する場合） */}
              {parent.githubCommits && parent.githubCommits.length > 0 && (
                <GitHubCommits
                  commits={parent.githubCommits}
                  className="mt-3 mb-4"
                  groupSimilarCommits={true}
                />
              )}

              <Separator className="my-4" />

              {/* この日の記事一覧 - タグでフィルタリングされている場合は一致する記事のみ表示 */}
              {hasChildren && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {childEntries.map((entry) => (
                    <DocCard key={entry.id} docType={entry} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
