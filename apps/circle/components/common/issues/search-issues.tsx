'use client';

import { useAtomValue } from 'jotai';
import { isSearchOpenAtom, searchQueryAtom } from '~/store/search-store';
import { searchedIssuesAtom } from '~/store/issues-store';
import type { Issue } from '~/mock-data/issues';
import { IssueLine } from './issue-line';

export function SearchIssues() {
  const searchQuery = useAtomValue(searchQueryAtom);
  const isSearchOpen = useAtomValue(isSearchOpenAtom);
  const searchResults = useAtomValue(searchedIssuesAtom(searchQuery));

  if (!isSearchOpen || searchQuery.trim() === '') {
    return null;
  }

  return (
    <div className="w-full">
      <div>
        {searchResults.length > 0 ? (
          <div className="border rounded-md mt-4">
            <div className="py-2 px-4 border-b bg-muted/50">
              <h3 className="text-sm font-medium">
                Results ({searchResults.length})
              </h3>
            </div>
            <div className="divide-y">
              {searchResults.map((issue: Issue) => (
                <IssueLine key={issue.id} issue={issue} layoutId={false} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No results found for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
