// vector-search.ts の修正
import { getEstimateAgentAdminClient } from '../lib/supabase/client';
import { GoogleGenerativeAI, TaskType } from '@google/generative-ai';
import type {
  ProjectTemplateWithSimilarity,
  SimilarTemplateFeature,
} from '../types';

// SimilarTemplateFeature の定義を削除
// export interface SimilarTemplateFeature { ... }

const supabase = getEstimateAgentAdminClient();

// キャッシュの実装
const queryCache = new Map<
  string,
  {
    results: ProjectTemplateWithSimilarity[];
    timestamp: number;
  }
>();
const CACHE_TTL = 1000 * 60 * 5; // 5分

// テスト環境判定
const isTestEnvironment = process.env.NODE_ENV === 'test';

// Gemini API設定
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error('Gemini API key is not configured.');
}
const genAI = new GoogleGenerativeAI(geminiApiKey);
const queryEmbeddingModel = genAI.getGenerativeModel({
  model: 'text-embedding-004',
});

/**
 * ユーザー入力に基づいて類似プロジェクトをベクトル検索する関数
 * @param queryText - ユーザーが入力したテキスト (システムの概要など)
 * @param matchThreshold - 類似度の閾値 (0から1の間。大きいほど似ている)
 * @param matchCount - 取得する最大件数
 * @returns 類似するプロジェクトテンプレートの配列 (Promise)
 */
export async function findSimilarProjects(
  queryText: string,
  matchThreshold = 0.5,
  matchCount = 5
): Promise<ProjectTemplateWithSimilarity[]> {
  // 入力検証
  if (!queryText?.trim()) {
    return [];
  }

  // キャッシュチェック
  const cacheKey = `${queryText}-${matchThreshold}-${matchCount}`;
  const cached = queryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.results;
  }

  try {
    // Embedding生成
    const result = await queryEmbeddingModel.embedContent({
      content: { parts: [{ text: queryText }], role: 'user' },
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });
    const originalQueryEmbedding = result.embedding.values;

    // Embeddingの次元数チェックと切り詰めを削除
    const queryEmbedding = originalQueryEmbedding;

    // Supabaseでベクトル検索実行
    const rpcParams = {
      // デバッグログ追加：RPCパラメータを変数に格納
      query_embedding: JSON.stringify(queryEmbedding), // デバッグログ追加：JSON文字列化も確認
      match_threshold: matchThreshold,
      match_count: matchCount,
    };

    const { data: similarProjects, error: rpcError } = await supabase
      .schema('estimate_agent')
      .rpc('search_similar_templates_v2', rpcParams);

    if (rpcError) {
      // エラー発生時にもパラメータをログに残すように修正
      console.error('Supabase RPC error details:', {
        function: 'search_similar_templates_v2',
        params: rpcParams,
        error: rpcError,
      });
      throw rpcError;
    }

    // RPC の戻り値の型 (Supabaseクライアントが推論する可能性のある型)
    // content_embedding が string になっている点に注意
    type RpcResponseType = {
      id: string;
      user_id: string | null;
      name: string;
      category_id: string;
      description: string | null;
      actual_hours: number | null;
      actual_cost: number | null;
      created_at: string;
      updated_at: string;
      content_embedding: string; // ← Linter が string と認識している
      similarity: number;
    };

    // 結果の整形とソート
    // ★ RPCの戻り値の型定義が不正確なため、手動でマッピングする
    const parsedProjects: ProjectTemplateWithSimilarity[] = (
      (similarProjects as RpcResponseType[]) ?? []
    ).map((item: RpcResponseType) => ({
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      category_id: item.category_id,
      description: item.description,
      actual_hours: item.actual_hours,
      actual_cost: item.actual_cost,
      created_at: item.created_at,
      updated_at: item.updated_at,
      // content_embedding を string から number[] に変換する必要があるかもしれない
      // もし Supabase Client が実際には number[] を返しているなら、unknown 経由でキャスト
      content_embedding: item.content_embedding as unknown as number[],
      similarity: item.similarity,
    }));

    const sortedProjects = [...parsedProjects].sort(
      (a, b) => b.similarity - a.similarity
    );

    // キャッシュに保存
    queryCache.set(cacheKey, {
      results: sortedProjects, // ★ パース済みの結果をキャッシュ
      timestamp: Date.now(),
    });

    // 古いキャッシュの削除
    setTimeout(() => queryCache.delete(cacheKey), CACHE_TTL);

    return sortedProjects;
  } catch (error) {
    // エラーログの改善
    console.error('Vector search error:', {
      query: queryText,
      threshold: matchThreshold,
      error: error instanceof Error ? error.message : 'Unknown error',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error instanceof Error ? error.stack : undefined,
      }),
    });

    throw error;
  }
}

/**
 * 機能概要の Embedding に基づいて類似する機能テンプレートをベクトル検索する関数
 * @param queryEmbedding - 検索に使用する Embedding ベクトル
 * @param matchThreshold - 類似度の閾値 (0から1の間。大きいほど似ている)
 * @param matchCount - 取得する最大件数
 * @returns 類似する機能テンプレートの配列 (Promise)
 */
export async function findSimilarTemplateFeatures(
  queryEmbedding: number[],
  matchThreshold = 0.7, // Default threshold might differ from projects
  matchCount = 3 // Default count might differ from projects
): Promise<SimilarTemplateFeature[]> {
  // Input validation for embedding
  if (!queryEmbedding || queryEmbedding.length === 0) {
    console.error('Invalid or empty query embedding provided.');
    return [];
  }

  try {
    // Supabase DB 関数呼び出しのためのパラメータ
    const rpcParams = {
      query_embedding: JSON.stringify(queryEmbedding), // Ensure embedding is passed as a JSON string
      match_threshold: matchThreshold,
      match_count: matchCount,
    };

    // Supabase でベクトル検索を実行 (DB関数名を 'match_template_features' と仮定)
    const { data: similarFeatures, error: rpcError } = await supabase
      .schema('estimate_agent') // Make sure the schema is correct
      .rpc('match_template_features', rpcParams); // Ensure RPC function name is correct

    if (rpcError) {
      console.error('Supabase RPC error details:', {
        function: 'match_template_features',
        schema: 'estimate_agent',
        params: rpcParams, // Log params on error
        error: rpcError,
      });
      throw rpcError; // Rethrowing might be suitable for workflow steps
    }

    // RPCの結果を検証・整形 (DB関数の戻り値の型に合わせて調整が必要)
    // ここでは DB 関数が SimilarTemplateFeature[] 型に適合する配列を返すと仮定
    // RPC の戻り値が any になることがあるため、型アサーションを追加
    const parsedFeatures: SimilarTemplateFeature[] = (
      (similarFeatures as SimilarTemplateFeature[]) ?? []
    )
      .map((feature: SimilarTemplateFeature) => {
        // map の引数にも型を追加
        // Basic validation/parsing if needed
        return {
          id: feature.id, // Ensure these fields exist in the response
          name: feature.name,
          description: feature.description,
          estimated_hours: feature.estimated_hours,
          similarity: feature.similarity,
          // Map other fields if necessary
        };
      })
      // Sort by similarity descending (optional, but often useful)
      .sort(
        (a: SimilarTemplateFeature, b: SimilarTemplateFeature) =>
          b.similarity - a.similarity
      ); // sort の引数に型を追加

    return parsedFeatures;
  } catch (error) {
    console.error('Error finding similar template features:', {
      threshold: matchThreshold,
      count: matchCount,
      // Avoid logging the full embedding vector unless necessary for debugging
      error: error instanceof Error ? error.message : 'Unknown error',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error instanceof Error ? error.stack : undefined,
      }),
    });

    // Handle error appropriately, e.g., rethrow or return empty array
    // For workflow steps, rethrowing might be best to halt execution.
    throw error;
  }
}
