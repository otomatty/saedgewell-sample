/**
 * GitHub API関連の処理モジュール
 */

import axios, { type AxiosResponse } from 'axios';
import { graphql } from '@octokit/graphql';
import type { GraphQlQueryResponseData } from '@octokit/graphql';
import type {
  CommitData,
  GitHubCommit,
  GitHubOrg,
  GitHubRepo,
} from './types.js';
import { logger } from './logger.js';
import { getExcludedRepositories } from './repo-mappings.js';

/**
 * GitHubのAPIリクエストに共通のヘッダーを追加する
 * @returns 共通ヘッダーを含むオブジェクト
 */
function getGitHubHeaders() {
  const token = process.env.GITHUB_TOKEN;

  // トークンの有無をログ出力
  if (!token) {
    logger.warn(
      'GITHUB_TOKENが設定されていません。API制限が厳しく適用されます。'
    );
    logger.warn(
      '環境変数GITHUB_TOKENを設定するか、.env.localファイルに追加してください。'
    );
    logger.warn(
      '例: export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    );
  } else {
    logger.debug('GITHUB_TOKENを使用してGitHub APIにリクエストします。');
    // トークンの最初の数文字だけをログに出力（セキュリティのため）
    if (token.length > 8) {
      const maskedToken = `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
      logger.debug(`トークン: ${maskedToken}`);

      // トークンタイプの推測
      if (token.startsWith('ghp_')) {
        logger.debug(
          'トークンタイプ: 古い形式のパーソナルアクセストークン (PAT)'
        );
      } else if (token.startsWith('github_pat_')) {
        logger.debug(
          'トークンタイプ: 新しい形式の細かな権限を持つPAT (fine-grained PAT)'
        );
      } else if (token.startsWith('gho_')) {
        logger.debug('トークンタイプ: OAuth App トークン');
      } else if (token.startsWith('ghu_')) {
        logger.debug('トークンタイプ: GitHub App ユーザートークン');
      } else if (token.startsWith('ghs_')) {
        logger.debug('トークンタイプ: GitHub App サーバートークン');
      } else {
        logger.debug('トークンタイプ: 不明');
      }
    }
  }

  // トークンが古い形式かどうかを確認し、適切な認証ヘッダーを返す
  if (token) {
    if (token.startsWith('github_pat_')) {
      // Fine-grained PAT (新形式)の場合はBearerを使用
      return { Authorization: `Bearer ${token}` };
    }
    // 従来のPAT (旧形式)の場合はtokenを使用
    return { Authorization: `token ${token}` };
  }

  return {};
}

/**
 * レート制限情報をログに出力
 * @param headers レスポンスヘッダー
 * @param prefix ログのプレフィックス
 */
function logRateLimitInfo(
  headers: Record<string, string | undefined>,
  prefix = ''
): void {
  const rateLimit = {
    limit: headers['x-ratelimit-limit'],
    remaining: headers['x-ratelimit-remaining'],
    reset: headers['x-ratelimit-reset']
      ? new Date(Number(headers['x-ratelimit-reset']) * 1000).toLocaleString()
      : 'N/A',
    used: headers['x-ratelimit-used'],
    resource: headers['x-ratelimit-resource'],
  };

  logger.debug(`${prefix}APIレート制限状況:`, rateLimit);

  // 残り回数が少ない場合は警告
  const remaining = Number(rateLimit.remaining);
  if (remaining < 20) {
    logger.warn(
      `GitHubのAPIレート制限が残り${remaining}回です。制限リセット時間: ${rateLimit.reset}`
    );
  }
}

/**
 * GitHubのAPIエラーを処理する
 * @param error Axiosエラーオブジェクト
 * @param operation 実行中の操作の説明
 */
function handleGitHubApiError(error: unknown, operation: string): void {
  logger.error(`${operation}中にエラーが発生しました`);

  if (axios.isAxiosError(error)) {
    // エラーの詳細情報を表示
    const status = error.response?.status || 'N/A';
    logger.error(`ステータスコード: ${status}`);
    logger.error(`エラーメッセージ: ${error.message}`);
    logger.error(`リクエストURL: ${error.config?.url || 'N/A'}`);
    logger.error(
      `リクエストメソッド: ${error.config?.method?.toUpperCase() || 'N/A'}`
    );

    // リクエストヘッダー情報（トークンは隠す）
    if (error.config?.headers) {
      const headers = { ...error.config.headers };
      if (headers.Authorization) {
        headers.Authorization = '********';
      }
      logger.debug('リクエストヘッダー:', headers);
    }

    // リクエストパラメータ
    if (error.config?.params) {
      logger.debug('リクエストパラメータ:', error.config.params);
    }

    // レスポンスヘッダーからレート制限情報を取得
    const headers = error.response?.headers;
    if (headers) {
      logRateLimitInfo(
        headers as Record<string, string | undefined>,
        'エラー時の'
      );

      // 403エラーの詳細検査
      if (status === 403) {
        const remaining = Number(headers['x-ratelimit-remaining']);

        if (remaining === 0) {
          logger.error(
            `APIレート制限に達しました。制限リセット時間: ${new Date(
              Number(headers['x-ratelimit-reset']) * 1000
            ).toLocaleString()}`
          );
          logger.error(
            'トークンを設定するか、既存のトークンを確認してください。無料アカウントの場合、時間あたりのリクエスト数に制限があります。'
          );
        } else {
          logger.error(
            'アクセス権限がないか、トークンの権限が不足している可能性があります。'
          );
          logger.error(
            'トークンに以下の権限があることを確認してください: repo (プライベートリポジトリにアクセスする場合)、public_repo (パブリックリポジトリのみの場合)'
          );
        }

        // 認証関連のヘッダーを確認
        if (headers['www-authenticate']) {
          logger.error(`認証情報: ${headers['www-authenticate']}`);
        }
      }
    }

    // レスポンスボディがある場合は表示
    if (error.response?.data) {
      logger.error('エラーレスポンス詳細:', error.response.data);

      // GitHubのエラーメッセージを詳細に表示
      if (
        typeof error.response.data === 'object' &&
        error.response.data !== null
      ) {
        const data = error.response.data as {
          message?: string;
          documentation_url?: string;
        };
        if (data.message) {
          logger.error(`GitHubエラーメッセージ: ${data.message}`);
        }
        if (data.documentation_url) {
          logger.error(`詳細ドキュメント: ${data.documentation_url}`);
        }
      }
    }
  } else if (error instanceof Error) {
    logger.error(error.message);
    if (error.stack) {
      logger.debug(error.stack);
    }
  } else {
    logger.error('不明なエラーが発生しました:', error);
  }

  // 問題解決のためのヒントを表示
  logger.info('問題を解決するためのヒント:');
  logger.info('1. GITHUB_TOKENが正しく設定されているか確認してください');
  logger.info('2. トークンが有効で、必要な権限があるか確認してください');
  logger.info('3. 指定したユーザー/リポジトリが存在するか確認してください');
  logger.info('4. ネットワーク接続を確認してください');
  logger.info(
    '5. --debug オプションを使用して詳細なデバッグ情報を表示できます'
  );
}

/**
 * APIリクエスト成功時の共通処理
 * @param response APIレスポンス
 * @param operation 操作の説明
 * @param message 成功メッセージ
 */
function handleSuccessResponse<T>(
  response: AxiosResponse<T[]>,
  operation: string,
  message: string
): void {
  // レート制限情報をログに記録
  logRateLimitInfo(
    response.headers as Record<string, string | undefined>,
    '成功時の'
  );
  logger.debug(`${operation}が成功しました。${message}`);
}

// キャッシュ用の変数
const repoCache: Record<string, GitHubRepo[]> = {};
const orgCache: Record<string, GitHubOrg[]> = {};

/**
 * 並列タスク実行の型定義
 */
type TaskFunction<T, R> = (item: T, index: number) => Promise<R>;

/**
 * 指定数の並列タスクを実行するユーティリティ関数
 * @param items 処理する項目の配列
 * @param concurrency 同時実行最大数
 * @param fn 各項目に対して実行する関数
 * @returns 結果の配列
 */
async function runWithConcurrencyLimit<T, R>(
  items: T[],
  concurrency: number,
  fn: TaskFunction<T, R>
): Promise<R[]> {
  // 処理対象がなければ空配列を返す
  if (items.length === 0) return [];

  // 結果を格納する配列（元の順序を保持）
  const results: R[] = new Array(items.length);

  // チャンクに分割して実行
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    chunks.push(items.slice(i, i + concurrency));
  }

  let itemIndex = 0;
  for (const chunk of chunks) {
    // 現在のチャンクを並列処理
    const promises = chunk.map((item, index) => {
      const currentIndex = itemIndex + index;
      return (async () => {
        try {
          results[currentIndex] = await fn(item, currentIndex);
        } catch (error) {
          logger.error(
            `タスク ${currentIndex} の処理中にエラーが発生しました:`,
            error
          );
          // エラーを再スローしない（処理を継続）
        }
      })();
    });

    // 現在のチャンクが完了するまで待機
    await Promise.all(promises);
    itemIndex += chunk.length;
  }

  // undefinedを除去（エラーが発生した場合）
  return results.filter((item) => item !== undefined) as R[];
}

/**
 * ユーザーのリポジトリ一覧を取得
 * @param username GitHubユーザー名
 * @param options オプション設定
 * @returns リポジトリ情報の配列
 */
export async function getUserRepositories(
  username: string,
  options: { filterExcluded?: boolean } = { filterExcluded: true }
): Promise<GitHubRepo[]> {
  // キャッシュチェック
  if (repoCache[username] && !options.filterExcluded) {
    logger.debug(`キャッシュからユーザー${username}のリポジトリ情報を使用`);
    return repoCache[username];
  }

  const operation = `ユーザー${username}のリポジトリ取得`;
  try {
    logger.debug(`${operation}を開始します`);

    const headers = getGitHubHeaders();
    const url = `https://api.github.com/users/${username}/repos`;

    logger.debug(`APIリクエスト: GET ${url}`);

    // 通常のユーザーリポジトリ取得
    const response = await axios.get<GitHubRepo[]>(url, {
      headers,
      params: {
        per_page: 100,
        sort: 'updated',
        type: 'all', // all: 全てのリポジトリ（パブリック+プライベート）を取得
      },
    });

    handleSuccessResponse(
      response,
      operation,
      `${response.data.length}件のリポジトリを取得しました。`
    );

    // プライベートリポジトリが含まれているか確認
    const hasPrivateRepos = response.data.some((repo) => repo.private);
    logger.debug(
      `取得したリポジトリにプライベートリポジトリが含まれているか: ${hasPrivateRepos ? 'はい' : 'いいえ'}`
    );

    // 自分自身のリポジトリを取得している場合は、別のエンドポイントも試す
    if (!hasPrivateRepos) {
      try {
        // 認証ユーザー自身のリポジトリを取得（自分の場合のみ有効）
        const authenticatedUserReposUrl = 'https://api.github.com/user/repos';
        logger.debug(
          `認証ユーザーのリポジトリ取得: GET ${authenticatedUserReposUrl}`
        );

        const userResponse = await axios.get<GitHubRepo[]>(
          authenticatedUserReposUrl,
          {
            headers,
            params: {
              per_page: 100,
              sort: 'updated',
              visibility: 'all', // all, public, private
            },
          }
        );

        // 指定されたユーザーに属するリポジトリのみをフィルタリング
        const ownRepos = userResponse.data.filter(
          (repo) => repo.owner.login.toLowerCase() === username.toLowerCase()
        );

        if (ownRepos.length > 0) {
          const privateOwnRepos = ownRepos.filter((repo) => repo.private);
          if (privateOwnRepos.length > 0) {
            logger.info(
              `認証ユーザーとして${privateOwnRepos.length}件のプライベートリポジトリを発見しました。`
            );

            // 重複を避けるためにマージ
            const allRepos = [...response.data];
            for (const repo of ownRepos) {
              if (!allRepos.some((r) => r.id === repo.id)) {
                allRepos.push(repo);
              }
            }

            // 結果をキャッシュ
            repoCache[username] = allRepos;

            // 除外フィルタが有効な場合は、サンプルリポジトリを除外
            if (options.filterExcluded) {
              const excludedRepos = await getExcludedRepositories();
              const filteredRepos = allRepos.filter(
                (repo) => !excludedRepos.includes(repo.name)
              );
              logger.info(
                `除外フィルタにより${allRepos.length - filteredRepos.length}件のサンプルリポジトリを除外しました。`
              );
              return filteredRepos;
            }

            return allRepos;
          }
        }
      } catch (additionalError) {
        // エラーは記録するが、元のレスポンスは返す
        logger.warn(
          '追加のリポジトリ取得中にエラーが発生しましたが、処理を継続します。'
        );
        handleGitHubApiError(additionalError, `追加の${operation}`);
      }
    }

    // 結果をキャッシュ
    repoCache[username] = response.data;

    // 除外フィルタが有効な場合は、サンプルリポジトリを除外
    if (options.filterExcluded) {
      const excludedRepos = await getExcludedRepositories();
      const filteredRepos = response.data.filter(
        (repo) => !excludedRepos.includes(repo.name)
      );
      logger.info(
        `除外フィルタにより${response.data.length - filteredRepos.length}件のサンプルリポジトリを除外しました。`
      );
      return filteredRepos;
    }

    return response.data;
  } catch (error) {
    handleGitHubApiError(error, operation);
    return [];
  }
}

/**
 * ユーザーの所属組織を取得する
 * @param username GitHubユーザー名
 * @returns 組織情報の配列
 */
export async function getUserOrganizations(
  username: string
): Promise<GitHubOrg[]> {
  // キャッシュチェック
  if (orgCache[username]) {
    logger.debug(`キャッシュからユーザー${username}の組織情報を使用`);
    return orgCache[username];
  }

  const operation = `ユーザー${username}の所属組織取得`;
  try {
    logger.debug(`${operation}を開始します`);

    const headers = getGitHubHeaders();
    const url = `https://api.github.com/users/${username}/orgs`;

    logger.debug(`APIリクエスト: GET ${url}`);

    const response = await axios.get<GitHubOrg[]>(url, {
      headers,
      params: {
        per_page: 100,
      },
    });

    handleSuccessResponse(
      response,
      operation,
      `${response.data.length}件の組織を取得しました。`
    );

    // 結果をキャッシュして返す
    orgCache[username] = response.data;
    return response.data;
  } catch (error) {
    handleGitHubApiError(error, operation);
    return [];
  }
}

/**
 * 組織のリポジトリを取得する
 * @param orgName 組織名
 * @returns リポジトリ情報の配列
 */
export async function getOrganizationRepositories(
  orgName: string
): Promise<GitHubRepo[]> {
  const operation = `組織${orgName}のリポジトリ取得`;
  try {
    logger.debug(`${operation}を開始します`);

    const headers = getGitHubHeaders();
    const url = `https://api.github.com/orgs/${orgName}/repos`;

    logger.debug(`APIリクエスト: GET ${url}`);

    // まずデフォルトパラメータでリクエスト
    const response = await axios.get<GitHubRepo[]>(url, {
      headers,
      params: {
        per_page: 100,
        sort: 'updated',
        type: 'all', // all: 組織の全てのリポジトリ（パブリック+プライベート）を取得
      },
    });

    handleSuccessResponse(
      response,
      operation,
      `${response.data.length}件のリポジトリを取得しました。`
    );

    // レスポンスにプライベートリポジトリが含まれているか確認
    const hasPrivateRepos = response.data.some((repo) => repo.private);
    logger.debug(
      `取得したリポジトリにプライベートリポジトリが含まれているか: ${hasPrivateRepos}`
    );

    // プライベートリポジトリが含まれていなければ別のエンドポイントも試す
    if (!hasPrivateRepos && response.data.length > 0) {
      logger.info(
        'プライベートリポジトリが見つかりませんでした。別の方法を試みます...'
      );
      try {
        // 認証ユーザーの視点からアクセス可能な全リポジトリを取得
        const userReposUrl = 'https://api.github.com/user/repos';
        logger.debug(`追加APIリクエスト: GET ${userReposUrl}`);

        const userResponse = await axios.get<GitHubRepo[]>(userReposUrl, {
          headers,
          params: {
            per_page: 100,
            sort: 'updated',
            affiliation: 'organization_member', // 組織メンバーとしてアクセスできるリポジトリ
          },
        });

        // 指定された組織に属するリポジトリのみをフィルタリング
        const additionalOrgRepos = userResponse.data.filter(
          (repo) => repo.owner.login === orgName && repo.private
        );

        if (additionalOrgRepos.length > 0) {
          logger.info(
            `追加で${additionalOrgRepos.length}件のプライベートリポジトリを発見しました。`
          );
          // 重複を避けるためにマージ
          const allRepos = [...response.data];
          for (const repo of additionalOrgRepos) {
            if (!allRepos.some((r) => r.id === repo.id)) {
              allRepos.push(repo);
            }
          }
          return allRepos;
        }
      } catch (additionalError) {
        // エラーは記録するが、元のレスポンスは返す
        logger.warn(
          '追加のリポジトリ取得中にエラーが発生しましたが、処理を継続します。'
        );
        handleGitHubApiError(additionalError, `追加の${operation}`);
      }
    }

    return response.data;
  } catch (error) {
    handleGitHubApiError(error, operation);
    return [];
  }
}

/**
 * 特定の日付範囲のコミットを取得する（GraphQL APIを使用）
 * @param owner リポジトリ所有者
 * @param repo リポジトリ名
 * @param startDate 開始日（YYYY-MM-DD形式）
 * @param endDate 終了日（YYYY-MM-DD形式）
 * @returns コミット情報の配列
 */
export async function getCommitsForDateRange(
  owner: string,
  repo: string,
  startDate: string,
  endDate: string
): Promise<CommitData[]> {
  const operation = `${startDate}から${endDate}までの${owner}/${repo}のコミット取得 (GraphQL)`;
  try {
    logger.debug(`${operation}を開始します`);

    const headers = getGitHubHeaders();
    if (!headers.Authorization) {
      logger.error(
        'GitHubトークンが必要です。GraphQL APIは認証なしでは使用できません。'
      );
      return [];
    }

    // GraphQLクライアントを初期化
    const graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: headers.Authorization,
      },
    });

    // 日付範囲の設定（UTC）- GraphQLはISO 8601形式の文字列を期待
    const since = new Date(`${startDate}T00:00:00Z`).toISOString();
    const until = new Date(`${endDate}T23:59:59Z`).toISOString();

    // コミット情報を取得するためのGraphQLクエリ
    // `defaultBranchRef` を使用してデフォルトブランチの履歴を取得
    // ページネーションのために `after` カーソルを使用
    const query = `
      query GetCommits($owner: String!, $repo: String!, $since: GitTimestamp!, $until: GitTimestamp!, $cursor: String) {
        repository(owner: $owner, name: $repo) {
          defaultBranchRef {
            target {
              ... on Commit {
                history(since: $since, until: $until, first: 100, after: $cursor) {
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                  nodes {
                    oid
                    message
                    committedDate
                    author {
                      name
                      user {
                        login
                        avatarUrl
                      }
                    }
                    url
                    additions
                    deletions
                    repository {
                      name
                      owner {
                        login
                      }
                      url
                    }
                  }
                }
              }
            }
          }
        }
        rateLimit {
          limit
          cost
          remaining
          resetAt
        }
      }
    `;

    const allCommits: CommitData[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      logger.debug(
        `GraphQLクエリ実行: owner=${owner}, repo=${repo}, since=${since}, until=${until}, cursor=${cursor}`
      );

      // GraphQLクエリの実行とレスポンスの型付け
      interface GitHubGraphQLResponse {
        repository?: {
          defaultBranchRef?: {
            target?: {
              history?: {
                pageInfo: {
                  hasNextPage: boolean;
                  endCursor: string | null;
                };
                nodes: Array<{
                  oid: string;
                  message: string;
                  committedDate: string;
                  author: {
                    name: string;
                    user?: {
                      login: string;
                      avatarUrl: string;
                    } | null;
                  };
                  url: string;
                  additions: number;
                  deletions: number;
                  repository: {
                    name: string;
                    owner: {
                      login: string;
                    };
                    url: string;
                  };
                }> | null;
              };
            };
          };
        };
        rateLimit?: {
          limit: number;
          cost: number;
          remaining: number;
          resetAt: string;
        };
      }

      const response: GitHubGraphQLResponse =
        await graphqlWithAuth<GitHubGraphQLResponse>(query, {
          owner,
          repo,
          since,
          until,
          cursor,
        });

      const repository = response.repository;
      const rateLimit = response.rateLimit;

      // レート制限情報をログに出力 (GraphQL用)
      logger.debug('GraphQL APIレート制限状況:', {
        limit: rateLimit?.limit,
        cost: rateLimit?.cost,
        remaining: rateLimit?.remaining,
        resetAt: rateLimit?.resetAt
          ? new Date(rateLimit.resetAt).toLocaleString()
          : 'N/A',
      });
      if (rateLimit && rateLimit.remaining < 20) {
        logger.warn(
          `GitHub GraphQL APIのレート制限が残り${rateLimit.remaining}です。リセット時間: ${new Date(rateLimit.resetAt).toLocaleString()}`
        );
      }

      // デフォルトブランチや履歴が存在しない場合のハンドリング
      const history = repository?.defaultBranchRef?.target?.history;
      if (!history || !history.nodes) {
        logger.debug(
          `${owner}/${repo} には指定期間のコミットが見つかりませんでした。`
        );
        hasNextPage = false; // 履歴がない場合はループを抜ける
        continue;
      }

      // コミットデータを CommitData 形式に変換して追加
      type CommitNode = {
        oid: string;
        message: string;
        committedDate: string;
        author: {
          name: string;
          user?: {
            login: string;
            avatarUrl: string;
          } | null;
        };
        url: string;
        additions: number;
        deletions: number;
        repository: {
          name: string;
          owner: {
            login: string;
          };
          url: string;
        };
      };

      const commits = history.nodes.map(
        (commit: CommitNode): CommitData => ({
          message: commit.message,
          sha: commit.oid,
          date: commit.committedDate, // ISO 8601形式のまま
          authorName: commit.author.name,
          authorLogin: commit.author.user?.login ?? null, // userがnullの場合がある
          authorAvatar: commit.author.user?.avatarUrl ?? null, // userがnullの場合がある
          commitUrl: commit.url,
          repoName: commit.repository.name,
          repoOwner: commit.repository.owner.login,
          repoUrl: commit.repository.url,
          additions: commit.additions,
          deletions: commit.deletions,
        })
      );
      allCommits.push(...commits);

      // ページネーション情報を更新
      hasNextPage = history.pageInfo.hasNextPage;
      cursor = history.pageInfo.endCursor;

      logger.debug(
        `${commits.length}件のコミットを取得。次のページ: ${hasNextPage}`
      );
    }

    logger.info(
      `${operation}が成功しました。合計${allCommits.length}件のコミットを取得しました。`
    );
    return allCommits;
  } catch (error: unknown) {
    logger.error(`${operation}中にエラーが発生しました`);
    // GraphQLのエラーをより詳細にログ出力
    if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>;
      if (err.request) {
        logger.error('GraphQL リクエスト:', err.request);
      }
      if (err.response) {
        logger.error('GraphQL レスポンス:', err.response);
      }
      if (err.errors) {
        logger.error('GraphQL エラー詳細:', err.errors);
      }
    }

    // 既存のエラーハンドラも呼び出す
    handleGitHubApiError(error, operation);
    return []; // エラー時は空配列を返す
  }
}

/**
 * 特定のリポジトリの特定日のコミットを取得する
 * @param date 日付（YYYY-MM-DD形式）
 * @param owner リポジトリ所有者
 * @param repo リポジトリ名
 * @returns コミット情報の配列
 */
export async function getCommitsForDate(
  date: string,
  owner: string,
  repo: string
): Promise<CommitData[]> {
  // 単一日の場合は日付範囲用関数を呼び出す
  return getCommitsForDateRange(owner, repo, date, date);
}

/**
 * ユーザーの全リポジトリから特定の日付範囲のコミットを取得する
 * @param startDate 開始日（YYYY-MM-DD形式）
 * @param endDate 終了日（YYYY-MM-DD形式）
 * @param username GitHubユーザー名
 * @param options オプション設定
 * @returns 日付ごとのコミット情報オブジェクト
 */
export async function getAllUserCommitsForDateRange(
  startDate: string,
  endDate: string,
  username: string,
  options: { filterExcluded?: boolean } = { filterExcluded: true }
): Promise<Record<string, CommitData[]>> {
  logger.info(
    `${startDate}から${endDate}までの${username}のコミット情報を取得中...`
  );

  // 除外フィルタの適用状態をログ出力
  if (options.filterExcluded) {
    logger.info('サンプルリポジトリ除外フィルタが有効です。');
  }

  // ユーザーのリポジトリを1回だけ取得（キャッシュ機能により重複取得を防止）
  const userRepos = await getUserRepositories(username, {
    filterExcluded: options.filterExcluded,
  });
  logger.info(
    `${username}の個人リポジトリを${userRepos.length}件発見しました。`
  );

  // ユーザーの所属組織を取得
  const userOrgs = await getUserOrganizations(username);
  logger.info(`${username}の所属組織を${userOrgs.length}件発見しました。`);

  // 組織のリポジトリを取得
  const orgRepos: GitHubRepo[] = [];

  // 組織のリポジトリ取得を並列化
  const MAX_CONCURRENT_ORG_REQUESTS = 3;
  if (userOrgs.length > 0) {
    await runWithConcurrencyLimit(
      userOrgs,
      MAX_CONCURRENT_ORG_REQUESTS,
      async (org) => {
        try {
          const repos = await getOrganizationRepositories(org.login);
          // 除外フィルタが有効な場合は適用
          if (options.filterExcluded) {
            const excludedRepos = await getExcludedRepositories();
            const filteredRepos = repos.filter(
              (repo) => !excludedRepos.includes(repo.name)
            );
            orgRepos.push(...filteredRepos);
            if (repos.length !== filteredRepos.length) {
              logger.info(
                `組織${org.login}から${repos.length - filteredRepos.length}件のサンプルリポジトリを除外しました。`
              );
            }
            logger.info(
              `組織${org.login}のリポジトリを${filteredRepos.length}件発見しました。`
            );
            return filteredRepos;
          }
          // フィルタなしの場合はそのまま追加
          orgRepos.push(...repos);
          logger.info(
            `組織${org.login}のリポジトリを${repos.length}件発見しました。`
          );
          return repos;
        } catch (error) {
          logger.warn(
            `組織${org.login}のリポジトリ取得中にエラーが発生しましたが、処理を継続します。`
          );
          return [];
        }
      }
    );
  }

  // 重複を排除してリポジトリを結合
  const allRepos: GitHubRepo[] = [];
  const repoIds = new Set<number>();

  // ユーザーリポジトリを追加
  for (const repo of userRepos) {
    if (!repoIds.has(repo.id)) {
      allRepos.push(repo);
      repoIds.add(repo.id);
    }
  }

  // 組織リポジトリを追加
  for (const repo of orgRepos) {
    if (!repoIds.has(repo.id)) {
      allRepos.push(repo);
      repoIds.add(repo.id);
    }
  }

  logger.info(`合計${allRepos.length}個のユニークなリポジトリを発見しました。`);

  // 日付ごとのコミットを格納するオブジェクト
  const commitsByDate: Record<string, CommitData[]> = {};

  // リポジトリごとにコミットを取得（並列処理）
  const MAX_CONCURRENT_REPO_REQUESTS = 5;
  await runWithConcurrencyLimit(
    allRepos,
    MAX_CONCURRENT_REPO_REQUESTS,
    async (repo, index) => {
      try {
        logger.info(
          `[${index + 1}/${allRepos.length}] ${repo.full_name}のコミットを取得中...`
        );

        // 日付範囲内のコミットを取得
        const commitsInRange = await getCommitsForDateRange(
          repo.owner.login,
          repo.name,
          startDate,
          endDate
        );

        // 日付ごとにコミットを振り分け
        for (const commit of commitsInRange) {
          const commitDate = commit.date.substring(0, 10); // YYYY-MM-DD形式
          if (!commitsByDate[commitDate]) {
            commitsByDate[commitDate] = [];
          }
          commitsByDate[commitDate].push(commit);
        }

        logger.info(
          `${repo.full_name}から${commitsInRange.length}件のコミットを取得しました。`
        );
        return commitsInRange;
      } catch (error) {
        logger.warn(
          `${repo.full_name}のコミット取得中にエラーが発生しましたが、処理を継続します。`
        );
        return [];
      }
    }
  );

  // 結果の集計
  let totalCommits = 0;
  for (const date in commitsByDate) {
    totalCommits += commitsByDate[date].length;
    logger.info(`${date}: ${commitsByDate[date].length}件のコミットを発見`);
  }

  logger.info(
    `${startDate}から${endDate}までの期間で${totalCommits}件のコミットを発見しました。`
  );

  return commitsByDate;
}

/**
 * ユーザーのすべてのリポジトリから特定日のコミットを取得する
 * @param date 日付（YYYY-MM-DD形式）
 * @param username GitHubユーザー名
 * @param options オプション設定
 * @returns コミット情報の配列
 */
export async function getAllUserCommitsForDate(
  date: string,
  username: string,
  options: { filterExcluded?: boolean } = { filterExcluded: true }
): Promise<CommitData[]> {
  // 日付範囲関数を呼び出して単一日のコミットを取得
  const commitsByDate = await getAllUserCommitsForDateRange(
    date,
    date,
    username,
    options
  );

  // 指定日のコミットのみを返す
  return commitsByDate[date] || [];
}

/**
 * トークンのスコープを確認する
 * @returns 成功した場合はスコープの配列、失敗した場合は空配列
 */
export async function checkTokenScope(): Promise<string[]> {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return [];
    }

    const headers = getGitHubHeaders();
    // GitHub API v3のUser endpointを使ってトークンの権限を確認
    const response = await axios.get('https://api.github.com/user', {
      headers,
    });

    // レスポンスヘッダーからスコープ情報を取得
    const scopeHeader = response.headers['x-oauth-scopes'] as string;
    if (scopeHeader) {
      const scopes = scopeHeader.split(',').map((s) => s.trim());
      logger.info(`トークンのスコープ: ${scopes.join(', ')}`);

      // プライベートリポジトリアクセス権限があるか確認
      const hasRepoScope = scopes.includes('repo');
      const hasPrivateRepoAccess =
        hasRepoScope || scopes.some((s) => s.includes('repo:'));

      if (hasPrivateRepoAccess) {
        logger.info(
          '✅ トークンにはプライベートリポジトリへのアクセス権限があります'
        );
      } else {
        logger.warn(
          '⚠️ トークンにはプライベートリポジトリへのアクセス権限がありません'
        );
        logger.warn('パブリックリポジトリのみ取得可能です');
      }

      return scopes;
    }
    return [];
  } catch (error) {
    logger.warn('トークンのスコープ確認中にエラーが発生しました');
    if (axios.isAxiosError(error) && error.response) {
      logger.warn(`ステータスコード: ${error.response.status}`);
      if (error.response.status === 401) {
        logger.error('トークンが無効または期限切れの可能性があります');
      }
    }
    return [];
  }
}
