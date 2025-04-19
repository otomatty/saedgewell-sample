'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Plus, Minus } from 'lucide-react';
import { formatCommitMessage, formatDate } from './use-commit-utils';
import type { CommitData } from './types';

interface CommitCardProps {
  commit: CommitData;
  className?: string;
}

export function CommitCard({ commit, className }: CommitCardProps) {
  return (
    <div
      className={`flex items-start gap-3 py-1.5 border-b border-border/30 last:border-0 ${className || ''}`}
    >
      {/* 著者アバター */}
      <div className="flex-shrink-0 mt-1">
        {commit.authorAvatar ? (
          <Image
            src={commit.authorAvatar}
            alt={commit.authorName}
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <div className="size-6 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground">
              {commit.authorName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* コミット情報 */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col">
          <Link
            href={commit.commitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sm truncate hover:underline flex items-center gap-1"
          >
            {formatCommitMessage(commit.message)}
            <ExternalLink className="size-3 inline-block opacity-50" />
          </Link>
          <div className="text-xs text-muted-foreground flex items-center mt-0.5">
            <span>{formatDate(commit.date)}</span>
            {(commit.authorLogin || commit.authorName) && commit.repoName && (
              <>
                <span className="mx-1">・</span>
                <Link
                  href={commit.repoUrl || ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center"
                >
                  {commit.authorLogin || commit.authorName}/{commit.repoName}
                </Link>
              </>
            )}
          </div>
          {/* 追加・削除行数を表示 */}
          {(commit.additions !== undefined ||
            commit.deletions !== undefined) && (
            <div className="flex items-center gap-2 mt-1 text-xs">
              {commit.additions !== undefined && (
                <span
                  className="flex items-center gap-0.5 text-success"
                  title="追加された行数"
                >
                  <Plus className="size-3.5" />
                  {commit.additions}
                </span>
              )}
              {commit.deletions !== undefined && (
                <span
                  className="flex items-center gap-0.5 text-destructive/80"
                  title="削除された行数"
                >
                  <Minus className="size-3.5" />
                  {commit.deletions}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
