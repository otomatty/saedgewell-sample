/**
 * server-client.ts
 *
 * このファイルはサーバー環境（Next.jsのサーバーコンポーネントやAPIルート）で
 * Supabaseクライアントを初期化するための関数を提供します。
 *
 * 主な機能:
 * - サーバー環境に最適化されたSupabaseクライアントの作成
 * - Next.jsのcookies APIを使用したセッション管理
 * - 型安全なクライアントインスタンスの提供
 *
 * 処理の流れ:
 * 1. 'server-only'パッケージをインポートして、このコードがクライアントサイドに
 *    バンドルされることを防止
 * 2. getSupabaseClientKeys()関数を呼び出して環境変数からSupabase URLと匿名キーを取得
 * 3. @supabase/ssrパッケージの createServerClient 関数を使用してクライアントを初期化
 * 4. Next.jsのcookies APIを使用してクッキーの取得と設定を行うカスタムハンドラを提供
 *    - getAll(): cookieStoreからすべてのクッキーを取得
 *    - setAll(): 新しいクッキーをcookieStoreに設定
 * 5. ジェネリック型パラメータを使用して、型安全なクライアントを返す
 *
 * 特記事項:
 * - try-catchブロックでクッキー設定のエラーをキャッチしています。これは、
 *   サーバーコンポーネントからsetAllメソッドが呼び出された場合に発生する可能性があります。
 *   このエラーは、ミドルウェアがユーザーセッションを更新している場合は無視できます。
 *
 * 使用例:
 * ```
 * // サーバーコンポーネントまたはAPIルート内で
 * const supabase = getSupabaseServerClient();
 * const { data } = await supabase.from('table').select('*');
 * ```
 *
 * 注意点:
 * - このクライアントはサーバー環境でのみ使用することを想定しています
 * - サーバーコンポーネントやAPIルート内でのみ使用可能です
 * - 環境変数 NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY が
 *   設定されている必要があります
 */
import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

import type { Database } from '../database.types';
import { getSupabaseClientKeys } from '../get-supabase-client-keys';

/**
 * @name getSupabaseServerClient
 * @description サーバーで使用するためのSupabaseクライアントを作成します。
 */
export function getSupabaseServerClient<GenericSchema = Database>() {
  const keys = getSupabaseClientKeys();

  return createServerClient<GenericSchema>(keys.url, keys.anonKey, {
    cookies: {
      async getAll() {
        const cookieStore = await cookies();

        return cookieStore.getAll();
      },
      async setAll(cookiesToSet) {
        const cookieStore = await cookies();

        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // サーバーコンポーネントから`setAll`メソッドが呼び出されました。
          // ミドルウェアがユーザーセッションを更新している場合、
          // これは無視できます。
        }
      },
    },
  });
}
