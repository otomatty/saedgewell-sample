'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CommitCard } from './commit-card';
import type { CommitGroup } from './types';

interface CommitGroupProps {
  group: CommitGroup;
  className?: string;
}

export function CommitGroupItem({ group, className }: CommitGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const { primaryCommit, commits, count, isSimilar } = group;

  // 単一コミットの場合は直接表示
  if (!isSimilar || count === 1) {
    return <CommitCard commit={primaryCommit} className={className} />;
  }

  // 複数コミットのグループの場合
  return (
    <li className={`${className || ''}`}>
      {/* メインのコミット（グループの代表） */}
      <CommitCard commit={primaryCommit} />

      {/* 類似コミットがあることを示すインジケーター */}
      {isSimilar && (
        <div className="ml-10 mt-1">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 py-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="size-3.5" />
                <span>類似コミットを折りたたむ</span>
              </>
            ) : (
              <>
                <ChevronDown className="size-3.5" />
                <span>類似コミットをもっと見る（{count - 1}件）</span>
              </>
            )}
          </button>

          {/* 展開時に表示される類似コミット */}
          {expanded && (
            <ul className="pl-2 border-l border-border/50 mt-1 space-y-3">
              {commits.slice(1).map((commit) => (
                <CommitCard
                  key={commit.sha}
                  commit={commit}
                  className="opacity-80 hover:opacity-100"
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}
