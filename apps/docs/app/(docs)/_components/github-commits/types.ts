export interface CommitData {
  message?: string;
  sha: string;
  date: string;
  authorName: string;
  authorLogin?: string;
  authorAvatar?: string;
  commitUrl: string;
  repoName?: string;
  repoOwner?: string;
  repoUrl?: string;
  additions?: number;
  deletions?: number;
}

export interface CommitGroup {
  primaryCommit: CommitData; // グループの代表となるコミット
  commits: CommitData[]; // グループ内のすべてのコミット
  count: number; // グループ内のコミット数
  isSimilar: boolean; // 類似コミットによるグループか
}

export interface GitHubCommitsProps {
  commits: CommitData[];
  className?: string;
  maxInitialCount?: number;
  groupSimilarCommits?: boolean; // 類似コミットをグループ化するかどうか
}
