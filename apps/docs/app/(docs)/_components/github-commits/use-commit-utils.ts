import { useMemo } from 'react';
import type { CommitData, CommitGroup } from './types';

/**
 * コミットメッセージのフォーマット（最初の行のみを抽出）
 */
export function formatCommitMessage(message: string | undefined): string {
  if (typeof message !== 'string') return '';
  return message.split('\n')[0] as string;
}

/**
 * 日時を読みやすいフォーマットに変換
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * コミットの統計情報を計算
 */
export function calculateCommitStats(commits: CommitData[]) {
  let totalAdditions = 0;
  let totalDeletions = 0;

  for (const commit of commits) {
    if (commit.additions !== undefined) {
      totalAdditions += commit.additions;
    }
    if (commit.deletions !== undefined) {
      totalDeletions += commit.deletions;
    }
  }

  return {
    totalCommits: commits.length,
    totalAdditions,
    totalDeletions,
  };
}

/**
 * 2つのコミットが類似しているかを判定
 */
function areCommitsSimilar(
  a: CommitData | undefined,
  b: CommitData | undefined
): boolean {
  // nullチェック
  if (!a || !b) return false;

  // 1. メッセージの類似度チェック - 単純な比較から始める
  const aFirstLine = formatCommitMessage(a.message);
  const bFirstLine = formatCommitMessage(b.message);

  // 完全一致の場合
  if (aFirstLine === bFirstLine) {
    return true;
  }

  // 2. 時間的近接性チェック (30分以内)
  const timeA = new Date(a.date).getTime();
  const timeB = new Date(b.date).getTime();
  const timeClose = Math.abs(timeA - timeB) < 30 * 60 * 1000;

  // 3. リポジトリが同じか
  const sameRepo = a.repoName === b.repoName && a.repoOwner === b.repoOwner;

  // 4. 著者が同じか
  const sameAuthor =
    a.authorLogin === b.authorLogin || a.authorName === b.authorName;

  // メッセージが似ていて、時間が近く、同じリポジトリの同じ著者からのコミットなら類似と判断
  const messageStartSimilar =
    aFirstLine.length > 15 &&
    bFirstLine.length > 15 &&
    (aFirstLine.startsWith(bFirstLine.substring(0, 15)) ||
      bFirstLine.startsWith(aFirstLine.substring(0, 15)));

  return messageStartSimilar && timeClose && sameRepo && sameAuthor;
}

/**
 * コミットをグループ化するフック
 */
export function useGroupedCommits(
  commits: CommitData[],
  groupSimilar: boolean
) {
  return useMemo(() => {
    if (!groupSimilar) {
      return commits.map((commit) => ({
        primaryCommit: commit,
        commits: [commit],
        count: 1,
        isSimilar: false,
      }));
    }

    // 処理済みコミットを記録
    const processedCommits = new Set<string>();
    const groups: CommitGroup[] = [];

    for (let i = 0; i < commits.length; i++) {
      const currentCommit = commits[i];

      // nullチェック
      if (!currentCommit) continue;

      // 既に処理済みならスキップ
      if (processedCommits.has(currentCommit.sha)) {
        continue;
      }

      const similarCommits: CommitData[] = [currentCommit];
      processedCommits.add(currentCommit.sha);

      // 類似コミットを検索
      for (let j = i + 1; j < commits.length; j++) {
        const otherCommit = commits[j];

        // nullチェック
        if (!otherCommit) continue;

        if (
          !processedCommits.has(otherCommit.sha) &&
          areCommitsSimilar(currentCommit, otherCommit)
        ) {
          similarCommits.push(otherCommit);
          processedCommits.add(otherCommit.sha);
        }
      }

      // グループを作成
      groups.push({
        primaryCommit: currentCommit,
        commits: similarCommits,
        count: similarCommits.length,
        isSimilar: similarCommits.length > 1,
      });
    }

    return groups;
  }, [commits, groupSimilar]);
}
