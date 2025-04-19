'use client';

import { DocCard } from './doc-card';
import type { DocType } from '~/types/mdx';

interface DocTypeGridProps {
  docTypes: DocType[];
  emptyMessage?: string;
}

export function DocTypeGrid({
  docTypes,
  emptyMessage = 'ドキュメントはまだありません。',
}: DocTypeGridProps) {
  if (docTypes.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border bg-muted/50 p-8">
        <p className="text-center text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {docTypes.map((docType) => (
        <DocCard key={docType.id} docType={docType} />
      ))}
    </div>
  );
}
