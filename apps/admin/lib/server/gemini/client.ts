import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// より軽量なモデルを使用
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// リクエストの最小間隔（ミリ秒）
const MIN_REQUEST_INTERVAL = 1000;
let lastRequestTime = 0;

/**
 * 指定された時間だけ待機する
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * レスポンステキストから純粋なJSONを抽出する
 */
const extractJSON = (text: string): string => {
  // Markdownのコードブロックを削除
  const cleanedText = text
    .replace(/```(?:json|JSON)?\n?([\s\S]*?)\n?```/g, '$1')
    .trim();

  // JSONの開始と終了のインデックスを見つける
  const jsonStartIndex = cleanedText.indexOf('{');
  const jsonEndIndex = cleanedText.lastIndexOf('}') + 1;

  // 有効なJSONの部分を抽出
  if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
    return cleanedText.slice(jsonStartIndex, jsonEndIndex);
  }

  // JSONが見つからない場合は元のテキストを返す
  return cleanedText;
};

/**
 * エラーが一時的なものかどうかを判定する
 */
const isTransientError = (error: unknown): boolean => {
  const errorString = String(error);
  return (
    errorString.includes('503 Service Unavailable') ||
    errorString.includes('The model is overloaded') ||
    errorString.includes('Rate limit exceeded') ||
    errorString.includes('429 Too Many Requests') || // 429エラーを追加
    errorString.includes('Resource has been exhausted') || // クォータ超過エラーを追加
    errorString.includes('Internal server error') ||
    errorString.includes('Bad Gateway') ||
    errorString.includes('Gateway Timeout')
  );
};

/**
 * リクエスト間隔を制御する
 */
const enforceRequestInterval = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await sleep(waitTime);
  }
  lastRequestTime = Date.now();
};

/**
 * Gemini APIにリクエストを送信する（リトライロジック付き）
 */
export async function generateGeminiResponse(
  prompt: string,
  maxRetries = 5, // リトライ回数を増やす
  initialRetryDelay = 2000 // 初期待機時間を増やす
): Promise<string> {
  let lastError: Error | null = null;
  let retryCount = 0;

  console.log('Gemini API呼び出し開始', {
    prompt: `${prompt.substring(0, 100)}...`,
  });

  while (retryCount < maxRetries) {
    try {
      // リクエスト間隔を制御
      await enforceRequestInterval();

      // セーフティディレイ（同時リクエストを避けるため）
      if (retryCount > 0) {
        const delay = initialRetryDelay * 2 ** (retryCount - 1);
        console.log(
          `Gemini API retry ${retryCount}/${maxRetries} after ${delay}ms...`
        );
        await sleep(delay);
      }

      console.log('Gemini APIリクエスト送信中...');
      const result = await geminiModel.generateContent(prompt);
      console.log('Gemini APIレスポンス受信');
      const response = await result.response;
      const text = response.text();
      console.log('Gemini APIレスポンステキスト取得完了', {
        length: text.length,
      });

      // JSONを抽出して返す
      const jsonText = extractJSON(text);
      console.log('JSONテキスト抽出完了', { length: jsonText.length });

      // 抽出したJSONが有効かチェック
      try {
        JSON.parse(jsonText);
        console.log('JSONパース成功');
        return jsonText;
      } catch (parseError) {
        console.error('Invalid JSON response:', jsonText);
        console.error('Parse error:', parseError);

        // 元のテキストから最初の100文字と最後の100文字をログに出力
        if (text.length > 200) {
          console.error(
            'Original text (truncated):',
            `${text.substring(0, 100)} ... ${text.substring(text.length - 100)}`
          );
        } else {
          console.error('Original text:', text);
        }

        throw new Error('Invalid JSON response from Gemini API');
      }
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${retryCount + 1}/${maxRetries} failed:`, error);

      // 一時的なエラーの場合はリトライ
      if (isTransientError(error)) {
        retryCount++;
        if (retryCount < maxRetries) {
          // 429エラーの場合は待機時間を長めに設定
          if (
            String(error).includes('429') ||
            String(error).includes('Resource has been exhausted')
          ) {
            await sleep(initialRetryDelay * 4 ** retryCount); // より長い待機時間
          }
        }
      } else {
        // エラー詳細をログに出力
        console.error('Permanent Gemini API error details:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

        // 永続的なエラーの場合は即座に失敗
        throw new Error(
          `Permanent Gemini API error: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  }

  // 全てのリトライが失敗した場合
  console.error('All Gemini API retries failed', {
    maxRetries,
    lastError:
      lastError instanceof Error ? lastError.message : String(lastError),
    stack: lastError instanceof Error ? lastError.stack : undefined,
  });

  throw new Error(
    `Failed after ${maxRetries} retries. Last error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}
