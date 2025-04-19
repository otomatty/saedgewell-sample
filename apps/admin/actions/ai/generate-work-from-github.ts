'use server';

import type { GeneratedWorkContent } from '../../types/ai';
import { getRepositoryDetails } from '../github/get-repository-details';
import { getRepositoryReadme } from '../github/get-repository-readme';
import { getRepositoryLanguages } from '../github/get-repository-languages';
import { generateGeminiResponse } from '../../lib/server/gemini/client';

/**
 * GitHubリポジトリから実績内容を生成する
 * @param repositoryUrl GitHubリポジトリのURL
 * @returns GeneratedWorkContent 生成された実績内容
 */
export async function generateWorkFromGithub(
  repositoryUrl: string
): Promise<GeneratedWorkContent> {
  try {
    // リポジトリの詳細情報を取得
    const repoDetails = await getRepositoryDetails(repositoryUrl);

    // READMEの内容を取得
    const readme = await getRepositoryReadme(
      repoDetails.owner,
      repoDetails.name
    );

    // 言語統計を取得
    const languages = await getRepositoryLanguages(
      repoDetails.owner,
      repoDetails.name
    );

    // 言語統計から使用技術を抽出
    const techStack = languages
      ? Object.keys(languages)
          .sort((a, b) => (languages[b] || 0) - (languages[a] || 0))
          .slice(0, 8)
      : [];

    // Geminiにプロンプトを送信
    const prompt = `
以下のGitHubリポジトリの情報から、ポートフォリオに掲載する実績の内容を生成してください。
日本語で記述し、以下の項目を含めてください。

リポジトリ名: ${repoDetails.name}
所有者: ${repoDetails.owner}
説明: ${repoDetails.description || '説明なし'}
README内容: ${readme?.content || 'README情報なし'}
主要言語: ${techStack.join(', ')}

以下の形式でJSON形式で出力してください:
{
  "title": "プロジェクトのタイトル",
  "description": "100文字程度の簡潔な説明",
  "detail_overview": "プロジェクトの詳細な概要（400文字程度）",
  "detail_role": "担当した役割",
  "detail_period": "開発期間の推定",
  "detail_team_size": "チーム規模の推定",
  "technologies": [{"value": "tech1", "label": "技術1"}, ...],
  "challenges": [{"title": "課題タイトル", "description": "課題の詳細説明"}, ...],
  "solutions": [{"title": "解決策タイトル", "description": "解決策の詳細説明"}, ...]
}

必ず有効なJSONを返してください。マークダウンのコードブロックや説明文は含めないでください。
`;

    // Gemini APIを使用して応答を生成
    const content = await generateGeminiResponse(prompt);
    const generatedContent = JSON.parse(content) as GeneratedWorkContent;

    return {
      title: generatedContent.title,
      description: generatedContent.description,
      detail_overview: generatedContent.detail_overview,
      detail_role: generatedContent.detail_role,
      detail_period: generatedContent.detail_period,
      detail_team_size: generatedContent.detail_team_size,
      technologies: generatedContent.technologies,
      challenges: generatedContent.challenges,
      solutions: generatedContent.solutions,
    };
  } catch (error) {
    console.error('GitHubリポジトリからの実績内容生成に失敗しました:', error);
    throw new Error('GitHubリポジトリからの実績内容生成に失敗しました');
  }
}
