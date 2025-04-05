/**
 * server-admin-client.ts
 *
 * このファイルは管理者権限を持つSupabaseクライアントをサーバー環境で初期化するための
 * 関数を提供します。
 *
 * 主な機能:
 * - 管理者権限（サービスロールキー）を使用したSupabaseクライアントの作成
 * - Row Level Security (RLS)をバイパスする能力
 *  - つまりRLSを無視してデータベースを操作できる
 * - 型安全なクライアントインスタンスの提供
 *
 * 処理の流れ:
 * 1. 'server-only'パッケージをインポートして、このコードがクライアントサイドに
 *    バンドルされることを防止（セキュリティ上重要）
 * 2. warnServiceRoleKeyUsage()関数を呼び出して、開発環境で警告メッセージを表示
 * 3. getSupabaseClientKeys()関数からSupabase URLを取得
 * 4. getServiceRoleKey()関数から環境変数のサービスロールキーを取得
 * 5. @supabase/supabase-jsパッケージの createClient 関数を使用してクライアントを初期化
 *    - 認証関連のオプションを無効化（persistSession: false, detectSessionInUrl: false,
 *      autoRefreshToken: false）
 * 6. ジェネリック型パラメータを使用して、型安全なクライアントを返す
 *
 * 特記事項:
 * - このクライアントは通常のクライアントとは異なり、サービスロールキー（高い権限を持つキー）
 *   を使用します。これにより、Row Level Security (RLS)をバイパスし、データベースに対する
 *   完全なアクセス権を持ちます。
 * - 開発環境では、このクライアントの使用時に警告メッセージが表示されます。
 *
 * 使用例:
 * ```
 * // サーバーサイドコード内で
 * const adminClient = getSupabaseServerAdminClient();
 * // RLSをバイパスしてデータを取得
 * const { data } = await adminClient.from('protected_table').select('*');
 * ```
 *
 * 注意点:
 * - このクライアントはセキュリティ上の理由から、必ずサーバーサイドでのみ使用すべきです
 * - 環境変数 SUPABASE_SERVICE_ROLE_KEY が設定されている必要があります
 * - 不必要にこのクライアントを使用せず、必要な場合にのみ使用してください
 * - ユーザー管理、バックグラウンドジョブ、RLSをバイパスする必要がある管理タスクなど、
 *   特権的な操作に使用されることを想定しています
 */
import 'server-only';

import { createClient } from '@supabase/supabase-js';

import type { Database } from '../database.types';
import {
  getServiceRoleKey,
  warnServiceRoleKeyUsage,
} from '../get-service-role-key';
import { getSupabaseClientKeys } from '../get-supabase-client-keys';

/**
 * @name getSupabaseServerAdminClient
 * @description データベースへの管理者アクセス権を持つ、サーバーで使用するためのSupabaseクライアントを取得します。
 */
export function getSupabaseServerAdminClient<GenericSchema = Database>() {
  warnServiceRoleKeyUsage();

  const url = getSupabaseClientKeys().url;

  return createClient<GenericSchema>(url, getServiceRoleKey(), {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
      autoRefreshToken: false,
    },
  });
}
