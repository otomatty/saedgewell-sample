import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { PageHeader } from '@/components/custom/page-header';
import FocusTimer from './_components/focus-timer/focus-timer';
import { getTodaysFocusSessions } from '../../../_actions/focus';
import { ErrorFallback } from '../../emails/_components/error-fallback';

export const metadata: Metadata = {
  title: 'Focus | Admin',
  description: 'Focus timer for productivity',
};

export default async function FocusPage() {
  // 初期データの取得
  const initialSessions = await getTodaysFocusSessions();

  return (
    <>
      <PageHeader title="Focus Timer" />
      <div className="container">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-24 w-24 rounded-full animate-pulse bg-muted" />
                <div className="h-8 w-32 animate-pulse bg-muted" />
              </div>
            }
          >
            <FocusTimer initialSessions={initialSessions} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}
