'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { GithubRepository } from '~/types/github';

/**
 * GitHub リポジトリ一覧を取得する
 * github_repositories テーブルから全てのリポジトリ情報を取得します
 * @returns GithubRepository[] リポジトリ一覧
 */
export async function getGithubRepositories(): Promise<GithubRepository[]> {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('github_repositories')
      .select('id, owner, name, html_url, description, is_private, synced_at')
      .order('owner')
      .order('name');

    if (error) {
      console.error('GitHub リポジトリの取得に失敗しました:', error);
      throw new Error(
        `GitHub リポジトリの取得に失敗しました: ${error.message}`
      );
    }

    return data as GithubRepository[];
  } catch (error) {
    console.error('GitHub リポジトリの取得中にエラーが発生しました:', error);
    throw new Error('GitHub リポジトリの取得中にエラーが発生しました');
  }
}
