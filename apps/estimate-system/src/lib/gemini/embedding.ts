// apps/estimate-agent/src/lib/gemini/embedding.ts
import { GoogleGenerativeAI, type TaskType } from '@google/generative-ai';

// Gemini API 設定 (これはどこか共通の場所にあるべきだけど、とりあえずここに書くわ)
// TODO: APIキーは環境変数から安全に読み込むこと！
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  // 本来はもっとちゃんとしたエラー処理が必要よ
  throw new Error(
    '環境変数に GEMINI_API_KEY が設定されてないじゃない！話にならないわ！'
  );
}
const genAI = new GoogleGenerativeAI(geminiApiKey);
const embeddingModel = genAI.getGenerativeModel({
  model: 'text-embedding-004', // generate-embeddings.ts と同じモデルを使うわよ
});

interface GenerateEmbeddingParams {
  content: string;
  taskType: TaskType; // TaskType を直接受け取るように変更
}

/**
 * 指定されたテキストコンテンツの Embedding を生成する関数
 * @param params - content と taskType を含むオブジェクト
 * @returns Embedding ベクトル (number[])
 */
export async function generateEmbedding({
  content,
  taskType,
}: GenerateEmbeddingParams): Promise<number[]> {
  // console.debug(`Generating embedding for task type: ${taskType}`); // デバッグ用
  if (!content?.trim()) {
    console.warn('Embedding 生成対象のコンテンツが空よ。空配列を返すわ。');
    return [];
  }

  try {
    const result = await embeddingModel.embedContent({
      content: { parts: [{ text: content }], role: 'user' }, // role は 'user' でいいでしょう
      taskType: taskType,
    });
    const embedding = result.embedding.values;

    // text-embedding-004 は 768 次元を返すはずだから、切り詰めは不要ね。
    // console.debug(`Generated embedding dimension: ${embedding.length}`); // デバッグ用

    return embedding;
  } catch (error) {
    console.error('Gemini API で Embedding 生成中にエラー発生よ！', {
      content: `${content.substring(0, 50)}...`, // 内容も少しログに出しとくわ
      taskType: taskType,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // エラー時は空配列を返すか、エラーを再throwするか… アンタが決めるのよ。
    // ここでは空配列を返すことにしておくわ。呼び出し元で対処しなさい。
    return [];
  }
}
