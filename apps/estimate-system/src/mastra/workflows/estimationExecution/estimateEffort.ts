import { google } from '@ai-sdk/google';
import { Step } from '@mastra/core/workflows';
import { z } from 'zod';

// assessFeatureNecessity から AssessedFeature 型をインポート
import type { AssessedFeature } from './assessFeatureNecessity';

const llm = google('gemini-2.0-flash');

// 工数見積もり結果の構造を定義する Zod スキーマ
// ★ 前のステップからの情報をすべて含めるように拡張
export const EstimatedFeatureSchema = z.object({
  // generateFeatures からの情報
  category: z.string().describe('機能カテゴリ'),
  description: z.string().describe('機能の簡単な説明'),
  // assessFeatureNecessity で判断された情報
  feature: z.string().describe('機能名'),
  isNecessary: z.boolean().describe('機能が必要不可欠かどうか'),
  reason: z.string().describe('必要性判断の理由'),
  // estimateEffort で見積もる情報
  estimatedHours: z.number().positive().describe('見積もり工数 (人時)'),
  estimationBasis: z.string().describe('工数見積もりの簡単な根拠'),
});
export type EstimatedFeature = z.infer<typeof EstimatedFeatureSchema>;

// Step 5: 工数見積もり
export const estimateEffort = new Step({
  id: 'estimateEffort',
  inputSchema: z.object({
    // ★ assessFeatureNecessity の出力スキーマ (拡張版) と一致させる
    assessedFeatures: z
      .array(
        z.object({
          // AssessedFeatureSchema のフィールドをすべて含める
          category: z.string(),
          description: z.string(),
          feature: z.string(),
          isNecessary: z.boolean(),
          reason: z.string(),
        })
      )
      .describe(
        'assessFeatureNecessity ステップで必要性・カテゴリ・説明が判断/引き継がれた機能リスト'
      ),
  }),
  outputSchema: z.object({
    // ★ 拡張された EstimatedFeatureSchema の配列を返すようにする
    estimatedFeatures: z
      .array(EstimatedFeatureSchema)
      .describe('工数が見積もられ、全ステップの情報が含まれた機能リスト'),
  }),
  execute: async ({
    context,
    // ★ 戻り値の型も EstimatedFeature[] に変更
  }): Promise<{ estimatedFeatures: EstimatedFeature[] }> => {
    try {
      // --- 重複実行のチェック ---
      const contextState = {
        // ... 他のステップの出力チェックも必要に応じて追加 ...
        hasEstimateEffortOutput: !!context.getStepResult('estimateEffort'),
      };

      if (contextState.hasEstimateEffortOutput) {
        const existingResult = context.getStepResult('estimateEffort') as {
          estimatedFeatures: EstimatedFeature[];
        };
        return existingResult;
      }

      // --- 入力取得と検証 ---
      // ★ 型アサーションを更新された AssessedFeature[] に合わせる
      const assessResult = context.getStepResult('assessFeatureNecessity') as
        | { assessedFeatures: AssessedFeature[] } // AssessedFeature は拡張されたもの
        | undefined;
      const triggerData = context.triggerData; // プロジェクトタイプなどを取得するため

      if (!assessResult) {
        throw new Error('Missing result from assessFeatureNecessity step.');
      }
      if (
        !triggerData ||
        typeof triggerData.userInput !== 'string' ||
        typeof triggerData.projectType !== 'string'
      ) {
        throw new Error(
          'Invalid or missing trigger data (userInput, projectType) for estimateEffort.'
        );
      }

      const userInput = triggerData.userInput;
      const projectType = triggerData.projectType;
      // ★ assessedFeatures は拡張された AssessedFeature[] 型
      const assessedFeatures = assessResult.assessedFeatures;

      // ★ フィルタリングはしない（前回の修正通り）
      const featuresToEstimate = assessedFeatures;

      if (featuresToEstimate.length === 0) {
        return { estimatedFeatures: [] };
      }

      // --- プロンプト作成 (変更なし、必要性情報はすでに含まれている) ---
      const featuresToEstimateText = featuresToEstimate
        .map(
          (f, index) =>
            `${index + 1}. 機能名: ${f.feature}\n   カテゴリ: ${f.category}\n   説明: ${f.description}\n   必要性: ${f.isNecessary ? '必要' : '不要'}\n   判断理由: ${f.reason}` // カテゴリと説明も追加
        )
        .join('\n\n');

      const prompt = `
あなたは経験豊富なソフトウェア開発のプロジェクトマネージャーまたはテックリードです。

# ユーザーの初期要件概要:
${userInput}

# 対象システムタイプ:
${projectType}

# 工数見積もり対象の機能リスト (カテゴリ、説明、必要性判断結果を含む):
${featuresToEstimateText}

# 指示:
上記のユーザー要件、システムタイプ、機能カテゴリ、説明、必要性判断結果を**すべて考慮**し、リストにある**各機能**について、**もしその機能を実装するとした場合の開発工数 (人時)** を見積もり、その簡単な根拠を述べてください。
**重要:** 機能リストにある「必要性」の項目（必要/不要）は参考情報に留め、**たとえ「不要」と判断された機能であっても、実装した場合に必要となるであろう現実的な工数（必ず0より大きい値）** を見積もってください。0時間は認めません。
システムタイプ (${projectType}) の特性を踏まえた、現実的な見積もりをお願いします。
結果を以下のJSON配列形式で出力してください。リストの各要素が1つの機能に対応します。feature, estimatedHours, estimationBasis フィールドのみを含めてください。他のテキストは含めないでください。

\`\`\`json
[
  {
    "feature": "機能名1 (例えば不要と判断された機能)",
    "estimatedHours": 4,  // ← 不要でも実装した場合の工数 (0ではない！)
    "estimationBasis": "基本的なUIと状態管理の実装 (ただし現時点では不要)"
  },
  {
    "feature": "機能名2 (必要と判断された機能)",
    "estimatedHours": 20,
    "estimationBasis": "外部API連携と複雑なデータ処理を含むため (必須機能)"
  }
  // ... リストの全機能について繰り返す
]
\`\`\`

# 出力JSON:
`;

      // --- LLM 呼び出しとレスポンス処理 ---
      // ★ LLM の出力は { feature, estimatedHours, estimationBasis } のリストを期待する
      let effortResultsFromLLM: {
        feature: string;
        estimatedHours: number;
        estimationBasis: string;
      }[] = [];
      try {
        const completion = await llm.doGenerate({
          prompt: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
          mode: { type: 'object-json' },
          inputFormat: 'messages',
        });

        let jsonText = '';
        if (completion.text) {
          jsonText = completion.text.trim();
          const markdownMatch = jsonText.match(/```json\s*\n?([\s\S]*?)\n?```/);
          if (markdownMatch?.[1]) {
            jsonText = markdownMatch[1].trim();
          }
        } else {
          throw new Error('LLM did not return any text content.');
        }

        if (jsonText) {
          const parsedJson = JSON.parse(jsonText);
          // ★ LLM の出力スキーマ (feature, estimatedHours, estimationBasis のみ) で検証
          const llmEffortSchema = z.array(
            z.object({
              feature: z.string(),
              estimatedHours: z.number().positive(),
              estimationBasis: z.string(),
            })
          );
          const validationResult = llmEffortSchema.safeParse(parsedJson);

          if (validationResult.success) {
            effortResultsFromLLM = validationResult.data;

            // 機能数チェック (変更なし)
            if (effortResultsFromLLM.length !== featuresToEstimate.length) {
              console.warn(
                `Effort estimation: Feature count mismatch! Expected ${featuresToEstimate.length}, Got ${effortResultsFromLLM.length}. Using LLM result anyway.`
              );
            }
          } else {
            console.error(
              'Effort estimation validation failed:',
              validationResult.error.format()
            );
            console.error('Invalid JSON received for effort:', jsonText);
            throw new Error(
              `LLM response JSON structure for effort does not match expected schema. Reason: ${validationResult.error.message}`
            );
          }
        } else {
          throw new Error(
            'Could not extract valid JSON for effort from LLM response.'
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error(
          `Failed to estimate effort due to an LLM error: ${errorMessage}`
        );
      }

      // --- ★ LLMの見積もり結果と、前のステップまでの情報をマージ ---
      const finalEstimatedFeatures: EstimatedFeature[] = [];
      const assessedFeaturesMap = new Map(
        featuresToEstimate.map((f) => [f.feature, f]) // feature 名をキーにする
      );

      for (const llmResult of effortResultsFromLLM) {
        const originalAssessedFeature = assessedFeaturesMap.get(
          llmResult.feature
        );
        if (originalAssessedFeature) {
          finalEstimatedFeatures.push({
            // assessFeatureNecessity から引き継いだ情報
            category: originalAssessedFeature.category,
            description: originalAssessedFeature.description,
            feature: llmResult.feature, // LLMの結果を使う (大文字小文字の違いなど吸収のため)
            isNecessary: originalAssessedFeature.isNecessary,
            reason: originalAssessedFeature.reason,
            // estimateEffort で見積もった情報
            estimatedHours: llmResult.estimatedHours,
            estimationBasis: llmResult.estimationBasis,
          });
        } else {
          console.warn(
            `Effort estimation: LLM returned effort for feature "${llmResult.feature}" which was not in the assessed list. Skipping.`
          );
          // 元リストにない機能が返ってきた場合の処理 (今回はスキップ)
        }
      }

      // ★ ログ追加: 最終的な見積もり結果
      console.log(
        '[estimateEffort] Returning Estimated Features:',
        JSON.stringify({ estimatedFeatures: finalEstimatedFeatures }, null, 2)
      );
      // return { estimatedFeatures }; // 古い返し方
      // ★ ログ追加: 成功
      console.log('[estimateEffort] Step completed successfully.');
      return { estimatedFeatures: finalEstimatedFeatures }; // マージした結果を返す
    } catch (error) {
      console.error('Error in estimateEffort step:', error);
      throw error; // エラーを再スローしてワークフローに伝える
    }
  },
});
