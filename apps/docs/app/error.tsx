'use client';

import { useEffect } from 'react';
import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';

import { Header } from '~/components/layout/header';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    // エラーをログに記録
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:pb-24 lg:pt-16">
          <Heading level={1} className="text-center">
            エラーが発生しました
          </Heading>
          <p className="text-center text-muted-foreground">
            申し訳ありません。予期せぬエラーが発生しました。
          </p>
          {error.message && (
            <p className="text-center text-sm text-muted-foreground">
              エラー詳細: {error.message}
            </p>
          )}
          <Button onClick={reset}>もう一度試す</Button>
        </section>
      </main>
    </div>
  );
};

export default ErrorPage;
