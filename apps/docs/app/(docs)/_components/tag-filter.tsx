'use client';

import { useState } from 'react';
import { Badge } from '@kit/ui/badge';
import { getTagDisplayName } from '~/lib/mdx/tag-mappings';
import { Button } from '@kit/ui/button';

interface TagFilterProps {
  allTags: Map<string, { id: string; count?: number }>;
  activeTag: string | null;
  onTagClick: (tagId: string) => void;
  onReset: () => void;
}

const INITIAL_TAG_LIMIT = 5;

export function TagFilter({
  allTags,
  activeTag,
  onTagClick,
  onReset,
}: TagFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const allTagArray = Array.from(allTags.values());
  const visibleTags = isExpanded
    ? allTagArray
    : allTagArray.slice(0, INITIAL_TAG_LIMIT);
  const showToggleButton = allTagArray.length > INITIAL_TAG_LIMIT;

  return (
    <div className="mb-6 flex flex-col items-start">
      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag) => (
          <Badge
            key={tag.id}
            variant={activeTag === tag.id ? 'default' : 'outline'}
            className="cursor-pointer flex items-center gap-1.5"
            onClick={() => onTagClick(tag.id)}
          >
            <span># {getTagDisplayName(tag.id)}</span>
            {tag.count && (
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium">
                {tag.count}
              </span>
            )}
          </Badge>
        ))}

        {activeTag && (
          <button
            type="button"
            onClick={onReset}
            className="ml-auto self-center text-xs text-muted-foreground hover:text-foreground"
          >
            フィルターをリセット
          </button>
        )}
      </div>

      {showToggleButton && (
        <Button
          variant="link"
          className="mt-2 h-auto p-0 text-xs"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '閉じる' : 'もっと見る'}
        </Button>
      )}
    </div>
  );
}
