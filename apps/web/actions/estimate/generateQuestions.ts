'use server';

import { mastraClient } from '../../lib/mastra/client';
import { WORKFLOWS } from '../../lib/mastra/workflow';
import { FollowUpQuestionResponseSchema } from '../../types/estimate';

/**
 * 質問生成ワークフローを実行し、ユーザー入力に基づいた質問リストを生成する
 * @param userInput ユーザーが入力したプロジェクト概要
 * @param projectType プロジェクトの種類
 * @returns 生成された質問リスト
 */
export async function generateQuestions(
  userInput: string,
  projectType: string
) {
  try {
    console.log(
      `Generating questions for: ${projectType} - ${userInput.substring(0, 50)}...`
    );

    // 時間単価設定（本来は設定ファイルから取得するなど、もっと柔軟な方法が良い）
    const hourlyRates = {
      website: 10000, // Webサイト時間単価
      business_system: 12000, // 業務システム時間単価
      application: 11000, // アプリケーション時間単価
      other: 10000, // その他時間単価
    };

    // Mastraワークフローの実行
    const workflow = mastraClient.getWorkflow(WORKFLOWS.QUESTION_GENERATION);

    // ワークフローの実行
    const result = await workflow.startAsync({
      triggerData: {
        userInput,
        projectType,
        hourlyRates,
      },
    });

    console.log('Workflow result received:', result);

    // 結果の検証 - startAsyncの戻り値構造に合わせて修正
    const stepResult = result.results?.generateFollowUpQuestions;
    if (stepResult?.status !== 'success') {
      console.error(
        'GenerateFollowUpQuestions step failed or did not complete:',
        stepResult
      );
      throw new Error('質問生成ステップが正常に完了しませんでした。');
    }
    const output = stepResult.output;
    const validatedResult = FollowUpQuestionResponseSchema.safeParse(output);

    if (!validatedResult.success) {
      console.error('Invalid response format:', validatedResult.error);
      throw new Error('質問の生成に失敗しました。フォーマットが不正です。');
    }

    return validatedResult.data;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(
      `質問の生成中にエラーが発生しました: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
