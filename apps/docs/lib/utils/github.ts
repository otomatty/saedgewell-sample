/**
 * GitHubのAPIからコミット履歴を取得するためのユーティリティ関数
 */

import { cache } from 'react';

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface CommitData {
  message: string;
  sha: string;
  date: string;
  authorName: string;
  authorLogin?: string;
  authorAvatar?: string;
  commitUrl: string;
  repoName?: string; // リポジトリ名を追加
  repoUrl?: string; // リポジトリURLを追加
}

/**
 * 指定された日付のGitHubコミット履歴を取得する
 * @param owner リポジトリのオーナー名
 * @param repo リポジトリ名
 * @param date 取得したい日付（YYYY-MM-DD形式）
 * @returns コミット情報の配列
 */
export const getCommitsByDate = cache(
  async (owner: string, repo: string, date: string): Promise<CommitData[]> => {
    try {
      // 指定日の00:00から23:59までのコミットを取得するために日付範囲を設定
      const startDate = new Date(`${date}T00:00:00Z`);
      const endDate = new Date(`${date}T23:59:59Z`);

      // GitHub APIのURLを構築
      const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${startDate.toISOString()}&until=${endDate.toISOString()}&per_page=100`;

      // GitHub APIにリクエスト
      // 注: GitHub APIはレート制限があるため、本番環境では認証トークンの使用が推奨されます
      const response = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          // 環境変数からGitHub Personal Access Tokenを取得（設定されている場合）
          ...(process.env.GITHUB_TOKEN
            ? {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
              }
            : {}),
        },
        // キャッシュ設定（1時間キャッシュ）
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status}`);
      }

      const commits: GitHubCommit[] = await response.json();

      // レスポンスを整形して返す
      return commits.map((commit) => ({
        message: commit.commit.message,
        sha: commit.sha,
        date: commit.commit.author.date,
        authorName: commit.commit.author.name,
        authorLogin: commit.author?.login,
        authorAvatar: commit.author?.avatar_url,
        commitUrl: commit.html_url,
        repoName: repo,
        repoUrl: `https://github.com/${owner}/${repo}`,
      }));
    } catch (error) {
      console.error('Error fetching GitHub commits:', error);
      return []; // エラー時は空配列を返す
    }
  }
);

/**
 * 指定されたリポジトリの最新のコミットを取得する
 * @param owner リポジトリのオーナー名
 * @param repo リポジトリ名
 * @param count 取得するコミット数（デフォルト: 10）
 * @returns コミット情報の配列
 */
export const getLatestCommits = cache(
  async (owner: string, repo: string, count = 10): Promise<CommitData[]> => {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${count}`;

      const response = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN
            ? {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
              }
            : {}),
        },
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status}`);
      }

      const commits: GitHubCommit[] = await response.json();

      return commits.map((commit) => ({
        message: commit.commit.message,
        sha: commit.sha,
        date: commit.commit.author.date,
        authorName: commit.commit.author.name,
        authorLogin: commit.author?.login,
        authorAvatar: commit.author?.avatar_url,
        commitUrl: commit.html_url,
        repoName: repo,
        repoUrl: `https://github.com/${owner}/${repo}`,
      }));
    } catch (error) {
      console.error('Error fetching GitHub latest commits:', error);
      return [];
    }
  }
);

/**
 * 指定されたユーザーの所属するリポジトリ一覧を取得
 * @param username GitHubユーザー名
 * @returns リポジトリ情報の配列
 */
export const getUserRepositories = cache(
  async (username: string): Promise<GitHubRepo[]> => {
    try {
      // ユーザーの所属リポジトリを取得するAPI
      const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

      const response = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN
            ? {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
              }
            : {}),
        },
        next: { revalidate: 3600 * 24 }, // 24時間キャッシュ
      });

      if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching repositories for user ${username}:`, error);
      return [];
    }
  }
);

/**
 * 指定されたユーザーの特定日のコミット情報を全リポジトリから取得
 * @param username GitHubユーザー名
 * @param date 取得したい日付（YYYY-MM-DD形式）
 * @returns すべてのリポジトリのコミット情報を結合した配列
 */
export const getUserCommitsByDate = cache(
  async (username: string, date: string): Promise<CommitData[]> => {
    try {
      // まずユーザーのリポジトリ一覧を取得
      const repos = await getUserRepositories(username);

      // 各リポジトリのコミット情報を並行して取得
      const commitsPromises = repos.map(async (repo) => {
        const owner = repo.owner.login;
        const repoName = repo.name;

        return await getCommitsByDate(owner, repoName, date);
      });

      // すべてのコミット情報を待機して結合
      const commitsArrays = await Promise.all(commitsPromises);
      const allCommits = commitsArrays.flat();

      // 日付でソート（新しい順）
      allCommits.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return allCommits;
    } catch (error) {
      console.error(
        `Error fetching all commits for user ${username} on ${date}:`,
        error
      );
      return [];
    }
  }
);

/**
 * 特定のユーザーが所属する組織のリポジトリを取得
 * @param username GitHubユーザー名
 * @returns 組織のリポジトリ情報の配列
 */
export const getUserOrganizationRepositories = cache(
  async (username: string): Promise<GitHubRepo[]> => {
    try {
      // ユーザーの所属組織を取得
      const orgUrl = `https://api.github.com/users/${username}/orgs`;

      const orgResponse = await fetch(orgUrl, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN
            ? {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
              }
            : {}),
        },
        next: { revalidate: 3600 * 24 }, // 24時間キャッシュ
      });

      if (!orgResponse.ok) {
        throw new Error(`GitHub API request failed: ${orgResponse.status}`);
      }

      const orgs = await orgResponse.json();

      // 各組織のリポジトリを取得
      const repoPromises = orgs.map(async (org: { login: string }) => {
        const repoUrl = `https://api.github.com/orgs/${org.login}/repos?per_page=100`;

        const repoResponse = await fetch(repoUrl, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            ...(process.env.GITHUB_TOKEN
              ? {
                  Authorization: `token ${process.env.GITHUB_TOKEN}`,
                }
              : {}),
          },
          next: { revalidate: 3600 * 24 },
        });

        if (!repoResponse.ok) {
          console.error(`Failed to fetch repos for org ${org.login}`);
          return [];
        }

        return await repoResponse.json();
      });

      // すべての組織リポジトリを結合
      const allOrgRepos = await Promise.all(repoPromises);
      return allOrgRepos.flat();
    } catch (error) {
      console.error(
        `Error fetching organization repositories for user ${username}:`,
        error
      );
      return [];
    }
  }
);

/**
 * ユーザーの個人リポジトリと組織リポジトリを含むすべてのリポジトリから特定日のコミットを取得
 * @param username GitHubユーザー名
 * @param date 取得したい日付（YYYY-MM-DD形式）
 * @returns すべてのリポジトリのコミット情報
 */
export const getAllUserCommitsByDate = cache(
  async (username: string, date: string): Promise<CommitData[]> => {
    try {
      // 個人リポジトリと組織リポジトリの両方を取得
      const personalRepos = await getUserRepositories(username);
      const orgRepos = await getUserOrganizationRepositories(username);

      // 重複を排除するため、リポジトリのfull_nameをキーとしたマップを作成
      const uniqueRepos = new Map<string, GitHubRepo>();

      for (const repo of [...personalRepos, ...orgRepos]) {
        uniqueRepos.set(repo.full_name, repo);
      }

      // 各リポジトリからコミットを取得
      const commitsPromises = Array.from(uniqueRepos.values()).map(
        async (repo) => {
          const owner = repo.owner.login;
          const repoName = repo.name;

          const commits = await getCommitsByDate(owner, repoName, date);

          // ユーザーが作成したコミットのみをフィルタリング
          return commits.filter(
            (commit) =>
              commit.authorLogin?.toLowerCase() === username.toLowerCase() ||
              commit.authorName.toLowerCase().includes(username.toLowerCase())
          );
        }
      );

      // すべてのコミット情報を待機して結合
      const commitsArrays = await Promise.all(commitsPromises);
      const allCommits = commitsArrays.flat();

      // 日付でソート（新しい順）
      allCommits.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return allCommits;
    } catch (error) {
      console.error(
        `Error fetching all user commits for ${username} on ${date}:`,
        error
      );
      return [];
    }
  }
);
