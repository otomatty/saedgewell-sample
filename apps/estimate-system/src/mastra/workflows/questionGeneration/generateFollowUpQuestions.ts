import { Step } from '@mastra/core/workflows';
import { z } from 'zod';
// ★ analyzeRequirements の出力型とスキーマをインポート
import {
  type ProjectTemplateWithSimilarity,
  ProjectTemplateWithSimilaritySchema, // ★ インポートを追加
} from './analyzeRequirements';
// ★ DB検索関数をインポート (パス修正済)
import { findRelevantQuestionTemplates } from '../../../rag/question-search';
// ★ Gemini クライアントをインポート (新しいパス)
import { generativeModel } from '../../../lib/gemini/client';
// ★ crypto をインポート (Node.js 19以降推奨、またはポリフィル)
import crypto from 'node:crypto'; // Node.js v19+ or polyfill needed

// --- このステップの出力スキーマ定義 ---
// ★ question-search.ts で定義されたスキーマと合わせる
export const FollowUpQuestionSchema = z.object({
  questionId: z.string().uuid(),
  questionText: z.string(),
  type: z.string(), // 追加
  options: z.any().nullable(), // 追加 (z.any() に変更)
  validationRules: z.any().nullable(), // 追加 (z.any() に変更)
});

// ★ AIが生成する質問のスキーマ (questionId なし)
export const AiGeneratedQuestionSchema = z.object({
  questionText: z.string(),
  type: z.string(),
  options: z.any().nullable(),
  validationRules: z.any().nullable(),
});

export const generateFollowUpQuestions = new Step({
  id: 'generateFollowUpQuestions',
  inputSchema: z.object({
    similarProjects: z
      .array(ProjectTemplateWithSimilaritySchema) // ★ インポートしたスキーマを使用
      .describe(
        'analyzeRequirements ステップで見つかった類似プロジェクトのリスト'
      ),
  }),
  outputSchema: z.object({
    followUpQuestions: z
      .array(FollowUpQuestionSchema)
      .describe('生成された追加質問のリスト (タイプと選択肢情報を含む)'),
  }),
  execute: async ({
    context,
  }): Promise<{
    followUpQuestions: z.infer<typeof FollowUpQuestionSchema>[];
  }> => {
    console.log('--- Step2: generateFollowUpQuestions ---');

    // --- 入力データの取得と検証 ---
    const triggerData = context.triggerData as
      | { userInput?: string; projectType?: string }
      | undefined;

    // ★ デバッグ用に projectType の値を確認するログを追加
    console.log('Received triggerData:', triggerData);
    console.log(
      'Received projectType in generateFollowUpQuestions:',
      triggerData?.projectType
    );

    const analyzeRequirementsResult = context.getStepResult(
      'analyzeRequirements'
    ) as { similarProjects: ProjectTemplateWithSimilarity[] } | undefined;

    // ★ projectType は optional なので、存在チェックは userInput のみで十分
    if (!triggerData || typeof triggerData.userInput !== 'string') {
      // エラーログを少し詳細に
      console.error(
        'Invalid trigger data:',
        triggerData,
        'Type of userInput:',
        typeof triggerData?.userInput
      );
      throw new Error(
        'Invalid trigger data: userInput is missing or not a string.'
      );
    }
    // ★ projectType が undefined でも許容するように変更
    if (
      !analyzeRequirementsResult ||
      !Array.isArray(analyzeRequirementsResult.similarProjects)
    ) {
      throw new Error(
        'Missing or invalid result from analyzeRequirements step.'
      );
    }

    const userInput = triggerData.userInput;
    const projectType = triggerData.projectType; // undefined の可能性あり

    // ★ projectType が undefined の場合のフォールバックを追加
    const projectTypeForLog = projectType ?? 'not specified';

    const similarProjects = analyzeRequirementsResult.similarProjects;

    let relevantQuestions: z.infer<typeof FollowUpQuestionSchema>[] = [];
    const MAX_QUESTIONS = 10;

    try {
      // 1. カテゴリベースで質問を取得
      const relevantCategoryIdentifier =
        similarProjects[0]?.category_id ?? projectType; // projectType が undefined かもしれない

      if (!relevantCategoryIdentifier) {
        console.warn(
          'Could not determine relevant category or projectType. Skipping DB question search.'
        );
      } else {
        console.log(
          `Searching questions for identifier: ${relevantCategoryIdentifier}`
        );
        try {
          relevantQuestions = await findRelevantQuestionTemplates(
            relevantCategoryIdentifier
          );
          console.log(
            `Found ${relevantQuestions.length} relevant question templates for identifier: ${relevantCategoryIdentifier}.`
          );
        } catch (dbError) {
          console.error(
            `Error fetching questions from DB for identifier ${relevantCategoryIdentifier}:`,
            dbError
          );
          // DBエラーが発生しても AI 生成は試みる
        }
      }

      // --- ★ AIによる追加質問生成ロジック --- //
      const questionsNeeded = MAX_QUESTIONS - relevantQuestions.length;
      if (questionsNeeded > 0 && userInput.trim()) {
        // ユーザー入力がある場合のみ実行
        console.log(
          `Need ${questionsNeeded} more questions. Attempting to generate with AI...`
        );

        const existingQuestionTexts = relevantQuestions
          .map((q) => q.questionText)
          .join('\n - ');
        // ★ 既存の質問情報をより詳細に整形
        const existingQuestionsDetails = relevantQuestions
          .map(
            (q) =>
              `- ${q.questionText} (Type: ${q.type}${q.options ? `, Options: ${JSON.stringify(q.options)}` : ''})`
          )
          .join('\n');

        const prompt = `
          あなたは、ソフトウェア開発プロジェクトの見積もりを行うアシスタントです。
          以下のユーザー入力、プロジェクト種別、および既知の質問を考慮し、
          ユーザーの要求をより深く理解し、**見積もりの精度向上や未発見の機能要件を探るために、他に確認すべき重要な事項**を質問形式で **${questionsNeeded}個** 生成してください。
          特に、ユーザーが明示していないが、プロジェクトの成功に影響しそうな点について質問することを意識してください。

          **ユーザーのプロジェクト概要:**
          ${userInput}

          **プロジェクト種別:**
          ${projectTypeForLog} // ★ undefined の場合の表示を考慮

          **既知の質問 (これらと重複せず、かつこれらを補完・深掘りするような質問を生成してください):**
          ${existingQuestionsDetails.length > 0 ? existingQuestionsDetails : '(なし)'}

          **出力形式:**
          以下のJSON形式の配列で回答してください。各質問オブジェクトには "questionText", "type", "options", "validationRules" を含めてください。
          - "questionText": 具体的な質問文。
          - "type": 質問の形式 ('text', 'textarea', 'select', 'radio', 'checkbox', 'number' など)。適切なものを選択してください。
          - "options": 'select', 'radio', 'checkbox' の場合に選択肢の配列 (例: ["はい", "いいえ"])。それ以外は null。
          - "validationRules": 入力値のバリデーションルール (例: { "required": true, "maxLength": 100 })。不要な場合は null。

          **例:**
          [
            {
              "questionText": "想定される具体的なユーザー層を教えてください。",
              "type": "textarea",
              "options": null,
              "validationRules": { "required": true }
            },
            {
              "questionText": "多言語対応は必要ですか？",
              "type": "radio",
              "options": ["はい", "いいえ"],
              "validationRules": { "required": true }
            }
          ]

          **生成する質問リスト (JSON配列形式):**
        `;

        try {
          console.log('Generating AI questions with prompt...');
          const result = await generativeModel.generateContent(prompt);
          const response = result.response;
          const aiResponseText = response.text();
          console.log('AI Response Text:', aiResponseText);

          // JSONモードでも念のためトリムと簡単なチェック
          const cleanJsonResponse = aiResponseText.trim();
          if (
            cleanJsonResponse.startsWith('[') &&
            cleanJsonResponse.endsWith(']')
          ) {
            const parsedAiQuestions = JSON.parse(cleanJsonResponse);

            // ★ AIの応答を新しいスキーマで検証
            const validationResult = z
              .array(AiGeneratedQuestionSchema) // ★ IDなしのスキーマを使用
              .safeParse(parsedAiQuestions);

            if (validationResult.success) {
              const aiGeneratedQuestions = validationResult.data;
              console.log(
                `Successfully generated and validated ${aiGeneratedQuestions.length} AI questions (before adding ID).`
              );

              // ★ 検証済みの質問に UUID を付与する
              const validatedAiQuestionsWithId: z.infer<
                typeof FollowUpQuestionSchema
              >[] = aiGeneratedQuestions.map((q) => ({
                ...q,
                questionId: crypto.randomUUID(), // ★ ここでUUIDを生成
              }));

              console.log(
                `Added UUIDs to ${validatedAiQuestionsWithId.length} questions.`
              );

              relevantQuestions.push(...validatedAiQuestionsWithId);
              relevantQuestions = relevantQuestions.slice(0, MAX_QUESTIONS);
            } else {
              console.error(
                'AI response validation failed against AiGeneratedQuestionSchema:', // ★ エラーメッセージを更新
                validationResult.error.errors
              );
              console.error(
                'Invalid JSON structure received:',
                cleanJsonResponse
              );
            }
          } else {
            console.error(
              'AI response is not a valid JSON array:',
              aiResponseText
            );
          }
        } catch (aiError) {
          console.error('Error calling AI for question generation:', aiError);
        }
      } else if (questionsNeeded <= 0) {
        console.log(
          `Already have ${relevantQuestions.length} questions. No need for AI generation.`
        );
      } else {
        console.log(
          'Skipping AI question generation because userInput is empty.'
        );
      }
      // --- AIによる追加質問生成ロジック ここまで --- //
    } catch (error) {
      // ステップ全体の try...catch は残す
      console.error('Error during question generation process:', error);
      // エラーの種類に応じてワークフローを停止させるか判断
      // throw error; // 必要ならここで再スロー
    }

    console.log(`Final number of questions: ${relevantQuestions.length}`);
    return {
      followUpQuestions: relevantQuestions,
    };
  },
});
