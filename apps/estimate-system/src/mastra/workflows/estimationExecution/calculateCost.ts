import { Step } from '@mastra/core/workflows';
import { z } from 'zod';

// estimateEffort から EstimatedFeature 型をインポート
import {
  type EstimatedFeature,
  EstimatedFeatureSchema,
} from './estimateEffort';
// index.ts から HourlyRatesSchema と ProjectTypeSchema をインポート (またはここで定義)
import type { HourlyRatesSchema, ProjectTypeSchema } from '../index'; // パス注意

// コスト計算結果を含む機能データの構造を定義する Zod スキーマ
const FeatureWithCostSchema = z
  .object({})
  .merge(EstimatedFeatureSchema) // EstimatedFeature の全フィールドを継承
  .extend({
    cost: z.number().nonnegative().describe('見積もりコスト (時間単価 * 工数)'),
  });
export type FeatureWithCost = z.infer<typeof FeatureWithCostSchema>;

// Step 6: コスト計算
export const calculateCost = new Step({
  id: 'calculateCost',
  inputSchema: z.object({
    // estimateEffort の出力スキーマと一致させる
    estimatedFeatures: z
      .array(EstimatedFeatureSchema) // EstimatedFeature は全情報を持っているはず
      .describe('estimateEffort ステップで工数が見積もられた機能リスト'),
  }),
  outputSchema: z.object({
    featuresWithCost: z
      .array(FeatureWithCostSchema)
      .describe('コストが計算された最終的な機能リスト'),
  }),
  execute: async ({
    context,
  }): Promise<{ featuresWithCost: FeatureWithCost[] }> => {
    try {
      // --- 重複実行のチェック ---
      const contextState = {
        // ... 他のステップの出力チェックも必要に応じて追加 ...
        hasCalculateCostOutput: !!context.getStepResult('calculateCost'),
      };

      if (contextState.hasCalculateCostOutput) {
        const existingResult = context.getStepResult('calculateCost') as {
          featuresWithCost: FeatureWithCost[];
        };
        return existingResult;
      }

      // --- 入力取得と検証 ---
      const effortResult = context.getStepResult('estimateEffort') as
        | { estimatedFeatures: EstimatedFeature[] }
        | undefined;
      // ★★★ triggerData の型アサーションを index.ts の schema に合わせる ★★★
      const triggerData = context.triggerData as
        | {
            projectType?: z.infer<typeof ProjectTypeSchema>;
            hourlyRates?: z.infer<typeof HourlyRatesSchema>;
            // 他のフィールドもあるかもしれないが、ここでは必要なものだけ記述
            [key: string]: unknown; // any を unknown に変更
          }
        | undefined;

      if (!effortResult) {
        throw new Error('Missing result from estimateEffort step.');
      }

      // ★ projectType と hourlyRates の存在チェックを強化
      if (!triggerData) {
        throw new Error('Missing trigger data for calculateCost.');
      }
      if (!triggerData.projectType) {
        throw new Error(
          'Missing projectType in trigger data for calculateCost.'
        );
      }
      if (!triggerData.hourlyRates) {
        throw new Error(
          'Missing hourlyRates in trigger data for calculateCost.'
        );
      }

      const estimatedFeatures = effortResult.estimatedFeatures;
      const projectType = triggerData.projectType;
      const hourlyRates = triggerData.hourlyRates;

      // ★ プロジェクトタイプに対応する時間単価を取得し、存在と正数をチェック
      const rate = hourlyRates[projectType];
      if (rate === undefined || rate === null || rate <= 0) {
        throw new Error(
          `Invalid or missing hourly rate for project type "${projectType}". Rate must be a positive number. Received: ${rate}`
        );
      }

      // --- コスト計算 ---
      const featuresWithCost: FeatureWithCost[] = estimatedFeatures.map(
        (feature: EstimatedFeature) => {
          // feature に型を指定
          const calculatedCost = feature.estimatedHours * rate;
          return {
            ...feature, // 元の情報をすべてコピー
            cost: calculatedCost, // 計算したコストを追加
          };
        }
      );

      // ★ ログ追加: 最終的な計算結果
      console.log(
        '[calculateCost] Calculated Features with Cost:',
        JSON.stringify({ featuresWithCost }, null, 2)
      );
      return { featuresWithCost };
    } catch (error) {
      console.error('Error in calculateCost step:', error);
      throw error; // エラーを再スローしてワークフローに伝える
    }
  },
});
