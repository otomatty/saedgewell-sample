'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { WorkFormData } from '~/types/works/work-form';

interface CreateWorkResponse {
  success: boolean;
  message: string;
  workId?: string;
}

/**
 * 新規実績データを作成するためのServer Action
 *
 * @param formData 実績作成フォームから送信されたデータ
 * @returns 作成結果のレスポンス
 */
export async function createWork(
  formData: WorkFormData
): Promise<CreateWorkResponse> {
  try {
    const supabase = getSupabaseServerClient();

    // 1. まず works テーブルにメインデータを挿入
    const { data: workData, error: workError } = await supabase
      .from('works')
      .insert({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        thumbnail_url: formData.thumbnail_url,
        category: formData.category, // カテゴリーフィールドを追加
        github_url: formData.github_url || null,
        website_url: formData.website_url || null,
        status: formData.status === 'public' ? 'published' : formData.status, // publicをpublishedに変換
        // published_at は 'public' の場合に現在日時、それ以外は null
        published_at:
          formData.status === 'public' ? new Date().toISOString() : null,
      })
      .select('id')
      .single();

    if (workError) {
      console.error('実績の作成中にエラーが発生しました:', workError);
      return {
        success: false,
        message: `実績の作成に失敗しました: ${workError.message}`,
      };
    }

    const workId = workData.id;

    // 2. work_details テーブルに詳細情報を挿入
    const { error: detailsError } = await supabase.from('work_details').insert({
      work_id: workId,
      overview: formData.detail_overview,
      role: formData.detail_role,
      period: formData.detail_period,
      team_size: formData.detail_team_size,
    });

    if (detailsError) {
      console.error('実績詳細の作成中にエラーが発生しました:', detailsError);
      // メインデータは作成されているので、エラーだが成功として扱う
      return {
        success: true,
        message: `実績は作成されましたが、詳細データの登録に失敗しました: ${detailsError.message}`,
        workId,
      };
    }

    // 3. 関連テーブルのデータ挿入（配列データ）
    // 注：各配列が存在する場合のみ処理する

    // 技術要素の登録 (work_technologies)
    if (formData.technologies && formData.technologies.length > 0) {
      const techData = formData.technologies.map((techId: string) => ({
        work_id: workId,
        technology_id: techId,
      }));

      const { error: techError } = await supabase
        .from('work_technologies')
        .insert(techData);

      if (techError) {
        console.error('技術要素の登録中にエラーが発生しました:', techError);
      }
    }

    // 画像の登録 (work_images)
    if (formData.images && formData.images.length > 0) {
      const imageData = formData.images.map(
        (
          image: { url: string; alt?: string; caption?: string },
          index: number
        ) => ({
          work_id: workId,
          url: image.url,
          alt: image.alt || formData.title,
          caption: image.caption || null,
          sort_order: index,
        })
      );

      const { error: imageError } = await supabase
        .from('work_images')
        .insert(imageData);

      if (imageError) {
        console.error('画像の登録中にエラーが発生しました:', imageError);
      }
    }

    // 課題の登録 (work_challenges)
    if (formData.challenges && formData.challenges.length > 0) {
      const challengeData = formData.challenges.map(
        (challenge: { title: string; description: string }, index: number) => ({
          work_id: workId,
          title: challenge.title,
          description: challenge.description,
          sort_order: index,
        })
      );

      const { error: challengeError } = await supabase
        .from('work_challenges')
        .insert(challengeData);

      if (challengeError) {
        console.error('課題の登録中にエラーが発生しました:', challengeError);
      }
    }

    // 解決策の登録 (work_solutions)
    if (formData.solutions && formData.solutions.length > 0) {
      const solutionData = formData.solutions.map(
        (
          solution: {
            title: string;
            description: string;
            challenge_id?: string;
          },
          index: number
        ) => ({
          work_id: workId,
          title: solution.title,
          description: solution.description,
          challenge_id: solution.challenge_id || null,
          sort_order: index,
        })
      );

      const { error: solutionError } = await supabase
        .from('work_solutions')
        .insert(solutionData);

      if (solutionError) {
        console.error('解決策の登録中にエラーが発生しました:', solutionError);
      }
    }

    // 担当業務の登録 (work_responsibilities)
    if (formData.responsibilities && formData.responsibilities.length > 0) {
      const respData = formData.responsibilities.map(
        (resp: { description: string }, index: number) => ({
          work_id: workId,
          description: resp.description,
          sort_order: index,
        })
      );

      const { error: respError } = await supabase
        .from('work_responsibilities')
        .insert(respData);

      if (respError) {
        console.error('担当業務の登録中にエラーが発生しました:', respError);
      }
    }

    // 成果の登録 (work_results)
    if (formData.results && formData.results.length > 0) {
      const resultData = formData.results.map(
        (result: { description: string }, index: number) => ({
          work_id: workId,
          description: result.description,
          sort_order: index,
        })
      );

      const { error: resultError } = await supabase
        .from('work_results')
        .insert(resultData);

      if (resultError) {
        console.error('成果の登録中にエラーが発生しました:', resultError);
      }
    }

    // キャッシュの再検証（実績一覧ページを更新）
    revalidatePath('/works');

    return {
      success: true,
      message: '実績が正常に作成されました',
      workId,
    };
  } catch (error) {
    // 予期せぬエラーのハンドリング
    console.error('実績作成中に予期せぬエラーが発生:', error);
    return {
      success: false,
      message: `予期せぬエラーが発生しました: ${(error as Error).message}`,
    };
  }
}
