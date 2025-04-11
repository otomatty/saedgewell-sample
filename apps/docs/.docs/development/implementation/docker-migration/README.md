# モノレポアプリケーションのDocker移行マイルストーン

## 概要

このドキュメントは、Next.js 15、Bun、Supabase、Turboを使用したモノレポアプリケーションをDocker環境に移行するためのマイルストーン計画です。リポジトリ全体を段階的にDockerコンテナ化し、サブドメイン間での認証共有を実装した一貫した開発環境を実現することを目的としています。

## 重要な注意事項

⚠️ **Supabase作業における重要な前提条件**: 
- Docker環境でSupabaseを操作する前に、**必ず既存のローカルSupabaseプロセスをチェックし停止**してください。
- 既存のSupabaseを適切に停止しない場合、データの不整合やポート競合の問題が発生する可能性があります。
- Supabase自体は既にDocker上で動作しているため、**再コンテナ化は行いません**。
- 代わりに、Supabase CLIを使用したローカル環境とDockerコンテナの連携に焦点を当てます。
- サブドメイン間認証は、Supabase SDKの`cookieOptions`設定を使用して実装します。
- Docker環境では、アプリケーションのみをコンテナ化し、ローカルのSupabaseサービスと連携します。

## 目次

1. [前提条件と目標](./prerequisites.md) - プロジェクトの現状と移行目標の概要
2. [フェーズ1: 準備と検証](./phase1.md) - 環境準備とDockerの検証
3. [フェーズ2: Supabase設定](./phase2.md) - Supabase認証とDocker連携
4. [フェーズ3: アプリケーション移行とNginx設定](./phase3.md) - Next.jsアプリのコンテナ化とNginx設定
5. [フェーズ4: 最適化とテスト](./phase4.md) - パフォーマンス最適化とテスト
6. [フェーズ5: 環境構築自動化](./phase5.md) - 初期設定と開発環境構築の自動化

## 各フェーズの概要

### フェーズ1: 準備と検証 (2-3日)
- Docker環境の構築（Docker DesktopまたはColima）
- ビルドキャッシュ戦略の検討と設定
- サンプルNext.jsアプリのコンテナ化テスト
- マルチステージビルドの検証と最適化
- Apple Silicon (M1/M2) とIntel環境の互換性確保

### フェーズ2: Supabase設定 (2-3日)
- Supabase CLIとDocker環境の連携
- サブドメイン間認証共有の基盤設定
  - `supabase/config.toml`の設定（サイトURLとリダイレクトURL）
  - `packages/supabase/auth/client.ts`での共通認証ライブラリ作成
  - `.env.docker`での環境変数設定
- 開発環境用スクリプトの整備
  - Supabaseプロセスチェック
  - 環境変数の自動設定

### フェーズ3: アプリケーション移行とNginx設定 (5-7日)
- モノレポ構造に対応したDockerfile設計
- 各アプリケーション（web, docs, admin）のコンテナ化
- Nginx設定の実装
  - サブドメインルーティング
  - リバースプロキシ設定
  - SSL/TLS対応（開発環境用）
- 認証統合
  - Cookie共有設定
  - セッション管理
  - アクセスコントロール

### フェーズ4: 最適化とテスト (3-4日)
- ビルドキャッシュの最適化
- リソース使用量の最適化
- 環境全体の統合テスト
- アーキテクチャ固有の最適化
- パフォーマンス計測と改善

### フェーズ5: 環境構築自動化 (3-4日)
- 初期設定の自動化
- CI/CD統合
- デプロイメントパイプラインの構築
- 開発者向けドキュメントの整備

## 主要機能

- **サブドメイン間認証共有**: すべてのアプリケーション（web, docs, admin）間でシームレスな認証共有
  - `.localhost`ドメインでのクッキー共有
  - 最新のSupabase認証SDKを活用
  - NginxによるサブドメインのルーティングRO
- **アーキテクチャ最適化**: Intel CPUとApple Silicon (M1/M2) の両方に最適化
  - マルチプラットフォームビルド設定
  - アーキテクチャ固有の最適化
- **効率的な開発環境**: ホットリロード、ボリュームマウント、キャッシュの最適化
  - ソースコードの変更を即時反映
  - ビルド時間を短縮するキャッシュ戦略
- **コンテナ間通信**: Dockerネットワークを使用した効率的なサービス間通信
  - 内部ネットワークでの安全な通信
  - サービスディスカバリの最適化
- **自動化されたセットアップ**: ワンコマンドでの環境構築と初期設定
  - 新規開発者のオンボーディング簡略化
  - 環境依存の問題を最小化
- **CI/CD統合**: GitHub Actionsを使用した自動テストとビルド
  - プルリクエスト時の自動テスト
  - 本番環境へのデプロイ自動化

## 想定期間

- 総所要時間: 3〜4週間
- 各フェーズの目安:
  - フェーズ1: 2-3日
  - フェーズ2: 2-3日
  - フェーズ3: 5-7日
  - フェーズ4: 3-4日
  - フェーズ5: 3-4日

## マルチアーキテクチャ対応

このマイルストーンは、Intel Mac、M1/M2 Mac (Apple Silicon)、Linuxなど複数のアーキテクチャで動作するよう設計されています。アーキテクチャ固有の設定や最適化についても各フェーズで詳細に記載しています。

## テクノロジースタック

- **コンテナ化**: Docker, Docker Compose
- **フロントエンド**: Next.js 15 (App Router), React 19
- **バックエンド**: Supabase (PostgreSQL, Auth, Storage)
- **ビルドツール**: Turborepo, Bun 1.2.4+
- **リバースプロキシ**: Nginx
- **CI/CD**: GitHub Actions

## フェーズ2での主要実装

フェーズ2では、以下の実装に特に注力します：

1. **Supabase認証のサブドメイン共有**:
   - 最新の`@supabase/ssr`ライブラリを使用
   - `.localhost`ドメインでのクッキー共有設定
   - ミドルウェアでの認証トークン管理

2. **リバースプロキシ設定**:
   - Nginxを使用したサブドメインルーティング
   - ホストファイル設定によるローカル開発環境の構築

3. **環境変数管理**:
   - 開発環境と本番環境の分離
   - シークレット管理の最適化
   - Docker Composeでの環境変数注入

## 参考リンク

- [Docker公式ドキュメント](https://docs.docker.com/)
- [Supabase Self-Hostingガイド](https://supabase.com/docs/guides/self-hosting)
- [Next.js 15 Dockerデプロイメントガイド](https://nextjs.org/docs/app/building-your-application/deploying)
- [Bun 1.2公式Docker対応ガイド](https://bun.sh/guides/ecosystem/docker)
- [Turborepo Dockerガイド](https://turbo.build/repo/docs/guides/tools/docker)
- [Supabase認証ガイド](https://supabase.com/docs/guides/auth)
- [Next.js 15のサーバーコンポーネントでのSupabase認証](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabaseのサブドメイン認証実装例](https://github.com/sourman/example-supabase-auth-across-subdomains)
- [Docker Compose V2ガイド](https://docs.docker.com/compose/compose-v2/)
- [Apple SiliconでのDockerパフォーマンス最適化](https://www.docker.com/blog/faster-multi-platform-builds-dockerfile-cross-compilation-guide/)
- [Nginx サブドメイン設定ガイド](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/)
- [Docker BuildKit最適化ガイド](https://docs.docker.com/develop/develop-images/build_enhancements/)
- [GitHub Actions Docker統合ガイド](https://docs.github.com/ja/actions/publishing-packages/publishing-docker-images) 
- [サブドメインにおけるSupabaseの認証連携](https://github.com/sourman/example-supabase-auth-across-subdomains)