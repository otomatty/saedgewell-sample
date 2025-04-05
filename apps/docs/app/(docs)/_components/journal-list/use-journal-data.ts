import { useMemo, useState, useEffect } from 'react';
import { getFormattedDay, getYearMonth, isWeekend } from '~/lib/utils/date';
import type { DocType } from '~/types/mdx';

// 年月のセクション（スティッキーヘッダー用）
export interface YearMonthSection {
  yearMonth: string;
  entries: DocType[];
}

/**
 * 今日の日付を取得（YYYY-MM-DD形式）- 日本標準時(JST)で取得
 */
export function useTodayDate() {
  return useMemo(() => {
    // 現在のUTC時間を取得
    const date = new Date();
    // 日本標準時(UTC+9)に調整
    const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return `${jstDate.getUTCFullYear()}-${String(
      jstDate.getUTCMonth() + 1
    ).padStart(2, '0')}-${String(jstDate.getUTCDate()).padStart(2, '0')}`;
  }, []);
}

/**
 * 親エントリ（日付）のみをフィルタリング
 */
export function useFilteredParentEntries(
  docTypes: DocType[],
  activeTag: string | null = null
) {
  const today = useTodayDate();

  // 親エントリ（日付）のみをフィルタリング（今日までの日付のみ）
  const parentEntries = useMemo(() => {
    return docTypes.filter((doc) => {
      // 親エントリのみを対象とする
      if (doc.parentId) return false;

      // 日付がない場合は表示する（デフォルトの動作を維持）
      if (!doc.date) return true;

      // 今日以前の日付のみを表示
      return doc.date <= today;
    });
  }, [docTypes, today]);

  // 子エントリを日付ごとにグループ化
  const entriesByParent = useMemo(() => {
    const result: Record<string, DocType[]> = {};

    for (const doc of docTypes) {
      if (doc.parentId) {
        // タグフィルタリングが適用されている場合、タグが一致する子エントリのみを表示
        if (activeTag) {
          const tags = doc.tags || [];
          const hasTag = Array.isArray(tags)
            ? tags.includes(activeTag)
            : Object.values(tags).some(
                (tagList) =>
                  Array.isArray(tagList) && tagList.includes(activeTag)
              );

          if (!hasTag) continue;
        }

        if (!result[doc.parentId]) {
          result[doc.parentId] = [];
        }
        result[doc.parentId]?.push(doc);
      }
    }

    // 各グループを日付降順でソート
    for (const parentId of Object.keys(result)) {
      const entries = result[parentId];
      if (entries) {
        entries.sort((a, b) => {
          return (b.date || '').localeCompare(a.date || '');
        });
      }
    }

    return result;
  }, [docTypes, activeTag]);

  // 親エントリがあり、かつ対応する子エントリがある場合のみ表示
  const validParentEntries = useMemo(() => {
    if (!activeTag) return parentEntries;

    return parentEntries.filter((parent) => {
      const entries = entriesByParent[parent.id];
      return entries !== undefined && entries.length > 0;
    });
  }, [parentEntries, entriesByParent, activeTag]);

  // 年月ごとのエントリをグループ化
  const entriesByYearMonth = useMemo(() => {
    const groups: YearMonthSection[] = [];
    const yearMonthMap = new Map<string, DocType[]>();

    // 日付で降順ソート
    const sortedEntries = [...validParentEntries].sort((a, b) =>
      (b.date || '').localeCompare(a.date || '')
    );

    // 年月ごとにグループ化
    for (const entry of sortedEntries) {
      if (entry.date) {
        const yearMonth = getYearMonth(entry.date);
        if (!yearMonthMap.has(yearMonth)) {
          yearMonthMap.set(yearMonth, []);
        }
        yearMonthMap.get(yearMonth)?.push(entry);
      }
    }

    // Map を配列に変換
    for (const [yearMonth, entries] of yearMonthMap.entries()) {
      groups.push({ yearMonth, entries });
    }

    return groups;
  }, [validParentEntries]);

  // 現在見えている年月セクションを追跡するためのステート
  const [activeYearMonth, setActiveYearMonth] = useState<string>('');

  // タグフィルタリングが適用されていて、表示する子エントリがない場合
  const allFilteredChildrenEmpty =
    activeTag &&
    Object.values(entriesByParent).every((entries) => entries.length === 0);

  return {
    parentEntries,
    entriesByParent,
    validParentEntries,
    entriesByYearMonth,
    activeYearMonth,
    setActiveYearMonth,
    allFilteredChildrenEmpty,
  };
}

/**
 * スクロール時の現在のセクション追跡
 */
export function useActiveYearMonthTracking(
  sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>,
  activeYearMonth: string,
  setActiveYearMonth: (yearMonth: string) => void
) {
  useEffect(() => {
    const handleScroll = () => {
      // すべてのセクションの位置をチェック
      let currentSection = '';
      let minDistance = Number.POSITIVE_INFINITY;

      for (const [yearMonth, ref] of Object.entries(sectionRefs.current)) {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          // ヘッダーの高さを考慮（100pxと仮定）
          const distance = Math.abs(rect.top - 100);

          if (distance < minDistance) {
            minDistance = distance;
            currentSection = yearMonth;
          }
        }
      }

      if (currentSection && currentSection !== activeYearMonth) {
        setActiveYearMonth(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初期値を設定

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeYearMonth, setActiveYearMonth, sectionRefs]);
}
