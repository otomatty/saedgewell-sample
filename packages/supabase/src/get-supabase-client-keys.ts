/**
 * get-supabase-client-keys.ts
 *
 * このファイルはSupabaseクライアントの初期化に必要なキー（URL、匿名キー）を
 * 環境変数から取得し検証するためのユーティリティ関数を提供します。
 *
 * 主な機能:
 * - 環境変数からSupabase URLと匿名キーを取得
 * - zodを使用したキーの検証
 * - 型安全な形式でのキーの提供
 *
 * 処理の流れ:
 * 1. 環境変数NEXT_PUBLIC_SUPABASE_URLとNEXT_PUBLIC_SUPABASE_ANON_KEYから値を取得
 * 2. zodを使用して、これらの値が存在し、空でないことを検証
 * 3. 検証済みのキーをオブジェクトとして返す
 *
 * 特記事項:
 * - この関数はすべてのSupabaseクライアント初期化関数（browser-client.ts, server-client.ts,
 *   middleware-client.ts, server-admin-client.ts）で使用される基本的なユーティリティです
 * - 環境変数が適切に設定されていない場合、早期にエラーを検出できます
 *
 * 使用例:
 * ```
 * const keys = getSupabaseClientKeys();
 * // keys.url: Supabase URL
 * // keys.anonKey: Supabase匿名キー
 * const client = createClient(keys.url, keys.anonKey);
 * ```
 *
 * 注意点:
 * - 環境変数NEXT_PUBLIC_SUPABASE_URLとNEXT_PUBLIC_SUPABASE_ANON_KEYが
 *   設定されている必要があります
 * - これらの環境変数はクライアントサイドでも使用可能なため、公開しても問題ない
 *   キー（匿名キー）のみを使用していることを確認してください
 */
import { z } from 'zod';

/**
 * Returns and validates the Supabase client keys from the environment.
 */
export function getSupabaseClientKeys() {
  // ブラウザ環境かどうかを判定
  const isBrowser = typeof window !== 'undefined';

  // 環境変数から接続先URLと匿名キーを取得
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // zodで値を検証
  return z
    .object({
      url: z.string().min(1),
      anonKey: z.string().min(1),
    })
    .parse({
      url,
      anonKey,
    });
}
