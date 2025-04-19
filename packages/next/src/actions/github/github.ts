'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Octokit } from '@octokit/rest';
import type { GitHubSettings, CommitStats, ContributionDay } from '@kit/types';

/**
 * GitHubの貢献データを同期する
 */
export async function syncGitHubContributions() {
  // ログと進捗状況を保存する配列
  const logs: Array<{ type: 'info' | 'error' | 'success'; message: string }> =
    [];
  const logInfo = (message: string) => {
    console.log(`[DEBUG] ${message}`);
    logs.push({ type: 'info', message });
    return message;
  };
  const logError = (message: string, err?: unknown) => {
    if (err) {
      console.error(`[DEBUG] ${message}`, err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      logs.push({
        type: 'error',
        message: `${message}: ${errorMsg}`,
      });
    } else {
      console.error(`[DEBUG] ${message}`);
      logs.push({ type: 'error', message });
    }
    return message;
  };
  const logSuccess = (message: string) => {
    console.log(`[DEBUG] ${message}`);
    logs.push({ type: 'success', message });
    return message;
  };

  try {
    logInfo('GitHub同期処理を開始します');
    const supabase = await getSupabaseServerClient();

    // 現在のユーザーのGitHub設定を取得
    const { data: settings, error: settingsError } = await supabase
      .from('github_settings')
      .select('*')
      .single();

    if (settingsError || !settings) {
      logError('GitHub設定の取得に失敗', settingsError);
      throw new Error('GitHub settings not found');
    }

    logInfo(`GitHub設定を取得: ユーザー名=${settings.username}`);

    const octokit = new Octokit({
      auth: settings.access_token,
    });

    // トークン情報をデバッグ（認証確認）
    try {
      const { data: authUser } = await octokit.rest.users.getAuthenticated();
      logInfo(`認証済みユーザー: ${authUser.login} (ID: ${authUser.id})`);

      // スコープ情報を取得（可能であれば）
      const rateLimit = await octokit.rest.rateLimit.get();
      logInfo(
        `APIレート制限情報: 残り ${rateLimit.data.rate.remaining}/${rateLimit.data.rate.limit}回`
      );
    } catch (authError) {
      logError('認証情報の検証でエラー', authError);
    }

    // 前回の同期日時を取得
    const lastSync = settings.last_synced_at
      ? new Date(settings.last_synced_at)
      : new Date(0);
    const now = new Date();

    logInfo(`前回の同期日時: ${lastSync.toISOString()}`);

    // 最終同期日時を先に更新して状態を保存（結果に関わらず同期試行を記録）
    await supabase
      .from('github_settings')
      .update({
        last_synced_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('user_id', settings.user_id ?? '');

    // ユーザーの全リポジトリを取得（結果の件数を制限）
    logInfo(`${settings.username}のリポジトリ取得を開始`);
    const { data: repos } = await octokit.rest.repos.listForUser({
      username: settings.username,
      type: 'all',
      sort: 'updated',
      per_page: 50, // 最新の50件に制限
    });

    // プライベートリポジトリのデバッグ情報
    const privateRepos = repos.filter((repo) => repo.private);
    logInfo(`取得したリポジトリ総数: ${repos.length}`);
    logInfo(`パブリックリポジトリ数: ${repos.length - privateRepos.length}`);
    logInfo(`プライベートリポジトリ数: ${privateRepos.length}`);

    if (privateRepos.length > 0) {
      logInfo(
        `[DEBUG] プライベートリポジトリの例: ${JSON.stringify(privateRepos.slice(0, 3).map((repo) => `${repo.full_name} (ID: ${repo.id})`))}`
      );
    } else {
      logInfo(
        '[DEBUG] プライベートリポジトリが見つかりません。追加検証を実行します...'
      );

      // ユーザー自身のリポジトリを取得（別のアプローチ）
      try {
        const { data: authRepos } =
          await octokit.rest.repos.listForAuthenticatedUser({
            visibility: 'all',
            per_page: 10,
          });

        const authPrivateRepos = authRepos.filter((repo) => repo.private);
        logInfo(
          `[DEBUG] 認証ユーザーとして取得したリポジトリ: ${authRepos.length}件`
        );
        logInfo(
          `[DEBUG] 認証ユーザーのプライベートリポジトリ: ${authPrivateRepos.length}件`
        );

        if (authPrivateRepos.length > 0) {
          logInfo(
            `[DEBUG] 認証ユーザーのプライベートリポジトリの例: ${JSON.stringify(authPrivateRepos.slice(0, 3).map((repo) => `${repo.full_name} (ID: ${repo.id})`))}`
          );

          // プライベートリポジトリが存在する場合は、別途データベースに保存する
          logInfo(
            `[DEBUG] 認証ユーザーの ${authPrivateRepos.length} 件のプライベートリポジトリを直接保存します`
          );

          for (const authRepo of authPrivateRepos) {
            if (
              authRepo.owner.login.toLowerCase() ===
              settings.username.toLowerCase()
            ) {
              logInfo(
                `[DEBUG] プライベートリポジトリを直接保存: ${authRepo.full_name}`
              );

              try {
                const { error: directSaveError } = await supabase
                  .from('github_repositories')
                  .upsert({
                    id: authRepo.id,
                    owner: authRepo.owner.login,
                    name: authRepo.name,
                    html_url: authRepo.html_url,
                    description: authRepo.description,
                    is_private: authRepo.private,
                    synced_at: now.toISOString(),
                  });

                if (directSaveError) {
                  logError(
                    `[DEBUG] プライベートリポジトリの直接保存エラー ${authRepo.full_name}:`,
                    directSaveError
                  );
                } else {
                  logInfo(
                    `[DEBUG] プライベートリポジトリを直接保存成功: ${authRepo.full_name}`
                  );
                }
              } catch (saveError) {
                logError(
                  `[DEBUG] プライベートリポジトリの保存例外 ${authRepo.full_name}:`,
                  saveError
                );
              }
            }
          }

          // プライベートリポジトリの直接保存後に検証
          const { data: verifyPrivate } = await supabase
            .from('github_repositories')
            .select('id, name')
            .in(
              'id',
              authPrivateRepos.map((r) => r.id)
            );

          logInfo(
            `[DEBUG] 保存検証: ${verifyPrivate?.length || 0}/${authPrivateRepos.length} 件のプライベートリポジトリが保存されました`
          );
        }
      } catch (authRepoError) {
        logError('[DEBUG] 認証ユーザーのリポジトリ取得エラー:', authRepoError);
      }
    }

    // リポジトリ情報をデータベースに保存
    const batchSize = 10; // バッチサイズを設定
    const repoBatches = [];

    // リポジトリをバッチに分割
    for (let i = 0; i < repos.length; i += batchSize) {
      repoBatches.push(repos.slice(i, i + batchSize));
    }

    logInfo(`リポジトリ保存を${repoBatches.length}バッチで実行`);

    // バッチごとに処理
    for (const [batchIndex, batch] of repoBatches.entries()) {
      logInfo(
        `[DEBUG] バッチ ${batchIndex + 1}/${repoBatches.length} 処理中...`
      );

      const results = await Promise.all(
        batch.map(async (repo) => {
          try {
            // 保存前にリポジトリ情報をログ出力
            const isPrivate = repo.private
              ? '🔒 プライベート'
              : '🌐 パブリック';
            logInfo(
              `[DEBUG] リポジトリ保存: ${repo.full_name} (${isPrivate}) [ID: ${repo.id}]`
            );

            const { data: result, error: repoUpsertError } = await supabase
              .from('github_repositories')
              .upsert({
                id: repo.id,
                owner: repo.owner.login,
                name: repo.name,
                html_url: repo.html_url,
                description: repo.description,
                is_private: repo.private,
                synced_at: now.toISOString(),
              })
              .select();

            if (repoUpsertError) {
              logError(
                `[DEBUG] リポジトリ情報の保存エラー: ${repo.full_name}:`,
                repoUpsertError
              );
              return {
                success: false,
                repo: repo.full_name,
                error: repoUpsertError,
              };
            }

            return {
              success: true,
              repo: repo.full_name,
              isPrivate: repo.private,
            };
          } catch (error) {
            logError(
              `[DEBUG] リポジトリ処理中のエラー: ${repo.full_name}:`,
              error
            );
            return { success: false, repo: repo.full_name, error };
          }
        })
      );

      // バッチ結果の集計
      const successCount = results.filter((r) => r.success).length;
      const privateSuccessCount = results.filter(
        (r) => r.success && r.isPrivate
      ).length;

      logInfo(
        `[DEBUG] バッチ ${batchIndex + 1} 結果: ${successCount}/${batch.length} 成功`
      );
      logInfo(
        `[DEBUG] プライベートリポジトリ保存成功: ${privateSuccessCount}件`
      );

      // 失敗したものを表示
      const failures = results.filter((r) => !r.success);
      if (failures.length > 0) {
        logError(
          `[DEBUG] ${failures.length}件の保存に失敗:`,
          failures.map((f) => f.repo).join(', ')
        );
      }
    }

    // 保存後に実際にDBに保存されたリポジトリを確認
    const { data: savedRepos, error: checkError } = await supabase
      .from('github_repositories')
      .select('id, owner, name')
      .eq('owner', settings.username);

    if (checkError) {
      logError('[DEBUG] 保存済みリポジトリの検証エラー:', checkError);
    } else {
      logInfo(
        `[DEBUG] データベースに保存されたリポジトリ数: ${savedRepos?.length || 0}`
      );

      // プライベートリポジトリが正しく保存されているか確認
      const savedIds = new Set(savedRepos?.map((r) => r.id) || []);
      const notSavedPrivate = privateRepos.filter(
        (repo) => !savedIds.has(repo.id)
      );

      if (notSavedPrivate.length > 0) {
        logError(
          `[DEBUG] ${notSavedPrivate.length}件のプライベートリポジトリが保存されていません:`,
          notSavedPrivate.map((r) => r.full_name).join(', ')
        );

        // テーブル構造を検証（シンプルな方法）
        logInfo('[DEBUG] プライベートリポジトリ保存テスト');
        try {
          // テストデータの作成と保存
          if (notSavedPrivate.length > 0) {
            const testRepo = notSavedPrivate[0];

            if (testRepo) {
              // 明示的な存在チェック
              logInfo(
                `[DEBUG] テスト対象リポジトリ: ${testRepo.full_name} (ID: ${testRepo.id})`
              );

              // 直接保存を試みる
              const { data: testSaveResult, error: testSaveError } =
                await supabase
                  .from('github_repositories')
                  .upsert({
                    id: testRepo.id,
                    owner: testRepo.owner.login,
                    name: testRepo.name,
                    html_url: testRepo.html_url || '',
                    description: testRepo.description || '',
                    is_private: testRepo.private,
                    synced_at: now.toISOString(),
                  })
                  .select();

              if (testSaveError) {
                logError('[DEBUG] テスト保存エラー:', testSaveError);
                logError('[DEBUG] エラーコード:', testSaveError.code);
                logError('[DEBUG] エラー詳細:', testSaveError.details);
                logError('[DEBUG] エラーヒント:', testSaveError.hint);
              } else {
                logInfo(
                  `[DEBUG] テスト保存成功: ${JSON.stringify(testSaveResult)}`
                );
              }
            } else {
              logInfo('[DEBUG] テスト対象リポジトリの取得に失敗しました');
            }
          } else {
            logInfo('[DEBUG] テスト対象のプライベートリポジトリがありません');
          }
        } catch (e) {
          logError('[DEBUG] テスト保存中の例外:', e);
        }
      } else if (privateRepos.length > 0) {
        logInfo('[DEBUG] すべてのプライベートリポジトリが正常に保存されました');
      }
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
                  logError(`コミット詳細の取得に失敗: ${commit.sha}`, err);
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
            logError(`Error fetching commits for ${repo.name}:`, error);
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
            logError(
              `Error upserting contributions for date ${date}:`,
              upsertError
            );
          }
        })
      );
    }

    // すべての処理が完了したら成功と共にログを返す
    logSuccess('GitHub同期処理が完了しました');
    return { success: true, logs };
  } catch (error) {
    logError('GitHub同期中にエラーが発生', error);
    return { success: false, error, logs };
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

    // トークンの検証を行う
    const validation = await validateGitHubToken(
      settings.username,
      settings.accessToken
    );

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

    // 保存は成功したが、プライベートリポジトリへのアクセス権がない場合は警告を返す
    if (!validation.hasPrivateAccess) {
      return {
        success: true,
        warning:
          '設定を保存しましたが、このトークンではプライベートリポジトリにアクセスできません。プライベートリポジトリを含めるには、より広い権限を持つトークンが必要です。',
      };
    }

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

/**
 * GitHubアクセストークンの権限を検証する
 * プライベートリポジトリへのアクセスが可能か確認
 */
export async function validateGitHubToken(username: string, token: string) {
  try {
    const octokit = new Octokit({
      auth: token,
    });

    // 1. ユーザー情報を取得して認証を確認
    const { data: user } = await octokit.rest.users.getByUsername({
      username,
    });

    if (!user) {
      return {
        success: false,
        error: new Error('ユーザー情報の取得に失敗しました'),
        hasPrivateAccess: false,
      };
    }

    // 2. リポジトリ情報を取得
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      type: 'all',
      sort: 'updated',
      per_page: 100,
    });

    // プライベートリポジトリへのアクセス権があるか確認
    const hasPrivateRepos = repos.some((repo) => repo.private);

    // 3. 自分のプライベートリポジトリがない場合、追加検証
    if (!hasPrivateRepos) {
      try {
        // 認証ユーザー自身のリポジトリを取得（自分の場合のみ有効）
        const { data: authUserRepos } =
          await octokit.rest.repos.listForAuthenticatedUser({
            visibility: 'private',
            per_page: 5,
          });

        // プライベートリポジトリが取得できるか確認
        if (authUserRepos.length > 0) {
          return {
            success: true,
            hasPrivateAccess: true,
            message:
              'トークンは有効です。プライベートリポジトリへのアクセス権があります。',
          };
        }
      } catch (error) {
        console.error('プライベートリポジトリアクセス検証中にエラー:', error);
      }

      return {
        success: true,
        hasPrivateAccess: false,
        message:
          '警告: トークンはパブリックリポジトリのみ取得可能です。プライベートリポジトリを取得するには追加の権限が必要です。',
      };
    }

    return {
      success: true,
      hasPrivateAccess: true,
      message:
        'トークンは有効です。プライベートリポジトリへのアクセス権があります。',
    };
  } catch (error) {
    console.error('GitHub token validation error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error
          : new Error('トークン検証中にエラーが発生しました'),
      hasPrivateAccess: false,
    };
  }
}
