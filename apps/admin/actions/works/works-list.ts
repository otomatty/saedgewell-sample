'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type {
  WorkListItem,
  WorkStatus,
  GetWorksListOptions,
  WorksListResponse,
} from '../../types/works/works-list';

/**
 * @interface GetWorksListOptions
 * @description getWorksList Server Action のオプション
 */
// export interface GetWorksListOptions { ... } // 型定義ファイルに移動したので削除

/**
 * @function getWorksList
 * @description 実績データの一覧を取得する Server Action。
 * @param {GetWorksListOptions} options - 取得オプション (ソート、フィルター、ページネーション)。
 * @returns {Promise<WorksListResponse>} 実績データリストと総件数。
 */
export async function getWorksList(
  options: GetWorksListOptions = {}
): Promise<WorksListResponse> {
  // getSupabaseServerClient は型<Database>を引数に取ることが多い。
  // プロジェクトの型定義に合わせて修正が必要な場合があります。
  // 例: const supabase = getSupabaseServerClient<Database>();
  const supabase = getSupabaseServerClient();

  // ベースとなるクエリ: 必要なカラムを選択し、カテゴリ名を JOIN
  // select 文でエイリアスを明確にする (category_name)
  // リレーション先のカラム名も指定 (work_categories.name)
  let query = supabase.from('works').select(`
      id,
      title,
      status,
      published_at,
      created_at,
      updated_at,
      thumbnail_url,
      work_category_id,
      work_categories (id, name)
    `);

  // カウントクエリを作成 (フィルタリング条件を同一にする)
  let countQuery = supabase.from('works').select('id', { count: 'exact' });

  // 共通のフィルタリング条件を関数化
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>Supabase クエリビルダータイプの互換性問題を回避するため</explanation>
  const applyFilters = (q: any) => {
    let filteredQuery = q;

    if (options.filterByTitle) {
      filteredQuery = filteredQuery.ilike(
        'title',
        `%${options.filterByTitle}%`
      );
    }
    if (options.filterByStatus) {
      filteredQuery = filteredQuery.eq('status', options.filterByStatus);
    }

    // カテゴリIDでのフィルタリング (事前に取得したIDを使用)
    if (options.filterByCategoryId) {
      filteredQuery = filteredQuery.eq(
        'work_category_id',
        options.filterByCategoryId
      );
    }

    return filteredQuery;
  };

  // フィルターの適用
  query = applyFilters(query);
  countQuery = applyFilters(countQuery);

  // カテゴリ名でのフィルタリング (IDに変換して適用)
  if (options.filterByCategoryName) {
    // カテゴリ名を元にカテゴリIDを取得
    try {
      const { data: categoryData } = await supabase
        .from('work_categories')
        .select('id')
        .eq('name', options.filterByCategoryName)
        .single();

      if (categoryData) {
        // メインクエリとカウントクエリの両方に条件を適用
        query = query.eq('work_category_id', categoryData.id);
        countQuery = countQuery.eq('work_category_id', categoryData.id);
      } else {
        console.warn(
          `カテゴリ名 "${options.filterByCategoryName}" が見つかりませんでした。`
        );
        // カテゴリが見つからない場合、空の結果を返す
        return { data: [], count: 0 };
      }
    } catch (error) {
      console.error('カテゴリの検索中にエラーが発生しました:', error);
      // エラーの場合もクエリを続行
    }
  }

  // ソートの適用
  if (options.sortBy) {
    const isAscending = options.sortDirection === 'asc';
    if (options.sortBy === 'category') {
      // カテゴリでのソートは一旦標準順に
      console.warn('カテゴリ名でのソートは現在実装されていません。');
      query = query.order('created_at', { ascending: false }); // デフォルトソートに戻す
    } else {
      // sortBy は型定義で文字列リテラルに限定されているため、直接渡せるはず
      query = query.order(options.sortBy, { ascending: isAscending });
    }
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // 総件数の取得
  const { count, error: countError } = await countQuery;

  if (countError) {
    console.error('Error counting works:', countError);
    throw new Error(`実績総数の取得に失敗しました: ${countError.message}`);
  }

  // ページネーションの適用
  if (options.page && options.pageSize) {
    const from = (options.page - 1) * options.pageSize;
    const to = from + options.pageSize - 1;
    query = query.range(from, to);
  }

  // メインクエリ実行
  const { data: rawData, error } = await query;
  const data = rawData;

  // エラーハンドリング
  if (error) {
    console.error('Error fetching works list:', error);
    throw new Error(`実績一覧の取得に失敗しました: ${error.message}`);
  }

  // データが存在しない場合
  if (!data) {
    return { data: [], count: 0 };
  }

  // 取得したデータを WorkListItem[] 型に整形
  const worksList: WorkListItem[] = data.map((work) => {
    // work_categories が存在し、かつ name プロパティを持つかチェック
    const categoryName =
      work.work_categories &&
      typeof work.work_categories === 'object' &&
      work.work_categories !== null && // null チェックを追加 (より安全に)
      'name' in work.work_categories
        ? work.work_categories.name
        : 'カテゴリ未設定';

    // created_at, updated_at が null でないことを保証 (DBスキーマ上は NOT NULL のはず)
    const createdAt = work.created_at ? new Date(work.created_at) : new Date(0); // nullならエポック
    const updatedAt = work.updated_at ? new Date(work.updated_at) : new Date(0); // nullならエポック

    return {
      id: work.id,
      title: work.title,
      status: work.status as WorkStatus,
      category: categoryName,
      published_at: work.published_at ? new Date(work.published_at) : null,
      created_at: createdAt, // 修正後の値を使用
      updated_at: updatedAt, // 修正後の値を使用
      thumbnail_url: work.thumbnail_url ?? null,
    };
  });

  return { data: worksList, count: count || 0 };
}
