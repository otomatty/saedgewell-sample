#!/bin/bash
set -e

# アーキテクチャの検出
ARCH=$(uname -m)

echo "検出されたアーキテクチャ: $ARCH"

# 必要なDockerネットワークを作成
echo "必要なDockerネットワークを確認しています..."
if ! docker network ls | grep -q "supabase_network_saedgewell"; then
  echo "supabase_network_saedgewellネットワークを作成します..."
  docker network create supabase_network_saedgewell
  echo "✅ ネットワークを作成しました"
else
  echo "✅ 必要なネットワークはすでに存在しています"
fi

# アーキテクチャ別の設定ファイルを選択
if [ "$ARCH" = "arm64" ]; then
  echo "Apple Silicon (M1/M2) 最適化を使用します"
  
  # Buildkitを有効化
  export DOCKER_BUILDKIT=1
  export COMPOSE_DOCKER_CLI_BUILD=1
  
  # Apple Silicon向け設定でコンテナを起動
  docker compose -f docker-compose.yml -f docker-compose.apple-silicon.yml up -d
else
  echo "標準構成を使用します"
  docker compose up -d
fi

# ヘルスチェック
echo "サービスの起動を確認しています..."
sleep 5

# サービスの稼働状態を確認
ALL_UP=true

# Webアプリの確認
if curl -s -o /dev/null -w "%{http_code}" https://saedgewell.test | grep -q "200"; then
  echo "✅ saedgewell.test は正常に起動しています"
else
  echo "❌ saedgewell.test の起動に問題があります"
  ALL_UP=false
fi

# Docsアプリの確認
if curl -s -o /dev/null -w "%{http_code}" https://docs.saedgewell.test | grep -q "200"; then
  echo "✅ docs.saedgewell.test は正常に起動しています"
else
  echo "❌ docs.saedgewell.test の起動に問題があります"
  ALL_UP=false
fi

# Adminアプリの確認
if curl -s -o /dev/null -w "%{http_code}" https://admin.saedgewell.test | grep -q "200"; then
  echo "✅ admin.saedgewell.test は正常に起動しています"
else
  echo "❌ admin.saedgewell.test の起動に問題があります"
  ALL_UP=false
fi

echo "$ARCH アーキテクチャ用の開発環境を起動しました"
echo ""
echo "アクセスURL:"
echo "- Web: https://saedgewell.test"
echo "- Docs: https://docs.saedgewell.test"
echo "- Admin: https://admin.saedgewell.test"
echo ""
echo "ログを確認するには:"
echo "  ./scripts/dev/logs.sh web      # Webアプリのログをリアルタイムで表示"
echo "  ./scripts/dev/logs.sh -a       # すべてのサービスのログを表示"
echo "  ./scripts/dev/logs.sh --help   # その他のオプション"
echo ""

# ブラウザを自動的に起動
if [ "$ALL_UP" = true ]; then
  echo "ブラウザを自動的に起動しています..."
  
  # オペレーティングシステムを検出
  OS=$(uname)
  
  if [ "$OS" = "Darwin" ]; then  # macOS
    # Webアプリを開く
    open https://saedgewell.test
  elif [ "$OS" = "Linux" ]; then
    # Linux用ブラウザ起動コマンド
    if command -v xdg-open > /dev/null; then
      xdg-open https://saedgewell.test
    else
      echo "⚠️ xdg-openコマンドが見つかりません。手動でブラウザを開いてください。"
    fi
  elif [[ "$OS" =~ "MINGW" ]] || [[ "$OS" =~ "MSYS" ]]; then  # Windows Git Bash
    # Windows用ブラウザ起動コマンド
    start https://saedgewell.test
  else
    echo "⚠️ 未知のOS: $OS。手動でブラウザを開いてください。"
  fi
  
  echo "✅ ブラウザを自動起動しました"
else
  echo "⚠️ 一部のサービスが起動していないため、ブラウザの自動起動をスキップします"
  echo "   問題を解決した後、手動でアクセスしてください"
fi 