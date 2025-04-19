'use server';

/**
 * GitHubリポジトリの詳細情報を取得する
 * @param repositoryUrl GitHubリポジトリのURL
 * @returns リポジトリの詳細情報
 */
export async function getRepositoryDetails(repositoryUrl: string): Promise<{
  owner: string;
  name: string;
  description: string | null;
  url: string;
}> {
  try {
    // GitHubのURL形式からオーナーとリポジトリ名を抽出
    const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('有効なGitHubリポジトリURLではありません');
    }

    const owner = match[1];
    const name = match[2]?.replace(/\.git$/, '') || '';

    if (!owner || !name) {
      throw new Error(
        'リポジトリの所有者名またはリポジトリ名を抽出できませんでした'
      );
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (githubToken) {
      headers.Authorization = `token ${githubToken}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${name}`,
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

    return {
      owner,
      name,
      description: data.description || null,
      url: data.html_url || repositoryUrl,
    };
  } catch (error) {
    console.error('GitHubリポジトリの詳細情報取得に失敗しました:', error);
    throw new Error('GitHubリポジトリの詳細情報取得に失敗しました');
  }
}
