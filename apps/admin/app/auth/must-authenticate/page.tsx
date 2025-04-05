import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Button } from '@kit/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';

export const metadata: Metadata = {
  title: '認証が必要です | Saedgewell Admin',
  description: 'Saedgewell管理画面へのアクセスには事前認証が必要です',
};

export default function MustAuthenticatePage() {
  const mainAppUrl =
    process.env.NEXT_PUBLIC_MAIN_APP_URL || 'https://saedgewell.net';

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">認証が必要です</CardTitle>
          <CardDescription>
            Saedgewell管理画面へのアクセスには事前認証が必要です
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            管理画面を利用するには、まずSaedgewellの本体アプリケーションで認証を行ってください。
            認証後、こちらの管理画面に戻ってアクセスしてください。
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            管理者権限を持っていない場合は、システム管理者にお問い合わせください。
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={mainAppUrl} target="_blank" rel="noopener noreferrer">
              本体アプリケーションへ移動
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
