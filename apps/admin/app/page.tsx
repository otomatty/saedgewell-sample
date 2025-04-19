import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ExternalLink,
  ChevronRight,
  ActivitySquare,
  HelpCircle,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saedgewell 管理システム',
  description: 'Saedgewellの管理機能にアクセスするためのポータルサイトです',
};

// 機能カードのデータ
const features = [
  {
    title: 'ダッシュボード',
    description: 'サイト全体の統計情報や重要な指標を確認できます',
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    path: '/home',
  },
  {
    title: 'ユーザー管理',
    description: 'ユーザーの登録情報の確認や権限の管理を行います',
    icon: <Users className="h-8 w-8 text-primary" />,
    path: '/users',
  },
  {
    title: 'コンテンツ管理',
    description: 'サイト内のコンテンツの作成・編集・公開を管理します',
    icon: <FileText className="h-8 w-8 text-primary" />,
    path: '/content',
  },
  {
    title: 'システム設定',
    description: 'サイト全体の設定や環境変数の管理を行います',
    icon: <Settings className="h-8 w-8 text-primary" />,
    path: '/settings',
  },
  {
    title: '利用統計',
    description: 'サイトの利用状況や訪問者数などの分析情報を確認できます',
    icon: <ActivitySquare className="h-8 w-8 text-primary" />,
    path: '/analytics',
  },
  {
    title: 'ヘルプ・サポート',
    description: '管理システムの使い方やよくある質問などのサポート情報',
    icon: <HelpCircle className="h-8 w-8 text-primary" />,
    path: '/help',
  },
];

export default function AdminStartPage() {
  // システムの状態情報
  const systemInfo = {
    status: '正常稼働中',
    lastUpdated: new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    version: 'v1.0.0',
  };

  // メインアプリのURL
  const mainAppUrl =
    process.env.NEXT_PUBLIC_MAIN_APP_URL || 'https://saedgewell.net';

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary" />
            <span className="text-xl font-bold">Saedgewell Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/home">
              <Button>
                ダッシュボードへ
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Button variant="outline" asChild>
              <Link href={mainAppUrl} target="_blank" rel="noopener noreferrer">
                メインサイトへ
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight">
              Saedgewell管理システム
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              サイト管理者向けの統合管理ツール
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Card
                key={`feature-${feature.title}-${i}`}
                className="transition-all hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={feature.path}>
                      機能を開く
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-muted py-12">
          <div className="container">
            <Card>
              <CardHeader>
                <CardTitle>システム情報</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      システム状態
                    </p>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                      {systemInfo.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      最終更新日
                    </p>
                    <p className="text-lg font-semibold">
                      {systemInfo.lastUpdated}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      バージョン
                    </p>
                    <p className="text-lg font-semibold">
                      {systemInfo.version}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Saedgewell Inc. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:underline"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
