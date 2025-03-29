/**
 * AIサービスの設定
 */

export interface AIConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

// デフォルト設定
export const config: AIConfig = {
  // APIキーは環境変数から取得（ここには記載しない）
  apiKey: undefined,
  // デフォルトモデル
  model: 'gemini-2.0-flash',
  // 生成の多様性（0.0-1.0）
  temperature: 0.7,
  // 最大トークン数
  maxTokens: 1024,
  // タイムアウト（ミリ秒）
  timeout: 30000,
};

export default config;
