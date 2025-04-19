'use server';

import type { RepositoryReadme } from '../../types/ai';

/**
 * GitHubリポジトリのREADMEを取得する
 * @param owner リポジトリのオーナー名
 * @param repo リポジトリ名
 * @returns RepositoryReadme READMEの内容
 */
export async function getRepositoryReadme(
  owner: string,
  repo: string
): Promise<RepositoryReadme | null> {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (githubToken) {
      headers.Authorization = `token ${githubToken}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers,
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`README not found for ${owner}/${repo}`);
        return null;
      }
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Base64でエンコードされた内容をデコード
    let content = '';
    if (data.encoding === 'base64') {
      content = Buffer.from(data.content, 'base64').toString('utf-8');
    } else {
      content = data.content;
    }

    return {
      content,
      encoding: data.encoding,
      html_url: data.html_url,
    };
  } catch (error) {
    console.error('GitHubリポジトリのREADME取得に失敗しました:', error);
    throw new Error('GitHubリポジトリのREADME取得に失敗しました');
  }
}
