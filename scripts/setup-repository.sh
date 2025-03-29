#!/bin/bash

# ===================================================
# setup-repository.sh
# ===================================================
# 目的: テンプレートリポジトリから新しいプロジェクトを作成する際の
#      初期セットアップを自動化するスクリプト
# 
# 実行タイミング:
# - テンプレートリポジトリをクローンした直後
# - 新しいプロジェクトの初期セットアップ時
#
# 効果:
# - プロジェクト固有の設定を自動化し、開発の即時開始を可能に
# - テンプレート特有の不要ファイルを削除してクリーンな状態を作成
# - 基本的な環境設定を自動化し、セットアップミスを防止
# 
# 主な機能:
# - Git sparse-checkoutの設定
# - 不要なファイル/ディレクトリの削除
# - package.jsonの自動更新
# - 環境変数ファイルの準備
# ===================================================

# エラーが発生したら停止
# set -e コマンドはスクリプト内でコマンドが失敗した場合に
# 即座に実行を停止するよう指示します
set -e

echo "リポジトリのセットアップを開始します..."

# sparse-checkoutの設定
# これにより、リポジトリの一部のみをチェックアウトできます
# --cone オプションはより効率的なsparse-checkoutモードを有効にします
git sparse-checkout init --cone
git sparse-checkout set '*' '!docs' # 除外したいディレクトリを指定（ここではdocsディレクトリを除外）

# 不要なファイルやディレクトリの削除
# テンプレート固有の不要なファイルを削除します
rm -rf .github/template-cleanup
rm -rf docs

# package.jsonの更新
# プロジェクト固有の情報にpackage.jsonを更新します
if [ -f "package.json" ]; then
    # プロジェクト名を取得（カレントディレクトリ名）
    PROJECT_NAME=$(basename $(pwd))
    
    # package.jsonの更新（一時ファイルを使用）
    # jqコマンドを使用してJSONファイルを安全に編集します
    tmp=$(mktemp)
    jq ".name = \"$PROJECT_NAME\" | .version = \"0.1.0\"" package.json > "$tmp" && mv "$tmp" package.json
fi

# 環境変数ファイルの生成
ENV_DIR="apps/web"
mkdir -p "$ENV_DIR"

# .env の生成
cat > "$ENV_DIR/.env" << EOL
# 共有環境変数
# ここにはすべての環境で共有される**公開**環境変数を追加できます
# 機密キーや機密情報をここに追加しないでください
# 設定、パス、機能フラグなどのみを追加してください
# 特定の環境でこれらの変数を上書きするには、特定の環境ファイル（例：.env.development、.env.production）に追加してください

# サイト
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PRODUCT_NAME=Super Next App
NEXT_PUBLIC_SITE_TITLE="Super Next App"
NEXT_PUBLIC_SITE_DESCRIPTION="Super Next Appは、Next.js, Supabase, Tailwind CSSを使用したシンプルなアプリケーションです。"
NEXT_PUBLIC_DEFAULT_THEME_MODE=light
NEXT_PUBLIC_THEME_COLOR="#ffffff"
NEXT_PUBLIC_THEME_COLOR_DARK="#0a0a0a"

# 認証
NEXT_PUBLIC_AUTH_PASSWORD=true
NEXT_PUBLIC_AUTH_MAGIC_LINK=false
NEXT_PUBLIC_CAPTCHA_SITE_KEY=

# ロケールパス
NEXT_PUBLIC_LOCALES_PATH=apps/web/public/locales

# 機能フラグ
NEXT_PUBLIC_ENABLE_THEME_TOGGLE=true
NEXT_PUBLIC_LANGUAGE_PRIORITY=application
NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION=true
EOL

# .env.development の生成
cat > "$ENV_DIR/.env.development" << EOL
# このファイルは開発環境の環境変数を定義するために使用されます。
# これらの値は、アプリを開発モードで実行する場合にのみ使用されます。

# SUPABASE
# 注: NEXT_PUBLIC_SUPABASE_ANON_KEYは'supabase start'実行時に表示される値に置き換えてください
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key # supabase start時に表示される値に置き換えてください
EOL

# .env.local の生成
cat > "$ENV_DIR/.env.local" << EOL
# ローカル開発用の環境変数（Gitで追跡されません）
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/supabase"
EOL

# .env.production の生成
cat > "$ENV_DIR/.env.production" << EOL
# 本番環境の環境変数

## 公開または機密性のないものでない限り、ここに変数を追加しないでください
## この環境設定は本番環境用であり、リポジトリにコミットされます
## このファイルに機密データを配置することは避けてください。
## 公開キーや設定はここに配置しても問題ありません。

# SUPABASE
# 注: 以下の値は本番環境のSupabaseプロジェクトから取得してください
# 1. Supabaseダッシュボード(https://supabase.com/dashboard)にアクセス
# 2. 本番環境用のプロジェクトを選択
# 3. Project Settings > API から以下の値を取得
#   - Project URL → NEXT_PUBLIC_SUPABASE_URL
#   - Project API keys > anon/public → NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_URL=your-production-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
EOL

echo "環境変数ファイルを $ENV_DIR に生成しました"

echo "セットアップが完了しました。"
echo "次のステップ："
echo "1. 各環境変数ファイルの設定を確認・編集してください"
echo "2. bun installを実行してください"
echo "3. git remote set-url originで新しいリポジトリのURLを設定してください" 