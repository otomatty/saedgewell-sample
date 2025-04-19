import { Skeleton } from '@kit/ui/skeleton';
import { SheetHeader } from '@kit/ui/sheet';

export function EmailDetailSkeleton() {
  return (
    <div className="space-y-6">
      <SheetHeader>
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-7 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </SheetHeader>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <div className="grid gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
