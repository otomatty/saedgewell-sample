/**
 * browser-client.ts
 *
 * このファイルはブラウザ環境（クライアントサイド）でSupabaseクライアントを初期化するための
 * 関数を提供します。
 *
 * 主な機能:
 * - ブラウザ環境に最適化されたSupabaseクライアントの作成
 * - 環境変数からSupabase URLと匿名キーを取得して使用
 * - 型安全なクライアントインスタンスの提供
 *
 * 処理の流れ:
 * 1. getSupabaseClientKeys()関数を呼び出して環境変数からSupabase URLと匿名キーを取得
 * 2. @supabase/ssrパッケージの createBrowserClient 関数を使用してクライアントを初期化
 * 3. ジェネリック型パラメータを使用して、型安全なクライアントを返す
 *    (デフォルトではDatabase型を使用するが、カスタム型も指定可能)
 *
 * 使用例:
 * ```
 * const supabase = getSupabaseBrowserClient();
 * const { data } = await supabase.from('table').select('*');
 * ```
 *
 * 注意点:
 * - このクライアントはブラウザ環境でのみ使用することを想定しています
 * - クライアントコンポーネント内でのみ使用可能です
 * - 環境変数 NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY が
 *   設定されている必要があります
 */
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../database.types';
import { getSupabaseClientKeys } from '../get-supabase-client-keys';

/**
 * @name getSupabaseBrowserClient
 * @description ブラウザで使用するためのSupabaseクライアントを取得します
 */
export function getSupabaseBrowserClient<GenericSchema = Database>() {
  const keys = getSupabaseClientKeys();
  // キーズから直接URLを使用（getSupabaseClientKeysで環境によって適切なURLが選択される）
  const url = keys.url;

  // ドメイン設定
  let domain: string | undefined = undefined; // 環境変数参照を削除し、初期値を undefined に
  /* // コメントアウト開始
    process.env.AUTH_COOKIE_DOMAIN || '.saedgewell.test';
  */ // コメントアウト終了

  // ホスト名からローカル環境かどうかを判断
  const hostname =
    typeof window !== 'undefined' ? window.location.hostname : '';

  if (hostname === 'localhost') {
    // ローカル環境の場合はドメイン設定をしない
    domain = undefined;
  } else if (hostname.includes('saedgewell.test')) {
    // Docker環境の場合は明示的に.saedgewell.testを設定
    domain = '.saedgewell.test';
  } else if (hostname.includes('saedgewell.net')) {
    // 本番環境の場合は明示的に.saedgewell.netを設定
    domain = '.saedgewell.net';
  }

  // Cookieオプションを設定
  const cookieOptions = {
    // ドメインが存在する場合のみ設定
    ...(domain ? { domain } : {}),
    path: '/',
    sameSite: 'none' as const, // 'lax'から'none'に変更してサードパーティCookie制限に対応
    secure: true, // 常にtrueに設定して、サブドメイン間で共有可能にする
  };

  return createBrowserClient<GenericSchema>(url, keys.anonKey, {
    cookieOptions,
  });
}
