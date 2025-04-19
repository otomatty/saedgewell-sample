'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Octokit } from '@octokit/rest';
import type {
  GitHubSettings,
  CommitStats,
  ContributionDay,
} from '../../../../packages/types/src/github';

/**
 * GitHubの貢献データを同期する
 */
export async function syncGitHubContributions() {
  try {
    const supabase = await getSupabaseServerClient();

    // 現在のユーザーのGitHub設定を取得
    const { data: settings, error: settingsError } = await supabase
      .from('github_settings')
      .select('*')
      .single();

    if (settingsError || !settings) {
      throw new Error('GitHub settings not found');
    }

    const octokit = new Octokit({
      auth: settings.access_token,
    });

    // 前回の同期日時を取得
    const lastSync = settings.last_synced_at
      ? new Date(settings.last_synced_at)
      : new Date(0);
    const now = new Date();

    // ユーザーの全リポジトリを取得
    const { data: repos } = await octokit.rest.repos.listForUser({
      username: settings.username,
      type: 'all',
      sort: 'updated',
      per_page: 100,
    });

    // 日付ごとのコミット統計を集計
    const dailyStats = new Map<
      string,
      {
        count: number;
        additions: number;
        deletions: number;
      }
    >();

    // 各リポジトリのコミットを取得
    for (const repo of repos) {
      try {
        const { data: commits } = await octokit.rest.repos.listCommits({
          owner: repo.owner.login,
          repo: repo.name,
          author: settings.username,
          since: lastSync.toISOString(),
          until: now.toISOString(),
          per_page: 100,
        });

        // 各コミットの詳細を取得して統計を集計
        for (const commit of commits) {
          const date = commit.commit.author?.date?.split('T')[0];
          if (!date) continue;

          const { data: commitData } = await octokit.rest.repos.getCommit({
            owner: repo.owner.login,
            repo: repo.name,
            ref: commit.sha,
          });

          const stats = commitData.stats as CommitStats;

          const current = dailyStats.get(date) || {
            count: 0,
            additions: 0,
            deletions: 0,
          };

          dailyStats.set(date, {
            count: current.count + 1,
            additions: current.additions + (stats?.additions || 0),
            deletions: current.deletions + (stats?.deletions || 0),
          });
        }
      } catch (error) {
        console.error(`Error fetching commits for ${repo.name}:`, error);
      }
    }

    // データベースに保存
    for (const [date, stats] of dailyStats) {
      const { error: upsertError } = await supabase
        .from('github_contributions')
        .upsert({
          user_id: settings.user_id,
          contribution_date: date,
          contribution_count: stats.count,
          lines_added: stats.additions,
          lines_deleted: stats.deletions,
          commit_count: stats.count,
          updated_at: new Date().toISOString(),
        });

      if (upsertError) {
        console.error(
          `Error upserting contributions for date ${date}:`,
          upsertError
        );
      }
    }

    // 最終同期日時を更新
    await supabase
      .from('github_settings')
      .update({
        last_synced_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('user_id', settings.user_id ?? '');

    return { success: true };
  } catch (error) {
    console.error('Error syncing GitHub contributions:', error);
    return { success: false, error };
  }
}

/**
 * GitHub設定を保存する
 */
export async function saveGitHubSettings(settings: Partial<GitHubSettings>) {
  try {
    if (!settings.username || !settings.accessToken) {
      throw new Error('Username and access token are required');
    }

    const supabase = await getSupabaseServerClient();

    const { error } = await supabase
      .from('github_settings')
      .upsert({
        username: settings.username,
        access_token: settings.accessToken,
        auto_sync: settings.autoSync ?? false,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating GitHub settings:', error);
    return { success: false, error };
  }
}

/**
 * GitHub設定一覧を取得する
 */
export async function getGitHubSettings() {
  try {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
      .from('github_settings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching GitHub settings:', error);
    return { success: false, error };
  }
}

/**
 * GitHub貢献データを取得する
 */
export async function getGitHubContributions(startDate: Date, endDate: Date) {
  try {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
      .from('github_contributions')
      .select('*')
      .gte('contribution_date', startDate.toISOString().split('T')[0])
      .lte('contribution_date', endDate.toISOString().split('T')[0])
      .order('contribution_date', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return { success: false, error };
  }
}

/**
 * GitHubのカレンダー表示用のコントリビューション情報を取得する
 * @param username GitHubのユーザー名
 * @param token GitHubのアクセストークン
 * @returns コントリビューション情報の配列
 */
export async function getGithubCalendarContributions(
  username: string,
  token: string
): Promise<ContributionDay[]> {
  const query = `
		query($username: String!) {
			user(login: $username) {
				contributionsCollection {
					contributionCalendar {
						totalContributions
						weeks {
							contributionDays {
								contributionCount
								date
								color
							}
						}
					}
				}
			}
		}
	`;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(
      `GitHub API error: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`
    );
  }

  const calendar = data.data.user.contributionsCollection.contributionCalendar;
  const contributions: ContributionDay[] = [];

  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      const count = day.contributionCount;
      // コントリビューションレベルを計算 (0-4)
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) level = 1;
      if (count >= 4) level = 2;
      if (count >= 8) level = 3;
      if (count >= 12) level = 4;

      contributions.push({
        date: day.date,
        count,
        level,
        color: day.color,
      });
    }
  }

  return contributions;
}
