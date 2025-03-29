'use client';

import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { AlertCircle } from 'lucide-react';

export function ErrorFallback({ error }: { error: Error }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>エラーが発生しました</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
