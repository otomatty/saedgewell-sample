'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export interface ChallengeData {
  id?: string;
  title: string;
  description: string;
  sort_order: number;
  isNew?: boolean;
  isDeleted?: boolean;
}

export interface SolutionData {
  id?: string;
  challenge_id?: string | null;
  title: string;
  description: string;
  sort_order: number;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface UpdateChallengesAndSolutionsData {
  challenges: ChallengeData[];
  solutions: SolutionData[];
}

/**
 * 実績の課題と解決策を更新する
 * @param workId 実績ID
 * @param data 課題と解決策のデータ
 * @returns 更新結果
 */
export async function updateChallengesAndSolutions(
  workId: string,
  data: UpdateChallengesAndSolutionsData
) {
  const supabase = getSupabaseServerClient();

  try {
    // 課題の処理
    const challengesToDelete = data.challenges.filter(
      (c) => c.isDeleted && c.id
    );
    const challengesToUpdate = data.challenges.filter(
      (c) => !c.isNew && !c.isDeleted && c.id
    );
    const challengesToCreate = data.challenges.filter(
      (c) => c.isNew && !c.isDeleted
    );

    // 課題の削除
    for (const challenge of challengesToDelete) {
      if (!challenge.id) continue;

      // 課題に関連する解決策も削除
      const { error: deleteSolutionsError } = await supabase
        .from('work_solutions')
        .delete()
        .eq('challenge_id', challenge.id);

      if (deleteSolutionsError) {
        throw new Error(
          `解決策の削除に失敗しました: ${deleteSolutionsError.message}`
        );
      }

      // 課題を削除
      const { error: deleteChallengeError } = await supabase
        .from('work_challenges')
        .delete()
        .eq('id', challenge.id);

      if (deleteChallengeError) {
        throw new Error(
          `課題の削除に失敗しました: ${deleteChallengeError.message}`
        );
      }
    }

    // 課題の更新
    for (const challenge of challengesToUpdate) {
      if (!challenge.id) continue;

      const { error: updateError } = await supabase
        .from('work_challenges')
        .update({
          title: challenge.title,
          description: challenge.description,
          sort_order: challenge.sort_order,
        })
        .eq('id', challenge.id);

      if (updateError) {
        throw new Error(`課題の更新に失敗しました: ${updateError.message}`);
      }
    }

    // 課題の作成
    for (const challenge of challengesToCreate) {
      const { data: newChallenge, error: createError } = await supabase
        .from('work_challenges')
        .insert({
          work_id: workId,
          title: challenge.title,
          description: challenge.description,
          sort_order: challenge.sort_order,
        })
        .select('id')
        .single();

      if (createError) {
        throw new Error(`課題の作成に失敗しました: ${createError.message}`);
      }

      // 関連付けられた解決策のchallenge_idを更新
      if (newChallenge) {
        // 一時IDを使って関連付けられた解決策を探す
        const tempChallengeId = challenge.id;
        if (tempChallengeId) {
          // 一時IDで関連付けられた解決策をループ
          for (let i = 0; i < data.solutions.length; i++) {
            const solution = data.solutions[i];
            if (solution && solution.challenge_id === tempChallengeId) {
              solution.challenge_id = newChallenge.id;
            }
          }
        }
      }
    }

    // 解決策の処理
    const solutionsToDelete = data.solutions.filter((s) => s.isDeleted && s.id);
    const solutionsToUpdate = data.solutions.filter(
      (s) => !s.isNew && !s.isDeleted && s.id
    );
    const solutionsToCreate = data.solutions.filter(
      (s) => s.isNew && !s.isDeleted
    );

    // 解決策の削除
    for (const solution of solutionsToDelete) {
      if (!solution.id) continue;

      const { error: deleteError } = await supabase
        .from('work_solutions')
        .delete()
        .eq('id', solution.id);

      if (deleteError) {
        throw new Error(`解決策の削除に失敗しました: ${deleteError.message}`);
      }
    }

    // 解決策の更新
    for (const solution of solutionsToUpdate) {
      if (!solution.id) continue;

      const { error: updateError } = await supabase
        .from('work_solutions')
        .update({
          title: solution.title,
          description: solution.description,
          challenge_id: solution.challenge_id,
          sort_order: solution.sort_order,
        })
        .eq('id', solution.id);

      if (updateError) {
        throw new Error(`解決策の更新に失敗しました: ${updateError.message}`);
      }
    }

    // 解決策の作成
    for (const solution of solutionsToCreate) {
      const { error: createError } = await supabase
        .from('work_solutions')
        .insert({
          work_id: workId,
          challenge_id: solution.challenge_id,
          title: solution.title,
          description: solution.description,
          sort_order: solution.sort_order,
        });

      if (createError) {
        throw new Error(`解決策の作成に失敗しました: ${createError.message}`);
      }
    }

    // キャッシュをクリア
    revalidatePath(`/works/${workId}`);

    return { success: true };
  } catch (error) {
    console.error('課題と解決策の更新に失敗しました:', error);
    throw error;
  }
}
