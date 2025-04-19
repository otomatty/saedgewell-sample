import { Skeleton } from '@kit/ui/skeleton';

interface DocTreeSkeletonProps {
  depth?: number;
  itemsPerLevel?: number;
}

export function DocTreeSkeleton({
  depth = 2,
  itemsPerLevel = 3,
}: DocTreeSkeletonProps) {
  // 再帰的にスケルトンツリーを生成する関数
  const renderSkeletonLevel = (currentDepth: number, parentId = '') => {
    if (currentDepth <= 0) return null;

    return (
      <ul className="space-y-1 pl-2">
        {Array.from({ length: itemsPerLevel }).map((_, index) => {
          const itemId = parentId ? `${parentId}-${index}` : `item-${index}`;
          return (
            <li key={itemId} className="py-1">
              <div className="flex items-center gap-2">
                {/* アイコンのスケルトン */}
                <Skeleton className="h-4 w-4 rounded-sm" />

                {/* タイトルのスケルトン */}
                <Skeleton className="h-5 w-[80%]" />
              </div>

              {/* 子要素のスケルトン（深さが2以上の場合のみ表示） */}
              {currentDepth > 1 && (
                <div className="mt-1 ml-4">
                  {renderSkeletonLevel(currentDepth - 1, itemId)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return <div className="animate-pulse">{renderSkeletonLevel(depth)}</div>;
}
