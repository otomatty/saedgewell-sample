/**
 * GitHubジャーナル関連の型定義
 */

/**
 * index.jsonのデータ構造
 */
export interface IndexData {
  title?: string;
  description?: string;
  date?: string;
  entries?: JournalEntry[];
  commits?: CommitData[];
  [key: string]: unknown;
}

/**
 * ジャーナルエントリの構造
 */
export interface JournalEntry {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  [key: string]: unknown;
}

/**
 * コミット情報の構造
 */
export interface CommitData {
  message: string;
  sha: string;
  date: string;
  authorName: string;
  authorLogin: string | null;
  authorAvatar: string | null;
  commitUrl: string;
  repoName: string;
  repoOwner: string;
  repoUrl: string;
  additions?: number; // 追加行数
  deletions?: number; // 削除行数
}

/**
 * GitHubコミットAPIのレスポンス構造
 */
export interface GitHubCommit {
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
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
  files?: Array<{
    filename: string;
    additions: number;
    deletions: number;
    changes: number;
    status: string;
  }>;
}

/**
 * GitHubリポジトリAPIのレスポンス構造
 */
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

/**
 * GitHub組織APIのレスポンス構造
 */
export interface GitHubOrg {
  login: string;
}

/**
 * コマンドラインオプション
 */
export interface Options {
  owner: string;
  repo: string;
  username: string;
  date: string | null;
  fromDate: string | null;
  toDate: string | null;
  skipExisting: boolean;
  verbose: boolean;
  help: boolean;
  debug?: boolean;
}
