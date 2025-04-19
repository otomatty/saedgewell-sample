/**
 * GitHubリポジトリの型定義
 */
export interface GithubRepository {
  id: number;
  owner: string;
  name: string;
  html_url: string | null;
  description: string | null;
  is_private: boolean;
  synced_at: string | null;
}
