# Saedgewell App

このプロジェクトはSaedgewellの業務管理やポートフォリオサイトなどをモノレポで管理するためのプロジェクトです。

## 主な構成

### 主要アプリ
- 👤 共通の認証機能
- ⚙️ 業務管理アプリ
- 📱 ポートフォリオ&マーケティングサイト
- 🔒 顧客管理システム
- 📕 ドキュメントサイト
- 📱 UI/UX情報サイト

### コアアーキテクチャ
- 🏗️ Next.js 15 + Turborepoモノレポ設定
- 🎨 TailwindCSS v4を使用したShadcn UIコンポーネント
- 🔐 Supabase認証とベーシックなDB
- ✨ 完全なTypeScript + Biome設定

### 技術スタック

このスターターキットは以下の基盤を提供します：

🛠️ **主な技術スタック**
- [Next.js 15](https://nextjs.org/)：サーバーサイドレンダリングと静的サイト生成のためのReactベースフレームワーク
- [Tailwind CSS](https://tailwindcss.com/)：カスタムデザインを迅速に構築するためのユーティリティファーストCSSフレームワーク
- [Supabase](https://supabase.com/)：Webとモバイルアプリケーションのためのリアルタイムデータベース
- [Turborepo](https://turborepo.org/)：複数のパッケージとアプリケーションを管理するモノレポツール
- [Shadcn UI](https://shadcn.com/)：Tailwind CSSを使用して構築されたコンポーネントコレクション
- [Zod](https://github.com/colinhacks/zod)：TypeScript優先のスキーマバリデーションライブラリ
- [React Query](https://tanstack.com/query/v4)：Reactの強力なデータフェッチングとキャッシュライブラリ
- [Biome](https://biome.com/)：
- [Playwright](https://playwright.dev/)：Webアプリケーションのエンドツーエンドテストフレームワーク

## はじめ方

### 前提条件

- Node.js 20.x以降（最新のLTSバージョンを推奨）
- Docker
- Bun

Supabase CLIを使用するために、マシン上でDockerデーモンが実行されていることを確認してください。

### インストール

#### 1. リポジトリのクローン

```bash
git clone https://github.com/otomatty/saedgewell.git
cd saedgewell
```

#### 2. 依存関係のインストール

```bash
bun install
```

## 開発環境セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

## サンプルデータのセットアップ

本番環境でサンプルデータを使用するには、以下の手順で実行してください。

### 1. ダミー画像の準備

`public/images/works/` ディレクトリに以下のダミー画像を配置してください。

- `saas-platform.webp` - AI搭載型営業支援SaaS用サムネイル
- `saas-platform-detail-1.webp` - AI搭載型営業支援SaaS用詳細画像
- `smart-tech.webp` - スマートファクトリー管理システム用サムネイル
- `smart-factory-detail-1.webp` - スマートファクトリー管理システム用詳細画像
- `sample-1.jpg` - ECサイトリニューアル用サムネイル
- `sample-2.jpg` - AIチャットボット開発用サムネイル
- `sample-3.jpg` - ポートフォリオサイト用サムネイル
- `chatbot-detail-1.webp` - AIチャットボット用詳細画像
- `portfolio-detail-1.webp` - ポートフォリオサイト用詳細画像

ダミー画像が用意できない場合は、以下のようなプレースホルダーサービスのURLを使用してください：
- `https://placehold.co/600x400/232323/FFFFFF?text=サンプル画像`

### 2. SQLスクリプトの実行

リポジトリ内の `sample-data.sql` を、Supabaseのデータベースに対して実行してください。

```bash
# Supabaseのダッシュボードでは、SQLエディタからこのファイルの中身をコピー＆ペースト
# または、psqlを使用して実行
psql -h $YOUR_SUPABASE_HOST -U postgres -d postgres -a -f sample-data.sql
```

### 3. 接続の確認

サンプルデータが正常に表示されることを確認します。

```bash
# 開発サーバーの起動
pnpm dev
```

開発サーバーを起動して http://localhost:3000 にアクセスし、実績セクションにサンプルデータが表示されることを確認してください。

