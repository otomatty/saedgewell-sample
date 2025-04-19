'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';
import type { Database } from '../../lib/database.types';
import {
  WorkFormSchema,
  type WorkFormData,
} from '../../app/(protected)/works/_components/schemas';

type WorkDetail = Database['public']['Tables']['work_details']['Insert'];

/**
 * 実績を更新する
 * @param id 更新対象の実績ID
 * @param data 更新データ
 * @returns 更新された実績データ
 */
export async function updateWork(id: string, data: WorkFormData) {
  // 入力データをバリデーション
  const validated = WorkFormSchema.parse(data);

  const supabase = getSupabaseServerClient();

  // 実績の基本情報を更新
  const { error: updateError } = await supabase
    .from('works')
    .update({
      title: validated.title,
      description: validated.description || '',
      // TODO: 他のフィールドも更新
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (updateError) {
    console.error('実績更新エラー:', updateError);
    throw new Error(`実績の更新に失敗しました: ${updateError.message}`);
  }

  // TODO: 実績の詳細情報、画像、技術要素などを更新

  // 更新後のデータを取得
  const { data: updatedWork, error: fetchError } = await supabase
    .from('works')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('更新後の実績取得エラー:', fetchError);
    throw new Error(`更新後の実績の取得に失敗しました: ${fetchError.message}`);
  }

  return updatedWork;
}

/**
 * 実績の詳細情報を更新する
 * @param workId 実績ID
 * @param data 詳細情報データ
 */
export async function updateWorkDetail(
  workId: string,
  data: {
    overview?: string;
    role?: string;
    period?: string;
    team_size?: string;
  }
) {
  const supabase = getSupabaseServerClient();

  // 既存の詳細情報を取得
  const { data: existingDetail } = await supabase
    .from('work_details')
    .select('id')
    .eq('work_id', workId)
    .maybeSingle();

  if (existingDetail) {
    // 詳細情報が存在する場合は更新
    const { error } = await supabase
      .from('work_details')
      .update({
        overview: data.overview ?? '',
        role: data.role ?? '',
        period: data.period ?? '',
        team_size: data.team_size ?? '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingDetail.id);

    if (error) {
      console.error('詳細情報更新エラー:', error);
      throw new Error(`詳細情報の更新に失敗しました: ${error.message}`);
    }
  } else {
    // 詳細情報が存在しない場合は作成
    const { error } = await supabase.from('work_details').insert({
      work_id: workId,
      overview: data.overview ?? '',
      role: data.role ?? '',
      period: data.period ?? '',
      team_size: data.team_size ?? '',
    } as WorkDetail);

    if (error) {
      console.error('詳細情報作成エラー:', error);
      throw new Error(`詳細情報の作成に失敗しました: ${error.message}`);
    }
  }
}
