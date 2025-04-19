import { SeigaihaPattern } from '@kit/ui/seigaiha-pattern';
import { Button } from '@kit/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'メンテナンス中',
};

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="relative w-full overflow-hidden">
        <SeigaihaPattern className="absolute inset-0 h-full w-full opacity-20" />
        <div className="container relative z-10 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-8 text-4xl font-bold tracking-tight md:text-6xl">
              メンテナンス中
            </h1>
            <p className="mb-12 text-lg text-muted-foreground">
              現在、サイトはメンテナンス中です。
              <br />
              ご不便をおかけしますが、しばらくお待ちください。
            </p>
            <Button asChild>
              <Link href="/">トップページに戻る</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
