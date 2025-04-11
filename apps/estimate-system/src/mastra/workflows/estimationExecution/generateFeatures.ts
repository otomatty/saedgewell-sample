import { google } from '@ai-sdk/google';
import { Step } from '@mastra/core/workflows';
import { z } from 'zod';
import type { ProjectTemplateWithSimilaritySchema } from '../questionGeneration/analyzeRequirements';
import type { FollowUpQuestionSchema } from '../questionGeneration/generateFollowUpQuestions';
import type { HourlyRatesSchema, AnswerSchema } from '../index';

const llm = google('gemini-2.0-flash');

// 機能の構造を定義する Zod スキーマ
const FeatureSchema = z.object({
  category: z.string().describe('機能カテゴリ (例: ユーザー管理, データ入力)'),
  feature: z.string().describe('機能名'),
  description: z.string().describe('機能の簡単な説明'),
});

// ZodスキーマからTypeScriptの型を推論
// Feature 型をエクスポートする
export type Feature = z.infer<typeof FeatureSchema>;

// Step 3: 機能リスト生成
export const generateFeatures = new Step({
  id: 'generateFeatures',
  // 出力スキーマを更新
  outputSchema: z.object({
    generatedFeatures: z
      .array(FeatureSchema) // FeatureSchema の配列として定義
      .describe('AIによってカテゴリ分類・絞り込みされた機能候補のリスト'),
  }),
  // execute 関数の戻り値の型を明示的に指定
  execute: async ({ context }): Promise<{ generatedFeatures: Feature[] }> => {
    try {
      // --- 重複実行のチェックを追加 ---
      const contextState = {
        hasGenerateFeaturesOutput: !!context.getStepResult('generateFeatures'),
        hasAssessFeatureNecessityOutput: !!context.getStepResult(
          'assessFeatureNecessity'
        ),
        hasEstimateEffortOutput: !!context.getStepResult('estimateEffort'),
        hasCalculateCostOutput: !!context.getStepResult('calculateCost'),
      };

      // すでに生成済みの場合は早期リターン（重複防止）
      if (contextState.hasGenerateFeaturesOutput) {
        const existingResult = context.getStepResult('generateFeatures') as {
          generatedFeatures: Feature[];
        };
        return existingResult;
      }

      // ★ context.triggerData を workflow の triggerSchema に合わせてキャスト
      //    (index.ts の estimationExecutionWorkflow.triggerSchema と同じ構造を期待)
      const triggerData = context.triggerData as {
        userInput: string;
        projectType?: 'website' | 'business_system' | 'application' | 'other';
        hourlyRates?: z.infer<typeof HourlyRatesSchema>;
        similarProjects: z.infer<typeof ProjectTemplateWithSimilaritySchema>[];
        followUpQuestions: z.infer<typeof FollowUpQuestionSchema>[];
        answers: z.infer<typeof AnswerSchema>[];
      };

      // ★ データを変数に展開
      const {
        userInput,
        projectType, // optional なので undefined の可能性あり
        similarProjects,
        followUpQuestions,
        answers, // ★ これは isAnswered, skipped を含む全回答リスト
      } = triggerData;

      // ★ projectType が undefined の場合のフォールバック
      const projectTypeForPrompt = projectType ?? '指定なし';

      // ★ 類似プロジェクト情報を整形 (変更なし)
      const similarProjectsInfo = similarProjects
        .map(
          (p) =>
            `- Project Name: ${p.name}, Category: ${p.category_id}, Description: ${p.description || 'N/A'}`
        )
        .join('\n');

      // ★★★ 追加: isAnswered が true の回答のみをフィルタリング ★★★
      const answeredOnly = answers.filter(
        (answer) => answer.isAnswered === true
      );

      // ★ 追加質問と回答を整形 (フィルタリングされた answeredOnly を使用)
      const qaMap = new Map(answeredOnly.map((a) => [a.questionId, a.answer])); // answeredOnly を使用
      const questionsAndAnswersInfo = followUpQuestions
        .map((q) => {
          // answeredOnly に回答があるかチェック
          if (qaMap.has(q.questionId)) {
            const answer = qaMap.get(q.questionId);
            const answerText =
              answer !== null && answer !== undefined
                ? JSON.stringify(answer)
                : '(空の回答)'; // null/undefinedチェック
            return `- Q: ${q.questionText}\n  A: ${answerText}`;
          }
          // isAnswered=true の回答がない場合はプロンプトに含めない
          return null;
        })
        .filter((info) => info !== null) // null を除去
        .join('\n');

      // ★ ペルソナ決定ロジック (projectType が undefined の場合を考慮)
      let persona = 'ソフトウェア開発の専門家';
      if (projectType) {
        switch (projectType.toLowerCase()) {
          case 'website':
            persona = 'Webサイト構築の専門家';
            break;
          case 'business_system':
            persona = '業務システム開発の専門家';
            break;
          case 'application':
            persona = 'モバイルアプリケーション開発の専門家';
            break;
        }
      }

      // ★ プロンプトを大幅に改善 (ユーザー回答を反映)
      const prompt = `\nあなたは ${persona} です。\n以下のユーザーからの初期要件、追加質問への回答、および類似プロジェクト情報を総合的に判断し、\n開発に必要な機能の候補リストをより具体的に、過不足なく洗い出してください。\n\n# ユーザーの初期要件:\n${userInput}\n\n# 対象システムタイプ:\n${projectTypeForPrompt}\n\n# 追加質問とユーザーの回答:\n${questionsAndAnswersInfo.length > 0 ? questionsAndAnswersInfo : '(なし)'}\n\n# 類似プロジェクトの概要:\n${similarProjectsInfo.length > 0 ? similarProjectsInfo : '(なし)'}\n\n# 指示:\n1. 上記の **すべての情報** (特にユーザーの回答) を考慮し、開発に必要な機能を具体的にリストアップしてください。ユーザーの回答によって不要になった機能や、新たに追加すべき機能があれば反映してください。\n2. 機能候補を「ユーザー管理」「データ入力/操作」「表示/UI」「レポート/分析」「外部連携」「認証/セキュリティ」「パフォーマンス/インフラ」「その他」などの ${projectTypeForPrompt} に適したカテゴリに分類してください。\n3. 各カテゴリ内で、特に重要と思われる機能を **5~15個程度** に絞り込んでください (ユーザー回答で詳細が分かった分、少し増やしても良い)。重要度は ${projectTypeForPrompt} の特性とユーザーの回答内容を考慮してください。\n4. 各機能について、簡単な説明（1文程度）を加えてください。\n5. 結果を以下のJSON形式で出力してください。他のテキストは含めないでください。\n\n\`\`\`json\n[\n  {\n    \"category\": \"カテゴリ名\",\n    \"feature\": \"機能名\",\n    \"description\": \"機能の簡単な説明\"\n  },\n  // ... 他の機能\n]\n\`\`\`\n\n# 出力JSON:\n`;

      // ★ LLM 呼び出しとレスポンス処理 (大きな変更はないが、エラーハンドリングは堅牢に)
      let generatedFeatures: Feature[] = [];
      try {
        const { text: completion } = await llm.doGenerate({
          prompt: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
          mode: { type: 'object-json' },
          inputFormat: 'messages',
        });

        let jsonText = '';
        if (completion) {
          jsonText = completion.trim();
        } else {
          throw new Error('LLM did not return any text content.');
        }

        if (jsonText) {
          const parsedJson = JSON.parse(jsonText);
          const validationResult = z.array(FeatureSchema).safeParse(parsedJson);
          if (validationResult.success) {
            generatedFeatures = validationResult.data;
            // ★ ログ追加: スキーマ検証成功
            console.log(
              '[generateFeatures] Output schema validation successful.'
            );
          } else {
            // ★ ログ追加: スキーマ検証失敗
            console.error(
              '[generateFeatures] Output schema validation failed:',
              validationResult.error.message
            );
            throw new Error(
              `Generated JSON does not match the expected schema. Reason: ${validationResult.error.message}`
            );
          }
        } else {
          throw new Error('LLM did not return valid JSON content.');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error(
          `Failed to process LLM response for feature generation: ${errorMessage}`
        );
      }

      // ★ ログ追加: 成功
      console.log('[generateFeatures] Step completed successfully.');
      return { generatedFeatures };
    } catch (error) {
      console.error('Error in generateFeatures:', error);
      throw error;
    }
  },
});
