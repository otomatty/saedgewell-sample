'use server';

import type { WorkFormData } from '../../types/works/work-form';
import type { WorkSuggestion } from '../../types/ai';
import { generateGeminiResponse } from '../../lib/server/gemini/client';

/**
 * 現在のフォーム入力内容から改善提案を生成する
 * @param formData 現在のフォーム入力内容
 * @returns WorkSuggestion[] 改善提案のリスト
 */
export async function generateWorkSuggestions(
  formData: Partial<WorkFormData>
): Promise<WorkSuggestion[]> {
  try {
    // フォームデータが空の場合はエラー
    if (
      !formData.title?.trim() &&
      !formData.description?.trim() &&
      !formData.detail_overview?.trim()
    ) {
      throw new Error(
        '少なくともタイトル、説明、概要のいずれかを入力してください'
      );
    }

    // Geminiにプロンプトを送信
    const prompt = `
以下のポートフォリオ実績データを分析して、内容をより魅力的で具体的にするための改善提案をしてください。
特に表現の改善、追加すべき情報、プロフェッショナルな印象を与えるポイントなどを提案してください。

現在の実績データ:
タイトル: ${formData.title || '(未入力)'}
説明: ${formData.description || '(未入力)'}
概要: ${formData.detail_overview || '(未入力)'}
役割: ${formData.detail_role || '(未入力)'}
期間: ${formData.detail_period || '(未入力)'}
チーム規模: ${formData.detail_team_size || '(未入力)'}
使用技術: ${
      formData.technologies && formData.technologies.length > 0
        ? formData.technologies.join(', ')
        : '(未入力)'
    }
課題数: ${formData.challenges?.length || 0}
解決策数: ${formData.solutions?.length || 0}

以下の形式でJSON形式で出力してください。フィールド名は "title", "description", "detail_overview", "detail_role", "detail_period", "detail_team_size" のいずれかを指定してください:
[
  {
    "field": "フィールド名",
    "suggestion": "提案内容",
    "reason": "提案理由"
  },
  ...
]

必ず有効なJSONを返してください。マークダウンのコードブロックや説明文は含めないでください。
`;

    // Gemini APIを使用して応答を生成
    const content = await generateGeminiResponse(prompt);
    const suggestions = JSON.parse(content);

    if (!Array.isArray(suggestions)) {
      throw new Error('AIからのレスポンスが正しい形式ではありません');
    }

    return suggestions as WorkSuggestion[];
  } catch (error) {
    console.error('改善提案の生成に失敗しました:', error);
    throw new Error('改善提案の生成に失敗しました');
  }
}
