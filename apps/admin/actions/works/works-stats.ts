// apps/admin/actions/works/works-stats.ts
'use server';

import { unstable_noStore as noStore } from 'next/cache'; // キャッシュを無効化する場合
import { getSupabaseServerClient } from '@kit/supabase/server-client'; // 仮のパス
import type {
  WorkStats,
  CategoryStat,
  TopTechnologyStat,
} from '../../types/works/works-stats'; // 型定義をインポート

/**
 * カテゴリ別の実績統計を取得する Server Action
 * 注意: パフォーマンスの観点から、将来的には .rpc() を使用したDB関数呼び出し推奨
 */
export async function getWorkCategoryStats(): Promise<WorkStats | null> {
  noStore(); // データ取得時にキャッシュを無効化 (常に最新を取得)
  const supabase = getSupabaseServerClient();

  try {
    // --- 全実績データを取得してクライアントサイドで集計 ---
    // (パフォーマンス注意: データ量が増えると非効率)
    const { data: allWorks, error: worksError } = await supabase
      .from('works')
      .select('category, status'); // 集計に必要なカラムのみ取得
    // .returns<Pick<WorksTable, 'category' | 'status'>[]>(); // 型を明示

    if (worksError) {
      console.error('Error fetching all works data:', worksError);
      throw new Error('Failed to fetch works data for statistics.');
    }

    if (!allWorks) {
      return {
        totalWorks: 0,
        totalByCategory: [],
        publishedWorks: 0,
        publishedByCategory: [],
      };
    }

    // --- クライアントサイドで集計 ---
    let totalCount = 0;
    let publishedCount = 0;
    const totalByCategoryMap = new Map<string, number>();
    const publishedByCategoryMap = new Map<string, number>();

    for (const work of allWorks) {
      totalCount++;
      const currentTotalCount = totalByCategoryMap.get(work.category) || 0;
      totalByCategoryMap.set(work.category, currentTotalCount + 1);

      if (work.status === 'published') {
        publishedCount++;
        const currentPublishedCount =
          publishedByCategoryMap.get(work.category) || 0;
        publishedByCategoryMap.set(work.category, currentPublishedCount + 1);
      }
    }

    // --- 結果を整形 ---
    const totalByCategory: CategoryStat[] = Array.from(
      totalByCategoryMap.entries()
    )
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const publishedByCategory: CategoryStat[] = Array.from(
      publishedByCategoryMap.entries()
    )
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalWorks: totalCount,
      totalByCategory,
      publishedWorks: publishedCount,
      publishedByCategory,
    };
  } catch (error) {
    console.error('Database Error in getWorkCategoryStats:', error);
    throw new Error(
      'Failed to fetch work category statistics due to database error.'
    );
  }
}

/**
 * よく使われている技術 Top N を取得する Server Action
 */
export async function getTopTechnologiesStats(
  limit = 5
): Promise<TopTechnologyStat[] | null> {
  noStore();
  const supabase = getSupabaseServerClient();

  try {
    // RPC 関数の呼び出しをやめ、クライアントサイド集計に戻す
    // (パフォーマンス注意: work_technologies のレコード数が増えると非効率)
    /*
    const { data, error } = await supabase
      .rpc('get_top_technologies', { limit_count: limit }); // RPC関数呼び出しに変更
    */
    const { data, error } = await supabase
      .from('work_technologies')
      .select(`
         work_id,
         technologies!inner ( name )
      `)
      // 型を明示的に指定
      .returns<{ work_id: string; technologies: { name: string } | null }[]>();

    if (error) {
      console.error('Error fetching work technologies data:', error);
      throw new Error('Failed to fetch work technologies for stats.');
    }

    // RPC 関数の処理を削除
    /*
    if (!data) {
      return [];
    }
    */

    // クライアントサイド集計ロジックを有効化
    if (!data) return []; // データがなければ空配列を返す

    const techCounts = new Map<string, number>();
    for (const item of data) {
      // Optional Chaining を使用するように修正
      if (item?.technologies) {
        const count = techCounts.get(item.technologies.name) || 0;
        techCounts.set(item.technologies.name, count + 1);
      }
    }

    const topTechnologies: TopTechnologyStat[] = Array.from(
      techCounts.entries()
    )
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return topTechnologies;
  } catch (error) {
    console.error('Database Error in getTopTechnologiesStats:', error);
    throw new Error(
      'Failed to fetch top technologies statistics due to database error.'
    );
  }
}
