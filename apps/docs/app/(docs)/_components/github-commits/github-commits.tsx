'use client';

import { useState } from 'react';
import { GitCommit, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import { cn } from '@kit/ui/utils';
import { CommitGroupItem } from './commit-group';
import { useGroupedCommits, calculateCommitStats } from './use-commit-utils';
import type { GitHubCommitsProps } from './types';

export function GitHubCommits({
  commits,
  className,
  maxInitialCount = 3,
  groupSimilarCommits = true,
}: GitHubCommitsProps) {
  const [expanded, setExpanded] = useState(false);

  // コミットをグループ化
  const commitGroups = useGroupedCommits(commits, groupSimilarCommits);

  const displayedGroups = expanded
    ? commitGroups
    : commitGroups.slice(0, maxInitialCount);

  const hasMoreGroups = commitGroups.length > maxInitialCount;

  if (commits.length === 0) {
    return null;
  }

  // コミットの統計情報を計算
  const stats = calculateCommitStats(commits);

  return (
    <div className={cn('space-y-2 text-sm', className)}>
      <h4 className="font-semibold flex items-center gap-1 text-muted-foreground">
        <GitCommit className="size-4" />
        コミット履歴
        <span className="ml-2 font-normal text-xs">
          {stats.totalCommits}件
          <span className="text-success ml-1" title="追加行数">
            <Plus className="size-3 inline-block" />
            {stats.totalAdditions}
          </span>
          <span className="text-destructive/80 ml-1" title="削除行数">
            <Minus className="size-3 inline-block" />
            {stats.totalDeletions}
          </span>
        </span>
      </h4>

      <ul className="space-y-4">
        {displayedGroups.map((group) => (
          <CommitGroupItem key={group.primaryCommit.sha} group={group} />
        ))}
      </ul>

      {/* もっと見るボタン */}
      {hasMoreGroups && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="size-3.5" />
              <span>折りたたむ</span>
            </>
          ) : (
            <>
              <ChevronDown className="size-3.5" />
              <span>
                もっと見る（{commitGroups.length - maxInitialCount}件）
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
