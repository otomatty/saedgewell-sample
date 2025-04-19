import { Github, Mail, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t py-8 bg-background/95">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* 開発情報セクション */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">開発情報</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/development/credits"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                謝辞・ライブラリ
              </Link>
            </li>
            <li>
              <Link
                href="/development/roadmaps"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ロードマップ
              </Link>
            </li>
            <li>
              <Link
                href="/development"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                開発ドキュメント
              </Link>
            </li>
          </ul>
        </div>

        {/* リソースセクション */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">リソース</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ブログ
              </Link>
            </li>
            <li>
              <Link
                href="/tutorials"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                チュートリアル
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                よくある質問
              </Link>
            </li>
            <li>
              <Link
                href="/community"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                コミュニティ
              </Link>
            </li>
          </ul>
        </div>

        {/* 法的情報セクション */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">法的情報</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                利用規約
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                プライバシーポリシー
              </Link>
            </li>
            <li>
              <Link
                href="/security"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                セキュリティ
              </Link>
            </li>
          </ul>
        </div>

        {/* お問い合わせ・ソーシャルセクション */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">お問い合わせ</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:contact@example.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                contact@example.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <a
                href="https://github.com/yourusername/your-repo"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              <a
                href="https://twitter.com/yourhandle"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* コピーライトセクション */}
      <div className="container mt-8 border-t pt-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built by{' '}
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Your Team
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
