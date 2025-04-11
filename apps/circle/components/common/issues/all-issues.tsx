'use client';

import { useAtomValue } from 'jotai';
import { status } from '~/mock-data/status';
import { issuesByStatusAtom } from '~/store/issues-store';
import { viewTypeAtom } from '~/store/view-store';
import type { FC } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GroupIssues } from './group-issues';
import { SearchIssues } from './search-issues';
import { CustomDragLayer } from './issue-grid';
import { cn } from '@kit/ui/utils';

export default function AllIssues() {
  const viewType = useAtomValue(viewTypeAtom);
  const isSearchOpen = false;
  const searchQuery = '';

  const isSearching = isSearchOpen && searchQuery.trim() !== '';
  const isViewTypeGrid = viewType === 'grid';

  return (
    <div className={cn('w-full h-full', isViewTypeGrid && 'overflow-x-auto')}>
      {isSearching ? (
        <SearchIssuesView />
      ) : (
        <GroupIssuesListView isViewTypeGrid={isViewTypeGrid} />
      )}
    </div>
  );
}

const SearchIssuesView = () => (
  <div className="px-6 mb-6">
    <SearchIssues />
  </div>
);

const GroupIssuesListView: FC<{
  isViewTypeGrid: boolean;
}> = ({ isViewTypeGrid = false }) => {
  const issuesByStatus = useAtomValue(issuesByStatusAtom);
  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <div
        className={cn(
          isViewTypeGrid && 'flex h-full gap-3 px-2 py-2 min-w-max'
        )}
      >
        {status.map((statusItem) => {
          const issuesForStatus = issuesByStatus[statusItem.id] || [];
          const count = issuesForStatus.length;
          return (
            <GroupIssues
              key={statusItem.id}
              status={statusItem}
              issues={issuesForStatus}
              count={count}
            />
          );
        })}
      </div>
    </DndProvider>
  );
};
