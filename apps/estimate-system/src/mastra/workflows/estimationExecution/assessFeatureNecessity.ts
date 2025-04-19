import { google } from '@ai-sdk/google';
import { Step } from '@mastra/core/workflows';
import { z } from 'zod';

// 前のステップ (generateFeatures) の出力型をインポート (必要に応じてパスを調整)
import type { Feature } from './generateFeatures'; // Feature は { category, feature, description } を持つ

const llm = google('gemini-2.0-flash');

// 必要性判断結果の構造を定義する Zod スキーマ
const AssessedFeatureSchema = z.object({
  // generateFeatures から引き継ぐ情報
  category: z.string().describe('機能カテゴリ'),
  description: z.string().describe('機能の簡単な説明'),
  // assessFeatureNecessity で判断する情報
  feature: z.string().describe('評価対象の機能名'),
  isNecessary: z.boolean().describe('機能が必要不可欠かどうか (true/false)'),
  reason: z.string().describe('必要性判断の理由'),
});
export type AssessedFeature = z.infer<typeof AssessedFeatureSchema>;

// Step 4: 機能必要性判断
export const assessFeatureNecessity = new Step({
  id: 'assessFeatureNecessity',
  inputSchema: z.object({
    // generateFeatures の出力スキーマと一致させる
    generatedFeatures: z
      .array(
        // Feature 型のスキーマと一致させる
        z.object({
          category: z.string(),
          feature: z.string(),
          description: z.string(),
        })
      )
      .describe('generateFeatures ステップで生成された機能候補リスト'),
  }),
  outputSchema: z.object({
    assessedFeatures: z
      .array(AssessedFeatureSchema) // 更新された AssessedFeatureSchema を使用
      .describe('必要性が判断された機能リスト (カテゴリと説明も含む)'),
  }),
  execute: async ({
    context,
  }): Promise<{ assessedFeatures: AssessedFeature[] }> => {
    try {
      // --- 重複実行のチェックと状態ログ ---
      const contextState = {
        hasGenerateFeaturesOutput: !!context.getStepResult('generateFeatures'),
        hasAssessFeatureNecessityOutput: !!context.getStepResult(
          'assessFeatureNecessity'
        ),
        hasEstimateEffortOutput: !!context.getStepResult('estimateEffort'),
        hasCalculateCostOutput: !!context.getStepResult('calculateCost'),
      };

      // すでに実行済みの場合は早期リターン（重複防止）
      if (contextState.hasAssessFeatureNecessityOutput) {
        const existingResult = context.getStepResult(
          'assessFeatureNecessity'
        ) as { assessedFeatures: AssessedFeature[] };
        return existingResult;
      }

      // 入力チェック
      const triggerData = context.triggerData;
      const generateFeaturesResult = context.getStepResult(
        'generateFeatures'
        // 型アサーションも Feature[] を期待するようにする
      ) as { generatedFeatures: Feature[] } | undefined;

      if (
        !triggerData ||
        typeof triggerData.userInput !== 'string' ||
        typeof triggerData.projectType !== 'string'
      ) {
        const error = new Error(
          'Invalid trigger data for assessFeatureNecessity.'
        );
        throw error;
      }

      if (!generateFeaturesResult) {
        const error = new Error('Missing result from generateFeatures step.');
        throw error;
      }

      const userInput = triggerData.userInput;
      const projectType = triggerData.projectType;
      // featuresToAssess は Feature[] 型になる
      const featuresToAssess = generateFeaturesResult.generatedFeatures;

      // 機能リストが空の場合は早期リターン
      if (featuresToAssess.length === 0) {
        return { assessedFeatures: [] };
      }

      // 機能リストをプロンプト用に整形
      const featuresText = featuresToAssess
        .map(
          (f, index) =>
            `${index + 1}. 機能名: ${f.feature}\nカテゴリ: ${f.category}\n説明: ${f.description}`
        )
        .join('\n\n');

      // プロンプトを修正して、全機能の評価を一度に依頼する
      const prompt = `
あなたはソフトウェア開発の要件定義を行う専門家です。

# ユーザーの初期要件:
${userInput}

# 対象システムタイプ:
${projectType}

# 検討中の機能リスト:
${featuresText}

# 指示:
上記のユーザー要件とシステムタイプに対して、リストにある**各機能**が**本当に必要不可欠 (Must Have) かどうか**を判断し、その理由を簡潔に述べてください。
結果を以下のJSON配列形式で出力してください。リストの各要素が1つの機能に対応します。他のテキストは含めないでください。

\`\`\`json
[
  {
    "feature": "機能名1", // リストの機能名を正確に記載
    "isNecessary": true, // 必要不可欠なら true, そうでなければ false
    "reason": "判断理由1"
  },
  {
    "feature": "機能名2",
    "isNecessary": false,
    "reason": "判断理由2"
  }
  // ... リストの全機能について繰り返す
]
\`\`\`

# 出力JSON:
`;

      // assessedResultsFromLLM は { feature, isNecessary, reason } のリストになる想定
      let assessedResultsFromLLM: {
        feature: string;
        isNecessary: boolean;
        reason: string;
      }[] = [];

      try {
        // API呼び出しを1回にまとめる
        const startTime = Date.now();
        const completion = await llm.doGenerate({
          prompt: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
          mode: { type: 'regular' },
          inputFormat: 'messages',
        });
        const endTime = Date.now();

        // 結果をパース (JSON配列を期待)
        let jsonText: string | null | undefined = null;

        // 1. マークダウンコードブロックからの抽出を試みる (前後の空白や改行に少し寛容に)
        const markdownMatch = completion.text?.match(
          /```json\s*\n?([\s\S]*?)\n?```/
        );
        if (markdownMatch?.[1]) {
          jsonText = markdownMatch[1].trim(); // 抽出後にトリム
        }

        // 2. マークダウンがダメなら、テキスト全体がJSON配列かどうかを試みる (前後の空白を許容)
        if (!jsonText) {
          const rawJsonMatch = completion.text?.trim().match(/^(\[[\s\S]*\])$/);
          if (rawJsonMatch?.[1]) {
            jsonText = rawJsonMatch[1];
          }
        }

        if (jsonText) {
          try {
            const parsedJson = JSON.parse(jsonText);
            // ★ LLMの出力スキーマ (feature, isNecessary, reason のみを持つ) で検証する
            const llmOutputSchema = z.array(
              z.object({
                feature: z.string(),
                isNecessary: z.boolean(),
                reason: z.string(),
              })
            );
            const validationResult = llmOutputSchema.safeParse(parsedJson);

            if (validationResult.success) {
              assessedResultsFromLLM = validationResult.data;
              // ★ ログ追加: スキーマ検証成功 (LLM出力に対して)
              console.log(
                '[assessFeatureNecessity] LLM output schema validation successful.'
              );

              // 元の機能リストと結果の機能名が一致するか簡単なチェック (任意)
              if (assessedResultsFromLLM.length !== featuresToAssess.length) {
                console.warn(
                  `Assess necessity: Feature count mismatch! Expected ${featuresToAssess.length}, Got ${assessedResultsFromLLM.length}.`
                );
                // TODO: ここで不一致の場合のハンドリングを検討 (エラーにするか、部分的な結果を使うかなど)
              }
            } else {
              // ★ ログ追加: スキーマ検証失敗 (LLM出力に対して)
              console.error(
                '[assessFeatureNecessity] LLM output schema validation failed:',
                validationResult.error.message
              );
              throw new Error(
                `LLM response JSON structure does not match expected schema (feature, isNecessary, reason). Reason: ${validationResult.error.message}`
              );
            }
          } catch (parseError) {
            throw new Error('Failed to parse the JSON response from LLM.');
          }
        } else {
          throw new Error('Could not find valid JSON array in LLM response.');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error(
          `Failed to assess features due to an error: ${errorMessage}`
        );
      }

      // --- ★ LLMの結果と元の機能情報 (category, description) をマージ ---
      const finalAssessedFeatures: AssessedFeature[] = [];
      const originalFeaturesMap = new Map(
        featuresToAssess.map((f) => [f.feature, f]) // feature名をキーにする
      );

      for (const llmResult of assessedResultsFromLLM) {
        const originalFeature = originalFeaturesMap.get(llmResult.feature);
        if (originalFeature) {
          finalAssessedFeatures.push({
            feature: llmResult.feature, // LLMの結果を使う (大文字小文字の違いなど吸収のため)
            category: originalFeature.category, // 元の情報を引き継ぐ
            description: originalFeature.description, // 元の情報を引き継ぐ
            isNecessary: llmResult.isNecessary, // LLMの結果
            reason: llmResult.reason, // LLMの結果
          });
        } else {
          console.warn(
            `Assess necessity: LLM returned feature "${llmResult.feature}" which was not in the original list. Skipping.`
          );
          // 元リストにない機能が返ってきた場合の処理 (今回はスキップ)
        }
      }

      // ★ ログ追加: 成功
      console.log('[assessFeatureNecessity] Step completed successfully.');
      return { assessedFeatures: finalAssessedFeatures }; // マージした結果を返す
    } catch (error) {
      console.error('Error in assessFeatureNecessity:', error);
      throw error;
    }
  },
});
