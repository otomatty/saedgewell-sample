import { atom } from 'jotai';
import { z } from 'zod';
import type {
  EstimateFormData,
  AIQuestion,
  FeatureProposal,
  Deadline,
  ProjectType,
} from '../types/estimate';
import type { StepId } from '../app/services/estimate/_components/estimate-form';

// フォームの現在のステップ
export const currentStepAtom = atom<StepId>('project-type');

// フォームデータ
export const formDataAtom = atom<EstimateFormData>({
  projectType: 'website',
  description: '',
  deadline: 'flexible',
  features: [],
  baseCost: 0,
  rushFee: 0,
  totalCost: 0,
});

// AIからの追加質問
export const aiQuestionsAtom = atom<AIQuestion[]>([]);

// AI質問への回答
export const aiAnswersAtom = atom<Record<string, string | string[] | number>>(
  {}
);

// ワークフロー結果関連のZodスキーマ（calculationCost.tsのスキーマをもとに定義）
export const CostBreakdownSchema = z.object({
  feature: z.string(),
  isNecessary: z.boolean(),
  estimatedHours: z.number(),
  cost: z.number().nullable(),
  estimationBasis: z.string(),
  reason: z.string().nullable(),
});

export const FinalEstimateSchema = z.object({
  requiredHours: z.number().describe('必要と判断された機能の合計工数 (時間)'),
  requiredCost: z.number().describe('必要と判断された機能の合計コスト (円)'),
  optionalHours: z.number().describe('任意と判断された機能の合計工数 (時間)'),
  optionalCost: z.number().describe('任意と判断された機能の合計コスト (円)'),
  grandTotalHours: z.number().describe('全機能の合計工数 (時間)'),
  grandTotalCost: z.number().describe('全機能の合計コスト (円)'),
  usedHourlyRate: z.number().describe('適用された時間単価 (円/時)'),
  breakdown: z
    .array(CostBreakdownSchema)
    .describe('機能ごとの必要性、工数、コストの内訳'),
});

export type CostBreakdown = z.infer<typeof CostBreakdownSchema>;
export type FinalEstimate = z.infer<typeof FinalEstimateSchema>;

// 提案された機能リスト
export const proposedFeaturesAtom = atom<FeatureProposal[]>([]);

// 選択された機能のID
export const selectedFeatureIdsAtom = atom<string[]>([]);

// ★ 実行中のワークフローの Run ID を保持する Atom
export const workflowRunIdAtom = atom<string | null>(null);

// ★ ワークフロー実行結果を保持するAtom
export const workflowResultAtom = atom<FinalEstimate | null>(null);

// ★ 見積もり計算の処理中状態を管理するアトム
export const estimationLoadingAtom = atom<boolean>(false);
