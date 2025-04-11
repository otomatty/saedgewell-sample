/**
 * use-supabase.ts
 *
 * このファイルはReactコンポーネント内でSupabaseクライアントを使用するための
 * 基本的なカスタムフックを提供します。
 *
 * 主な機能:
 * - ブラウザ環境でのSupabaseクライアントインスタンスの提供
 * - useMemoを使用したクライアントのメモ化による不要な再レンダリングの防止
 * - 型安全なクライアントインスタンスの提供
 *
 * 処理の流れ:
 * 1. getSupabaseBrowserClient関数を呼び出してブラウザ環境用のSupabaseクライアントを取得
 * 2. useMemoフックを使用してクライアントインスタンスをメモ化
 * 3. メモ化されたクライアントインスタンスを返す
 *
 * 特記事項:
 * - このフックは他のすべての認証関連フックの基盤となります
 * - ジェネリック型パラメータを使用して、カスタムデータベース型を指定可能
 *
 * 使用例:
 * ```
 * // Reactコンポーネント内で
 * const supabase = useSupabase();
 *
 * // データの取得
 * const fetchData = async () => {
 *   const { data } = await supabase.from('table').select('*');
 *   // ...
 * };
 * ```
 *
 * 注意点:
 * - このフックはクライアントコンポーネント内でのみ使用可能です
 * - サーバーコンポーネントでは代わりにgetSupabaseServerClient関数を使用してください
 */
import { useMemo } from 'react';

import { getSupabaseBrowserClient } from '../clients/browser-client';
import type { Database } from '../database.types';

/**
 * @name useSupabase
 * @description Use Supabase in a React component
 */
export function useSupabase<Db = Database>() {
  return useMemo(() => getSupabaseBrowserClient<Db>(), []);
}
