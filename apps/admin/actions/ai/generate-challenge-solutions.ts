'use server';

import type {
  ChallengeSolutionRequest,
  ChallengeSolutionResponse,
  GeneratedChallenge,
  GeneratedSolution,
} from '../../types/ai';
import { generateGeminiResponse } from '../../lib/server/gemini/client';

/**
 * プロジェクト説明と技術スタックから課題と解決策を生成する
 * @param data 生成リクエストデータ
 * @returns 課題と解決策の提案
 */
export async function generateChallengeSolutions(
  data: ChallengeSolutionRequest
): Promise<{
  challenges: GeneratedChallenge[];
  solutions: GeneratedSolution[];
}> {
  try {
    if (!data.description.trim()) {
      throw new Error('プロジェクトの説明を入力してください');
    }

    const technologiesText = data.technologies
      .map((tech) => tech.label)
      .join(', ');

    const existingChallengesText = data.existingChallenges
      ? data.existingChallenges
          .map((challenge) => `${challenge.title}: ${challenge.description}`)
          .join('\n')
      : '特になし';

    // Geminiにプロンプトを送信
    const prompt = `
プロジェクトの説明と使用技術から、このプロジェクトで直面した可能性のある課題と解決策を考え、提案してください。
日本語で記述し、魅力的で具体的な内容にしてください。

プロジェクトの説明: ${data.description}
使用技術: ${technologiesText || '特に指定なし'}
既に記録されている課題:
${existingChallengesText}

上記の情報を考慮し、まだ記録されていない可能性のある課題と解決策を3つ程度提案してください。

以下の形式でJSON形式で出力してください:
{
  "challenges": [
    {"title": "課題タイトル1", "description": "課題の詳細説明1"},
    {"title": "課題タイトル2", "description": "課題の詳細説明2"},
    ...
  ],
  "solutions": [
    {"title": "解決策タイトル1", "description": "解決策の詳細説明1"},
    {"title": "解決策タイトル2", "description": "解決策の詳細説明2"},
    ...
  ]
}

必ず有効なJSONを返してください。マークダウンのコードブロックや説明文は含めないでください。
`;

    // Gemini APIを使用して応答を生成
    const content = await generateGeminiResponse(prompt);
    const generatedContent = JSON.parse(content) as ChallengeSolutionResponse;

    // 課題や解決策がないとエラーになるのを防止
    return {
      challenges: generatedContent.challenges || [],
      solutions: generatedContent.solutions || [],
    };
  } catch (error) {
    console.error('課題と解決策の生成に失敗しました:', error);
    throw new Error('課題と解決策の生成に失敗しました');
  }
}
