/**
 * get-service-role-key.ts
 *
 * このファイルはSupabaseのサービスロールキー（高い権限を持つキー）を環境変数から
 * 取得し検証するためのユーティリティ関数を提供します。
 *
 * 主な機能:
 * - 環境変数からサービスロールキーを安全に取得
 * - zodを使用したキーの検証
 * - 開発環境での警告メッセージの表示
 *
 * 処理の流れ:
 * 1. getServiceRoleKey関数: 環境変数SUPABASE_SERVICE_ROLE_KEYからキーを取得し、
 *    zodを使用して値が存在することを検証
 * 2. warnServiceRoleKeyUsage関数: 開発環境でサービスロールキーが使用されている場合に
 *    警告メッセージをコンソールに表示
 *
 * 特記事項:
 * - 'server-only'パッケージを使用して、このコードがクライアントサイドにバンドルされることを防止
 *   （セキュリティ上重要）
 * - サービスロールキーはRow Level Security (RLS)をバイパスする能力を持つため、
 *   取り扱いには注意が必要
 *
 * 使用例:
 * ```
 * // server-admin-client.tsなどで
 * const serviceRoleKey = getServiceRoleKey();
 * const client = createClient(url, serviceRoleKey, options);
 * ```
 *
 * 注意点:
 * - このファイルの関数はセキュリティ上の理由から、必ずサーバーサイドでのみ使用すべきです
 * - 環境変数SUPABASE_SERVICE_ROLE_KEYが設定されていない場合、明確なエラーメッセージが表示されます
 * - サービスロールキーは必要な場合にのみ使用し、不必要な使用は避けるべきです
 */
import 'server-only';

import { z } from 'zod';

const message =
  'Invalid Supabase Service Role Key. Please add the environment variable SUPABASE_SERVICE_ROLE_KEY.';

/**
 * @name getServiceRoleKey
 * @description Get the Supabase Service Role Key.
 * ONLY USE IN SERVER-SIDE CODE. DO NOT EXPOSE THIS TO CLIENT-SIDE CODE.
 */
export function getServiceRoleKey() {
  return z
    .string({
      required_error: message,
    })
    .min(1, {
      message: message,
    })
    .parse(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Displays a warning message if the Supabase Service Role is being used.
 */
export function warnServiceRoleKeyUsage() {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[Dev Only] This is a simple warning to let you know you are using the Supabase Service Role. Make sure it's the right call.`
    );
  }
}
