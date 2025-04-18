'use client';

import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';

interface GlobalErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorPageProps) {
  return (
    <html lang="ja">
      <body>
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
      </body>
    </html>
  );
}
