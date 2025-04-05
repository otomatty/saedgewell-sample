'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Octokit } from '@octokit/rest';
import type { GitHubSettings, CommitStats, ContributionDay } from '@kit/types';

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

    // 最終同期日時を先に更新して状態を保存（結果に関わらず同期試行を記録）
    await supabase
      .from('github_settings')
      .update({
        last_synced_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('user_id', settings.user_id ?? '');

    // ユーザーの全リポジトリを取得（結果の件数を制限）
    const { data: repos } = await octokit.rest.repos.listForUser({
      username: settings.username,
      type: 'all',
      sort: 'updated',
      per_page: 50, // 最新の50件に制限
    });

    // リポジトリ情報をデータベースに保存
    const batchSize = 10; // バッチサイズを設定
    const repoBatches = [];

    // リポジトリをバッチに分割
    for (let i = 0; i < repos.length; i += batchSize) {
      repoBatches.push(repos.slice(i, i + batchSize));
    }

    // バッチごとに処理
    for (const batch of repoBatches) {
      await Promise.all(
        batch.map(async (repo) => {
          try {
            const { error: repoUpsertError } = await supabase
              .from('github_repositories')
              .upsert({
                id: repo.id,
                owner: repo.owner.login,
                name: repo.name,
                html_url: repo.html_url,
                description: repo.description,
                synced_at: now.toISOString(),
              });

            if (repoUpsertError) {
              console.error(
                `リポジトリ情報の保存中にエラーが発生しました ${repo.full_name}:`,
                repoUpsertError
              );
            }
          } catch (error) {
            console.error(
              `リポジトリ情報の処理中にエラーが発生しました ${repo.full_name}:`,
              error
            );
          }
        })
      );
    }

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
    // 処理時間を短縮するため最新の10個のリポジトリのみ処理
    const recentRepos = repos.slice(0, 10);

    // バッチごとに処理
    const repoBatchesForCommits = [];
    for (let i = 0; i < recentRepos.length; i += batchSize) {
      repoBatchesForCommits.push(recentRepos.slice(i, i + batchSize));
    }

    for (const batch of repoBatchesForCommits) {
      await Promise.all(
        batch.map(async (repo) => {
          try {
            // 最大7日前までのコミットのみを対象に
            const sinceDateLimit = new Date();
            sinceDateLimit.setDate(sinceDateLimit.getDate() - 7);
            const sinceDate =
              lastSync > sinceDateLimit ? lastSync : sinceDateLimit;

            const { data: commits } = await octokit.rest.repos.listCommits({
              owner: repo.owner.login,
              repo: repo.name,
              author: settings.username,
              since: sinceDate.toISOString(),
              until: now.toISOString(),
              per_page: 30, // コミット数を制限
            });

            // コミット数が多すぎる場合は最新のもののみ処理
            const recentCommits = commits.slice(0, 20);

            // 各コミットの詳細を取得して統計を集計
            for (const commit of recentCommits) {
              const date = commit.commit.author?.date?.split('T')[0];
              if (!date) continue;

              // コミット統計の取得を最適化（単一コミット毎のAPI呼び出しを減らす）
              let stats: CommitStats = { additions: 0, deletions: 0, total: 0 };

              // 一部のコミット（最新の10件）のみ詳細統計を取得
              if (recentCommits.indexOf(commit) < 10) {
                try {
                  const { data: commitData } =
                    await octokit.rest.repos.getCommit({
                      owner: repo.owner.login,
                      repo: repo.name,
                      ref: commit.sha,
                    });
                  stats = commitData.stats as CommitStats;
                } catch (err) {
                  console.error(`コミット詳細の取得に失敗: ${commit.sha}`, err);
                }
              }

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
        })
      );
    }

    // データベースに保存
    const entries = Array.from(dailyStats.entries());
    const entriesBatches = [];
    for (let i = 0; i < entries.length; i += batchSize) {
      entriesBatches.push(entries.slice(i, i + batchSize));
    }

    for (const batch of entriesBatches) {
      await Promise.all(
        batch.map(async ([date, stats]) => {
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
        })
      );
    }

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
