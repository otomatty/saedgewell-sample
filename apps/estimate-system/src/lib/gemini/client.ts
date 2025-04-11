import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  type GenerationConfig,
} from '@google/generative-ai';

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error('Gemini API key is not configured in environment variables.');
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

// デフォルトのモデル設定 (必要に応じて変更可能)
const defaultModelConfig = {
  model: 'gemini-2.0-flash',
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
  generationConfig: {
    responseMimeType: 'application/json',
  },
};

// Gemini モデルのインスタンスをエクスポート
export const generativeModel = genAI.getGenerativeModel(defaultModelConfig);

// 必要であれば、異なる設定のモデルを取得する関数も提供できる

export const getSpecificModel = (config: GenerationConfig) => {
  const modelConfig = {
    model: defaultModelConfig.model,
    safetySettings: defaultModelConfig.safetySettings,
    generationConfig: { ...defaultModelConfig.generationConfig, ...config },
  };
  return genAI.getGenerativeModel(modelConfig);
};
