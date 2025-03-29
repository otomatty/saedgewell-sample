'use client';

import { Loader2 } from 'lucide-react';
import { Skeleton } from '@kit/ui/skeleton';
import { Card, CardContent } from '@kit/ui/card';

export default function AdminLoading() {
  return (
    <div className="container space-y-8 py-8">
      <Skeleton className="h-10 w-48" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map(() => (
          <Skeleton key={crypto.randomUUID()} className="h-32" />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-10" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={crypto.randomUUID()} className="h-16" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
