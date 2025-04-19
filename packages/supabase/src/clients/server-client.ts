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
 * - 複数のスキーマ（public、circle）をサポート
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
 * 利用可能なスキーマ:
 * - Database: publicスキーマのテーブル（ユーザー情報など）
 * - CircleDatabase: circleスキーマのテーブル（チーム、タスク管理など）
 * - Database & CircleDatabase: 両方のスキーマを統合した型
 *
 * 使用例:
 * ```
 * // 標準のデータベース型を使用（publicスキーマ）
 * const supabase = getSupabaseServerClient();
 * const { data } = await supabase.from('profiles').select('*');
 *
 * // circleスキーマを使用
 * const supabase = getSupabaseServerClient<CircleDatabase>();
 * const { data } = await supabase.schema('circle').from('teams').select('*');
 *
 * // 両方のスキーマを統合して使用
 * const supabase = getSupabaseServerClient<Database & CircleDatabase>();
 * // publicスキーマのテーブルにアクセス
 * const { data: profiles } = await supabase.from('profiles').select('*');
 * // circleスキーマのテーブルにアクセス
 * const { data: teams } = await supabase.schema('circle').from('teams').select('*');
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
import type { Database as CircleDatabase } from '../circle-database.types';
import { getSupabaseClientKeys } from '../get-supabase-client-keys';

/**
 * 利用可能なデータベース型
 * - Database: publicスキーマのデータベース型
 * - CircleDatabase: circleスキーマのデータベース型
 * - Database & CircleDatabase: 両方のスキーマを統合した型
 */
export type AvailableSchema =
  | Database
  | CircleDatabase
  | (Database & CircleDatabase);

/**
 * @name getSupabaseServerClient
 * @description サーバーで使用するためのSupabaseクライアントを作成します。
 * @template T 使用するデータベース型。デフォルトは Database（publicスキーマ）
 *              CircleDatabase（circleスキーマ）も指定可能
 *              Database & CircleDatabase で両方のスキーマを統合して使用することも可能
 * @returns 型安全なSupabaseクライアント
 *
 * @example
 * // publicスキーマのみ使用
 * const supabase = getSupabaseServerClient();
 *
 * // circleスキーマのみ使用
 * const supabase = getSupabaseServerClient<CircleDatabase>();
 *
 * // 両方のスキーマを統合して使用
 * const supabase = getSupabaseServerClient<Database & CircleDatabase>();
 */
export function getSupabaseServerClient<
  T extends AvailableSchema = Database,
>() {
  const keys = getSupabaseClientKeys();

  return createServerClient<T>(keys.url, keys.anonKey, {
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
