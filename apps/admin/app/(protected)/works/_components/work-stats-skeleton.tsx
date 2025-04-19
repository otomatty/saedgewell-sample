import type React from 'react';
import { Card, CardHeader, CardContent } from '@kit/ui/card';
import { Skeleton } from '@kit/ui/skeleton';

/**
 * WorkStatsDisplay のローディング状態を示すスケルトンコンポーネント
 */
const WorkStatsSkeleton: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* ドーナツチャート用スケルトン (x2) */}
      {[1, 2].map((key) => (
        <Card key={key} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-1" />
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-between pb-6">
            {' '}
            {/* justify-between で左右に配置 */}
            {/* ドーナツエリア */}
            <div className="flex-shrink-0">
              {' '}
              {/* ドーナツが縮まないように */}
              <Skeleton className="h-40 w-40 rounded-full md:h-44 md:w-44 lg:h-48 lg:w-48" />{' '}
              {/* レスポンシブサイズ調整 */}
            </div>
            {/* 凡例エリア */}
            <div className="flex flex-col space-y-3 pl-4">
              {' '}
              {/* 凡例の間隔 */}
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 横向き棒グラフ用スケルトン */}
      <Card className="flex flex-col">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent className="flex flex-1 space-x-4 pb-6">
          {' '}
          {/* ラベルと棒の間隔 */}
          {/* ラベルエリア */}
          <div className="flex flex-col space-y-4 pt-2">
            {' '}
            {/* ラベルの位置調整 */}
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-14" />
          </div>
          {/* 棒グラフエリア */}
          <div className="flex-1 space-y-3">
            {' '}
            {/* 棒の間隔 */}
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-11/12" /> {/* 長さを少し変える */}
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkStatsSkeleton;
