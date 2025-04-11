'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini APIクライアントの初期化
 */
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not set');
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * テキストからコンテンツを生成するサーバーアクション
 */
export async function generateGeminiContent(
  text: string,
  modelName = 'gemini-1.5-pro'
) {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: modelName,
    });

    const result = await model.generateContent(`
      次のテキストを日本語で自然に読み上げるための音声を生成してください。
      テキスト: ${text}
    `);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in Gemini content generation:', error);
    throw new Error(
      `Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * APIキーの有無を確認するサーバーアクション
 */
export async function checkGeminiApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  return {
    hasApiKey: !!apiKey && apiKey !== 'your_gemini_api_key_here',
  };
}
