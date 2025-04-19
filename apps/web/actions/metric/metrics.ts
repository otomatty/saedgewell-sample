'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import type { Metric } from '../../types/metrics';
import { revalidatePath } from 'next/cache';

/**
 * メトリクスデータを取得する
 * @description metricsテーブルからすべてのデータをソート順に取得する
 * @returns Metricの配列
 */
export async function getMetrics() {
  try {
    // JWT問題が解決したため、標準クライアントのみを使用
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('メトリクス取得エラー:', error);
      throw new Error(error.message);
    }

    return data as Metric[];
  } catch (error) {
    console.error('メトリクス取得中にエラーが発生しました:', error);
    throw error;
  }
}

/**
 * 新しいメトリクスデータを作成する
 * @param metric 作成するメトリクスデータ
 */
export async function createMetric(
  metric: Omit<Metric, 'id' | 'created_at' | 'updated_at'>
) {
  try {
    // 管理操作にはサービスロールクライアントを使用
    const supabase = getSupabaseServerAdminClient();

    const { error } = await supabase.from('metrics').insert(metric);

    if (error) {
      console.error('メトリクス作成エラー:', error);
      throw new Error(error.message);
    }

    revalidatePath('/admin');
  } catch (error) {
    console.error('メトリクス作成中にエラーが発生しました:', error);
    throw error;
  }
}

/**
 * メトリクスデータを更新する
 * @param id 更新対象のメトリクスID
 * @param updates 更新するデータ
 */
export async function updateMetric(
  id: string,
  updates: Partial<Omit<Metric, 'id' | 'created_at' | 'updated_at'>>
) {
  try {
    // 管理操作にはサービスロールクライアントを使用
    const supabase = getSupabaseServerAdminClient();

    const { error } = await supabase
      .from('metrics')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('メトリクス更新エラー:', error);
      throw new Error(error.message);
    }

    revalidatePath('/admin');
  } catch (error) {
    console.error('メトリクス更新中にエラーが発生しました:', error);
    throw error;
  }
}

/**
 * メトリクスデータを削除する
 * @param id 削除対象のメトリクスID
 */
export async function deleteMetric(id: string) {
  try {
    // 管理操作にはサービスロールクライアントを使用
    const supabase = getSupabaseServerAdminClient();

    const { error } = await supabase.from('metrics').delete().eq('id', id);

    if (error) {
      console.error('メトリクス削除エラー:', error);
      throw new Error(error.message);
    }

    revalidatePath('/admin');
  } catch (error) {
    console.error('メトリクス削除中にエラーが発生しました:', error);
    throw error;
  }
}
