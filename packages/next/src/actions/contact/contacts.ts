'use server';

import type { Database } from '@kit/supabase/database';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

type Estimate = Database['public']['Tables']['estimates']['Row'];
type EstimateFeature = Database['public']['Tables']['estimate_features']['Row'];
type EstimateRequirement =
  Database['public']['Tables']['estimate_requirements']['Row'];

/**
 * 見積もりを作成
 */
export async function createEstimate(
  estimate: Omit<Estimate, 'id' | 'created_at' | 'updated_at'>,
  features: Omit<
    EstimateFeature,
    'id' | 'estimate_id' | 'created_at' | 'updated_at'
  >[],
  requirements: Omit<
    EstimateRequirement,
    'id' | 'estimate_id' | 'created_at' | 'updated_at'
  >
) {
  const supabase = getSupabaseServerClient();

  // トランザクションを開始
  const { data: estimateData, error: estimateError } = await supabase
    .from('estimates')
    .insert([estimate])
    .select()
    .single();

  if (estimateError) {
    throw new Error(`Failed to create estimate: ${estimateError.message}`);
  }

  // 見積もりの機能を作成
  const { error: featuresError } = await supabase
    .from('estimate_features')
    .insert(
      features.map((feature) => ({
        ...feature,
        estimate_id: estimateData.id,
      }))
    );

  if (featuresError) {
    throw new Error(
      `Failed to create estimate features: ${featuresError.message}`
    );
  }

  // 見積もりの要件を作成
  const { error: requirementsError } = await supabase
    .from('estimate_requirements')
    .insert([
      {
        ...requirements,
        estimate_id: estimateData.id,
      },
    ]);

  if (requirementsError) {
    throw new Error(
      `Failed to create estimate requirements: ${requirementsError.message}`
    );
  }

  return estimateData;
}

/**
 * 見積もりを取得
 */
export async function getEstimate(id: string): Promise<
  | (Estimate & {
      estimate_features: EstimateFeature[];
      estimate_requirements: EstimateRequirement[];
    })
  | null
> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('estimates')
    .select(`
      *,
      estimate_features(*),
      estimate_requirements(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch estimate: ${error.message}`);
  }

  return data;
}
