'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Database } from '../../lib/database.types';

type Work = Database['public']['Tables']['works']['Row'];
type WorkDetail = Database['public']['Tables']['work_details']['Row'];
type WorkImage = Database['public']['Tables']['work_images']['Row'];
type WorkChallenge = Database['public']['Tables']['work_challenges']['Row'];
type WorkSolution = Database['public']['Tables']['work_solutions']['Row'];
type WorkResponsibility =
  Database['public']['Tables']['work_responsibilities']['Row'];
type WorkResult = Database['public']['Tables']['work_results']['Row'];
type Technology = Database['public']['Tables']['technologies']['Row'];
type WorkTechnology = Database['public']['Tables']['work_technologies']['Row'];

/**
 * 実績詳細を取得するインターフェース
 */
export interface WorkDetailData {
  work: Work;
  detail?: WorkDetail | null;
  images: WorkImage[];
  challenges: WorkChallenge[];
  solutions: WorkSolution[];
  responsibilities: WorkResponsibility[];
  results: WorkResult[];
  technologies: Array<WorkTechnology & { technology: Technology }>;
}

/**
 * 実績詳細を取得する
 * @param id 実績ID
 * @returns 実績の詳細情報
 */
export async function getWorkDetail(id: string): Promise<WorkDetailData> {
  const supabase = getSupabaseServerClient();

  // 基本情報を取得
  const { data: work, error: workError } = await supabase
    .from('works')
    .select('*')
    .eq('id', id)
    .single();

  if (workError) {
    console.error('実績取得エラー:', workError);
    throw new Error(`実績の取得に失敗しました: ${workError.message}`);
  }

  if (!work) {
    throw new Error('実績が見つかりません');
  }

  // 詳細情報を取得
  const { data: detail } = await supabase
    .from('work_details')
    .select('*')
    .eq('work_id', id)
    .single();

  // 画像を取得
  const { data: images = [] } = await supabase
    .from('work_images')
    .select('*')
    .eq('work_id', id)
    .order('sort_order');

  // 課題を取得
  const { data: challenges = [] } = await supabase
    .from('work_challenges')
    .select('*')
    .eq('work_id', id)
    .order('sort_order');

  // 解決策を取得
  const { data: solutions = [] } = await supabase
    .from('work_solutions')
    .select('*')
    .eq('work_id', id)
    .order('sort_order');

  // 担当業務を取得
  const { data: responsibilities = [] } = await supabase
    .from('work_responsibilities')
    .select('*')
    .eq('work_id', id)
    .order('sort_order');

  // 成果を取得
  const { data: results = [] } = await supabase
    .from('work_results')
    .select('*')
    .eq('work_id', id)
    .order('sort_order');

  // 使用技術を取得（技術情報も含める）
  const { data: technologies = [] } = await supabase
    .from('work_technologies')
    .select('*, technology:technologies(*)')
    .eq('work_id', id);

  return {
    work,
    detail,
    images: images ?? [],
    challenges: challenges ?? [],
    solutions: solutions ?? [],
    responsibilities: responsibilities ?? [],
    results: results ?? [],
    technologies: technologies ?? [],
  };
}
