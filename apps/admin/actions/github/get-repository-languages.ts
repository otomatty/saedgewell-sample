'use server';

import type { RepositoryLanguages } from '../../types/ai';

/**
 * GitHubリポジトリの言語統計を取得する
 * @param owner リポジトリのオーナー名
 * @param repo リポジトリ名
 * @returns RepositoryLanguages 言語統計情報
 */
export async function getRepositoryLanguages(
  owner: string,
  repo: string
): Promise<RepositoryLanguages> {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (githubToken) {
      headers.Authorization = `token ${githubToken}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      {
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as RepositoryLanguages;
  } catch (error) {
    console.error('GitHubリポジトリの言語統計取得に失敗しました:', error);
    throw new Error('GitHubリポジトリの言語統計取得に失敗しました');
  }
}
