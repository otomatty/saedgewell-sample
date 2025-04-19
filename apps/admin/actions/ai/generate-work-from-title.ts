'use server';

import type { GeneratedWorkContent } from '../../types/ai';
import { generateGeminiResponse } from '../../lib/server/gemini/client';

/**
 * プロジェクトタイトルから実績内容を生成する
 * @param title プロジェクトタイトル
 * @returns GeneratedWorkContent 生成された実績内容
 */
export async function generateWorkFromTitle(
  title: string
): Promise<GeneratedWorkContent> {
  try {
    if (!title.trim()) {
      throw new Error('タイトルを入力してください');
    }

    // Geminiにプロンプトを送信
    const prompt = `
あなたはITプロジェクトの専門家で、プロジェクトマネージャー、エンジニア、デザイナーの経験が豊富です。
以下のプロジェクトタイトルから、ポートフォリオに掲載するための実績内容を詳細に生成してください。
想像力を働かせ、具体的かつ現実的な内容を生成してください。日本語で記述し、魅力的な内容にしてください。

プロジェクトタイトル: ${title}

次の情報を生成し、最終的な出力は必ず有効なJSONフォーマットで提供してください：
- タイトル: タイトルをそのまま使用
- 説明文: 100〜150文字程度の魅力的な説明
- 概要: プロジェクトの詳細な概要（背景、目的、成果を含める）
- 担当役割: 具体的な役割と責任
- 開発期間: 「2023年4月〜2023年9月（6ヶ月）」のような具体的な期間
- チーム構成: 「5名（PM1名、エンジニア3名、デザイナー1名）」のような具体的な構成
- 技術スタック: 最低5つ以上の技術要素
- 課題と解決策: 3つの課題とそれに対応する解決策
- 担当業務: 少なくとも3つの具体的な責任範囲
- 成果: 少なくとも3つの具体的な成果（数値を含める）

以下の形式でJSON形式で出力してください:
{
  "title": "${title}",
  "description": "説明文",
  "detail_overview": "概要",
  "detail_role": "役割",
  "detail_period": "期間",
  "detail_team_size": "チーム構成",
  "technologies": [
    {"value": "react", "label": "React"}, 
    {"value": "next", "label": "Next.js"}
  ],
  "challenges": [
    {"title": "課題1", "description": "課題の説明1"},
    {"title": "課題2", "description": "課題の説明2"},
    {"title": "課題3", "description": "課題の説明3"}
  ],
  "solutions": [
    {"title": "解決策1", "description": "解決策の説明1"},
    {"title": "解決策2", "description": "解決策の説明2"},
    {"title": "解決策3", "description": "解決策の説明3"}
  ],
  "responsibilities": ["責任1", "責任2", "責任3"],
  "results": ["成果1", "成果2", "成果3"]
}

必ず有効なJSONを返してください。マークダウンのコードブロックや余分な説明文は含めないでください。
`;

    // Gemini APIを使用して応答を生成
    console.log('Gemini API リクエスト中...');
    const content = await generateGeminiResponse(prompt);
    console.log('Gemini API レスポンス受信完了');

    // 生成されたコンテンツの型を定義
    let generatedContent: GeneratedWorkContent;

    try {
      // レスポンスがJSONとして解析可能か確認
      generatedContent = JSON.parse(content) as GeneratedWorkContent;
      console.log('JSONパース成功');
    } catch (parseError) {
      console.error('JSONパースエラー:', parseError);
      console.error('受信したコンテンツ:', content);

      // 簡易的なJSONフォーマット修正の試み
      try {
        // 余分なバッククォートやコードブロック記法を削除
        const cleanedContent = content
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        generatedContent = JSON.parse(cleanedContent) as GeneratedWorkContent;
        console.log('クリーニング後のJSONパース成功');
      } catch (secondError) {
        console.error('クリーニング後もJSONパースに失敗:', secondError);
        throw new Error('AIからの応答を解析できませんでした。形式が不正です。');
      }
    }

    // 返り値にtitleを含めて返す（必要に応じて使用側でスキップ）
    return {
      title: generatedContent.title || title,
      description: generatedContent.description || '',
      detail_overview: generatedContent.detail_overview || '',
      detail_role: generatedContent.detail_role || '',
      detail_period: generatedContent.detail_period || '',
      detail_team_size: generatedContent.detail_team_size || '',
      technologies: generatedContent.technologies || [],
      challenges: generatedContent.challenges || [],
      solutions: generatedContent.solutions || [],
      responsibilities: generatedContent.responsibilities || [],
      results: generatedContent.results || [],
    };
  } catch (error) {
    console.error('タイトルからの実績内容生成に失敗しました:', error);

    // エラーの詳細情報をログに出力
    if (error instanceof Error) {
      console.error('エラー詳細:', error.message);
      console.error('スタックトレース:', error.stack);
    } else {
      console.error('不明なエラー:', error);
    }

    throw new Error(
      `タイトルからの実績内容生成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`
    );
  }
}
