import { Workflow } from '@mastra/core/workflows';
import { z } from 'zod';

// --- 共通で使うスキーマ ---
export const ProjectTypeSchema = z.union([
  z.literal('website'),
  z.literal('business_system'),
  z.literal('application'),
  z.literal('other'),
]);

export const HourlyRatesSchema = z
  .object({
    website: z.number().positive().optional(),
    business_system: z.number().positive().optional(),
    application: z.number().positive().optional(),
    other: z.number().positive().optional(),
  })
  .optional();

// --- ステップのインポート ---
import {
  analyzeRequirements,
  ProjectTemplateWithSimilaritySchema,
} from './questionGeneration/analyzeRequirements';
import {
  generateFollowUpQuestions,
  FollowUpQuestionSchema,
} from './questionGeneration/generateFollowUpQuestions';
import { generateFeatures } from './estimationExecution/generateFeatures';
import { assessFeatureNecessity } from './estimationExecution/assessFeatureNecessity';
import { estimateEffort } from './estimationExecution/estimateEffort';
import { calculateCost } from './estimationExecution/calculateCost';

// --- 1. 質問生成ワークフロー ---
export const questionGenerationWorkflow = new Workflow({
  name: 'question-generation-workflow',
  triggerSchema: z.object({
    userInput: z.string().describe('ユーザーが最初に入力するプロジェクト概要'),
    projectType: z.string().describe('プロジェクト種別'),
    hourlyRates: HourlyRatesSchema.describe('役割ごとの時間単価'),
  }),
});

questionGenerationWorkflow
  .step(analyzeRequirements)
  .then(generateFollowUpQuestions);

questionGenerationWorkflow.commit();

// --- 2. 見積もり実行ワークフロー ---

// ★ ユーザー回答のスキーマ定義を修正
export const AnswerSchema = z.object({
  questionId: z.string().uuid().describe('対応する質問のID'),
  answer: z
    .union([
      z.string().describe('テキスト回答、単一選択肢の選択値'),
      z.array(z.string()).describe('複数選択肢の選択値リスト'),
      z.number().describe('数値回答'),
    ])
    .nullable() // ★ 未回答・スキップの場合があるので nullable に変更
    .describe(
      '質問タイプに応じたユーザーの回答 (型は union)。未回答またはスキップの場合は null。'
    ),
  isAnswered: z.boolean().describe('ユーザーがこの質問に回答したかどうか'),
  skipped: z
    .boolean()
    .describe('ユーザーが明示的にこの質問をスキップしたかどうか'),
});

export const estimationExecutionWorkflow = new Workflow({
  name: 'estimation-execution-workflow',
  triggerSchema: z.object({
    userInput: z.string(),
    projectType: ProjectTypeSchema.optional(),
    hourlyRates: HourlyRatesSchema,
    similarProjects: z.array(ProjectTemplateWithSimilaritySchema),
    followUpQuestions: z.array(FollowUpQuestionSchema),
    // ★ 修正した AnswerSchema を使うように変更
    answers: z
      .array(AnswerSchema)
      .describe(
        'ユーザーが入力した追加質問への回答リスト（未回答・スキップ情報を含む）'
      ),
  }),
});

estimationExecutionWorkflow
  .step(generateFeatures)
  .then(assessFeatureNecessity)
  .then(estimateEffort)
  .then(calculateCost);

estimationExecutionWorkflow.commit();
