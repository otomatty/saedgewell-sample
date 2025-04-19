import { Skeleton } from '@kit/ui/skeleton';

/**
 * 目次のスケルトンローディングコンポーネント
 * @returns 目次のスケルトンローディングUI
 */
export function TableOfContentsSkeleton() {
  // 安定したキーを生成するための配列
  const h2Items = ['intro', 'main', 'conclusion'];
  const h3Items1 = ['sub-intro-1', 'sub-intro-2'];
  const h3Items2 = ['sub-main-1', 'sub-main-2', 'sub-main-3'];

  return (
    <nav className="toc sticky top-20 flex flex-col w-full max-h-[calc(100vh-6rem)] overflow-hidden">
      <div className="sticky top-0 z-10 flex items-center justify-between p-2 bg-background/80 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-foreground">目次</h2>
      </div>
      <div className="overflow-y-auto pr-2">
        <ul className="space-y-1 py-2">
          {/* 見出しレベル2のスケルトン */}
          {h2Items.slice(0, 1).map((key) => (
            <li key={`h2-${key}`} className="relative py-1">
              <Skeleton className="h-6 w-[90%] rounded-md" />
            </li>
          ))}

          {/* 見出しレベル3のスケルトン（インデント付き） */}
          {h3Items1.map((key) => (
            <li
              key={`h3-${key}`}
              className="relative py-1"
              style={{ paddingLeft: '0.75rem' }}
            >
              <Skeleton className="h-5 w-[80%] rounded-md" />
            </li>
          ))}

          {/* 見出しレベル2のスケルトン */}
          <li key="h2-main" className="relative py-1">
            <Skeleton className="h-6 w-[85%] rounded-md" />
          </li>

          {/* 見出しレベル3のスケルトン（インデント付き） */}
          {h3Items2.map((key) => (
            <li
              key={`h3-${key}`}
              className="relative py-1"
              style={{ paddingLeft: '0.75rem' }}
            >
              <Skeleton className="h-5 w-[75%] rounded-md" />
            </li>
          ))}

          {/* 見出しレベル2のスケルトン */}
          <li key="h2-conclusion" className="relative py-1">
            <Skeleton className="h-6 w-[70%] rounded-md" />
          </li>
        </ul>
      </div>
    </nav>
  );
}
