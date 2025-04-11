// apps/estimate-agent/src/lib/supabase/client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database.types'; // ← 新しいパスに変更！

let adminClientInstance: SupabaseClient<Database> | null = null;

/**
 * Estimate Agent アプリケーション用の Supabase 管理者クライアントを取得する関数 (シングルトン)
 * 環境変数 SUPABASE_SERVICE_ROLE_KEY が必要。
 * スクリプトやサーバーサイドの特権操作で使用する。
 * @returns Supabase 管理者クライアントインスタンス
 */
export function getEstimateAgentAdminClient(): SupabaseClient<Database> {
  if (adminClientInstance) {
    return adminClientInstance;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      'エラー：Estimate Agent用管理者クライアントの初期化に必要な環境変数 (URLとサービスロールキー) がないわ！'
    );
    throw new Error(
      'Supabase URL or Service Role Key is missing in environment variables.'
    );
  }

  adminClientInstance = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return adminClientInstance;
}

// 必要になったら、匿名クライアント用の関数もここに追加しなさいよ。
// export function getEstimateAgentAnonClient(): SupabaseClient<Database> { ... }
