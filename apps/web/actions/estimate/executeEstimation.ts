'use server';

import { z } from 'zod';
import { mastraClient } from '../../lib/mastra/client';
import { WORKFLOWS } from '../../lib/mastra/workflow';
import {
  // ★ 修正した QuestionAnswerSchema をインポート
  QuestionAnswerSchema,
  AIQuestionSchema,
  ProjectTemplateWithSimilaritySchema,
  HourlyRatesSchema,
  ProjectTypeSchema,
} from '../../types/estimate'; // 必要な型をインポート
import {
  FinalEstimateSchema,
  CostBreakdownSchema,
  type FinalEstimate,
} from '../../store/estimate'; // 新しく追加したスキーマと型をインポート

// ★ calculateCost.ts の FeatureWithCostSchema と同等の型を定義
//    (本来は共通化すべきだが、一旦ここで定義)
const FeatureWithCostSchemaForAction = z.object({
  category: z.string(),
  feature: z.string(),
  description: z.string(),
  isNecessary: z.boolean(),
  reason: z.string(),
  estimatedHours: z.number(),
  estimationBasis: z.string(),
  cost: z.number(),
});
type FeatureWithCostForAction = z.infer<typeof FeatureWithCostSchemaForAction>;

// estimationExecutionWorkflow のトリガースキーマに合わせて入力データを定義
const ExecuteEstimationInputSchema = z.object({
  userInput: z.string(),
  projectType: ProjectTypeSchema.optional(), // 型定義からインポート
  hourlyRates: HourlyRatesSchema, // 型定義からインポート
  similarProjects: z.array(ProjectTemplateWithSimilaritySchema), // 型定義からインポート
  followUpQuestions: z.array(
    AIQuestionSchema.pick({
      // ワークフローが必要とするフィールドに限定
      questionId: true,
      questionText: true,
      type: true,
      options: true,
      validationRules: true,
    })
  ),
  // ★ 修正した QuestionAnswerSchema を使うように変更
  answers: z
    .array(QuestionAnswerSchema)
    .describe(
      'ユーザーが入力した追加質問への回答リスト（未回答・スキップ情報を含む）'
    ),
});

type ExecuteEstimationInput = z.infer<typeof ExecuteEstimationInputSchema>;

/**
 * 質問への回答をMastraのestimationExecutionWorkflowに送信して見積もり計算を実行する
 * @param input estimationExecutionWorkflowのトリガーに必要なデータ
 * @returns ワークフローの実行結果（見積もり情報を含む）
 */
export async function executeEstimation(
  input: ExecuteEstimationInput
): Promise<{
  success: boolean;
  runId: string;
  result: FinalEstimate;
  message: string;
}> {
  const executionId = Math.random().toString(36).substring(2, 9);
  console.log(`[EXEC:${executionId}] Estimation execution started`);

  try {
    // 入力データの検証
    const validationResult = ExecuteEstimationInputSchema.safeParse(input);
    if (!validationResult.success) {
      console.error(
        `[EXEC:${executionId}] Input validation failed:`,
        validationResult.error
      );
      throw new Error(
        `回答送信データの形式が不正です: ${validationResult.error.message}`
      );
    }

    const {
      userInput,
      projectType,
      hourlyRates,
      similarProjects,
      followUpQuestions,
      answers,
    } = validationResult.data;

    console.log(`[EXEC:${executionId}] Input validation successful:`, {
      userInputLength: userInput?.length || 0,
      projectType,
      hourlyRatesKeys: Object.keys(hourlyRates || {}),
      similarProjectsCount: similarProjects?.length || 0,
      followUpQuestionsCount: followUpQuestions?.length || 0,
      answersCount: answers?.length || 0,
    });

    // ワークフローを取得
    const workflow = mastraClient.getWorkflow(WORKFLOWS.ESTIMATION_EXECUTION);
    console.log(
      `[EXEC:${executionId}] Got workflow:`,
      WORKFLOWS.ESTIMATION_EXECUTION
    );

    // ワークフローに送信するデータを構築
    const triggerData = {
      userInput,
      projectType,
      hourlyRates,
      similarProjects,
      followUpQuestions: followUpQuestions.map((q) => ({
        questionId: q.questionId,
        questionText: q.questionText,
        type: q.type,
        options: q.options,
        validationRules: q.validationRules,
      })),
      answers: answers.map((ans) => ({
        questionId: ans.questionId,
        answer: ans.answer, // nullの場合もある
        isAnswered: ans.isAnswered,
        skipped: ans.skipped,
      })),
    };

    console.log(
      `[EXEC:${executionId}] Trigger data prepared, starting workflow...`
    );
    const startTime = Date.now();

    const result = await workflow.startAsync({ triggerData });

    const endTime = Date.now();
    console.log(
      `[EXEC:${executionId}] Workflow completed in ${endTime - startTime}ms`
    );
    console.log(`[EXEC:${executionId}] Raw result:`, JSON.stringify(result));

    // ★ ワークフローの出力構造を考慮してデータを抽出・加工する
    const calculateCostResult = result.results?.calculateCost;
    if (calculateCostResult?.status !== 'success') {
      console.error(
        `[EXEC:${executionId}] calculateCost step did not succeed. Status: ${calculateCostResult?.status}`,
        calculateCostResult
      );
      throw new Error(
        `コスト計算ステップが成功しませんでした (ステータス: ${calculateCostResult?.status})。`
      );
    }

    const calculationOutput = calculateCostResult.output;
    if (!Array.isArray(calculationOutput?.featuresWithCost)) {
      console.error(
        `[EXEC:${executionId}] Invalid structure in calculateCost output: featuresWithCost is missing or not an array.`,
        calculationOutput
      );
      throw new Error(
        'コスト計算結果の形式 (featuresWithCost 配列) が不正です。'
      );
    }

    const featuresWithCost: FeatureWithCostForAction[] =
      calculationOutput.featuresWithCost;

    // ★ 集計値を計算する
    let requiredHours = 0;
    let requiredCost = 0;
    let optionalHours = 0;
    let optionalCost = 0;

    // featuresWithCost の型を明示的に指定 (calculateCost.ts の FeatureWithCost と同等)
    for (const feature of featuresWithCost) {
      if (feature.isNecessary) {
        requiredHours += feature.estimatedHours;
        requiredCost += feature.cost;
      } else {
        optionalHours += feature.estimatedHours;
        optionalCost += feature.cost;
      }
    }

    const grandTotalHours = requiredHours + optionalHours;
    const grandTotalCost = requiredCost + optionalCost;

    // ★ hourlyRates と projectType が存在することを再度確認
    if (!hourlyRates || !projectType) {
      console.error(
        `[EXEC:${executionId}] Missing hourlyRates or projectType when trying to get used rate.`
      );
      throw new Error(
        'コスト計算に必要な時間単価またはプロジェクトタイプが見つかりません。'
      );
    }
    const usedHourlyRate = hourlyRates[projectType];
    if (usedHourlyRate === undefined || usedHourlyRate === null) {
      console.error(
        `[EXEC:${executionId}] Missing specific hourly rate for project type: ${projectType}`
      );
      throw new Error(
        `プロジェクトタイプ「${projectType}」の時間単価が見つかりません。`
      );
    }

    // ★ FinalEstimateSchema に合うようにオブジェクトを構築
    const estimateForValidation = {
      requiredHours,
      requiredCost,
      optionalHours,
      optionalCost,
      grandTotalHours,
      grandTotalCost,
      usedHourlyRate,
      // ★ breakdown のスキーマも確認して正しくマッピング
      breakdown: featuresWithCost.map((feature: FeatureWithCostForAction) => ({
        category: feature.category,
        feature: feature.feature,
        description: feature.description,
        isNecessary: feature.isNecessary,
        reason: feature.reason,
        estimatedHours: feature.estimatedHours,
        estimationBasis: feature.estimationBasis,
        cost: feature.cost,
      })),
      runId: result.runId, // runId も含める
    };

    // ★ 整形したデータでバリデーション
    const validatedEstimate = FinalEstimateSchema.safeParse(
      estimateForValidation
    );

    if (!validatedEstimate.success) {
      console.error(
        `[EXEC:${executionId}] Result validation failed:`,
        validatedEstimate.error
      );
      throw new Error('見積もり結果のフォーマットが不正です。');
    }

    console.log(`[EXEC:${executionId}] Result validation successful`);

    // 検証済みの結果を返す
    return {
      success: true,
      runId: result.runId,
      result: validatedEstimate.data,
      message: '見積もり計算が完了しました。',
    };
  } catch (error) {
    console.error(
      `[EXEC:${executionId}] Error executing estimation workflow:`,
      error
    );
    throw new Error(
      `見積もり計算中にエラーが発生しました: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
