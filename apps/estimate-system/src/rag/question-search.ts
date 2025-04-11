import { getEstimateAgentAdminClient } from '../lib/supabase/client';
import { z } from 'zod';

// generateFollowUpQuestions.ts で定義したスキーマと一致させる
const FollowUpQuestionSchema = z.object({
  questionId: z.string().uuid(),
  questionText: z.string(),
  type: z.string(),
  options: z.any().nullable(),
  validationRules: z.any().nullable(),
});

/**
 * 指定されたカテゴリ名またはカテゴリIDに関連する質問テンプレートを取得する関数
 * @param categoryIdentifier - 検索対象のカテゴリ名またはカテゴリID (UUID形式)
 * @returns {Promise<z.infer<typeof FollowUpQuestionSchema>[]>} - 質問ID、テキスト、タイプ、選択肢、バリデーションルールを含むオブジェクトの配列
 */
export async function findRelevantQuestionTemplates(
  categoryIdentifier: string
): Promise<z.infer<typeof FollowUpQuestionSchema>[]> {
  console.log(
    `[question-search] Finding questions for category identifier: ${categoryIdentifier}`
  );
  const supabase = getEstimateAgentAdminClient();

  // ★ UUID形式かどうかを判定するヘルパー関数 (簡易版)
  const isUUID = (id: string): boolean => {
    // UUID v4 の基本的な形式にマッチするかどうか (より厳密なチェックも可能)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  let categoryId: string | undefined;

  try {
    // ★ 入力がUUID形式かチェック
    if (isUUID(categoryIdentifier)) {
      console.log(
        `[question-search] Identifier "${categoryIdentifier}" is a UUID. Using it directly as category ID.`
      );
      categoryId = categoryIdentifier;
    } else {
      // ★ UUID形式でない場合は、カテゴリ名としてIDを検索
      console.log(
        `[question-search] Identifier "${categoryIdentifier}" is not a UUID. Searching for category ID by name.`
      );
      const { data: categoryData, error: categoryError } = await supabase
        .schema('estimate_agent')
        .from('project_categories')
        .select('id')
        .eq('name', categoryIdentifier)
        .single();

      if (categoryError) {
        if (categoryError.code === 'PGRST116') {
          console.warn(
            `[question-search] Category not found or not unique for name: ${categoryIdentifier}`
          );
          return [];
        }
        console.error(
          '[question-search] Error fetching category ID:',
          categoryError
        );
        throw new Error(
          `Failed to fetch category ID: ${categoryError.message}`
        );
      }

      if (!categoryData) {
        console.warn(
          `[question-search] No category data returned for name: ${categoryIdentifier}`
        );
        return [];
      }

      categoryId = categoryData.id;
      console.log(
        `[question-search] Found category ID: ${categoryId} for name: ${categoryIdentifier}`
      );
    }

    // ★ categoryId が確定しているかチェック (重要)
    if (!categoryId) {
      console.error('[question-search] Category ID could not be determined.');
      return []; // IDがなければ検索できない
    }

    // ★ 確定したカテゴリIDを使って質問テンプレートを取得
    console.log(
      `[question-search] Fetching question templates for category ID: ${categoryId}`
    );
    const { data: questionsData, error: questionsError } = await supabase
      .schema('estimate_agent')
      .from('question_templates')
      .select('id, question, type, options, validation_rules')
      .eq('category_id', categoryId)
      .order('position', { ascending: true });

    if (questionsError) {
      console.error(
        '[question-search] Error fetching question templates:',
        questionsError
      );
      throw new Error(
        `Failed to fetch question templates: ${questionsError.message}`
      );
    }

    if (!questionsData) {
      console.warn(
        `[question-search] No question templates found for category ID: ${categoryId}`
      );
      return [];
    }

    // 3. 取得データを整形して返す
    const relevantQuestions = questionsData.map((q) => ({
      questionId: q.id,
      questionText: q.question,
      type: q.type,
      options: q.options,
      validationRules: q.validation_rules,
    }));

    // Zodスキーマでパース (バリデーション)
    const validationResult = z
      .array(FollowUpQuestionSchema)
      .safeParse(relevantQuestions);
    if (!validationResult.success) {
      console.error(
        '[question-search] Validation failed for fetched questions:',
        validationResult.error.errors
      );
      // バリデーションエラーの場合は、エラーを投げるか、空を返すか検討
      // ここではエラーを投げる
      throw new Error('Fetched question data does not match expected schema.');
    }

    console.log(
      `[question-search] Found ${validationResult.data.length} questions for category ID: ${categoryId}`
    );
    return validationResult.data;
  } catch (error) {
    console.error('[question-search] An unexpected error occurred:', error);
    // エラー発生時は空配列を返すか、エラーを再throwするか検討
    // ここでは再throwする
    throw error;
  }
}
