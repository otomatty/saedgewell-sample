#!/bin/bash
set -e

echo "アプリケーション開発環境を起動しています..."

# 必要なサービスを指定する
if [ -z "$1" ]; then
  # 引数がない場合は全てのアプリを起動
  APPS="web docs admin"
else
  # 指定されたアプリのみ起動
  APPS="$1"
fi

# 必要なDockerネットワークを作成
echo "必要なDockerネットワークを確認しています..."
if ! docker network ls | grep -q "supabase_network_saedgewell"; then
  echo "supabase_network_saedgewellネットワークを作成します..."
  docker network create supabase_network_saedgewell
  echo "✅ ネットワークを作成しました"
else
  echo "✅ 必要なネットワークはすでに存在しています"
fi

# アプリの起動
for APP in $APPS; do
  echo "$APP アプリケーションを起動しています..."
  docker compose up -d $APP
done

# ヘルスチェック
echo "サービスの起動を確認しています..."
sleep 5

# サービスの稼働状態を確認
ALL_UP=true
APP_URLS=()

if [[ "$APPS" == *"web"* ]]; then
  if curl -s -o /dev/null -w "%{http_code}" http://saedgewell.test | grep -q "200"; then
    echo "✅ saedgewell.test は正常に起動しています"
    APP_URLS+=("http://saedgewell.test")
  else
    echo "❌ saedgewell.test の起動に問題があります"
    ALL_UP=false
  fi
fi

for APP in docs admin; do
  if [[ "$APPS" == *"$APP"* ]]; then
    if curl -s -o /dev/null -w "%{http_code}" http://$APP.saedgewell.test | grep -q "200"; then
      echo "✅ $APP.saedgewell.test は正常に起動しています"
      APP_URLS+=("http://$APP.saedgewell.test")
    else
      echo "❌ $APP.saedgewell.test の起動に問題があります"
      ALL_UP=false
    fi
  fi
done

echo "アプリケーションが正常に起動しました！"
echo ""
echo "アクセスURL:"
echo "- Web: https://saedgewell.test"
echo "- Docs: https://docs.saedgewell.test"
echo "- Admin: https://admin.saedgewell.test"
echo ""
echo "ログを確認するには: docker compose logs -f [app_name]"

# ブラウザを自動的に起動
if [ "$ALL_UP" = true ]; then
  echo "ブラウザを自動的に起動しています..."
  
  # オペレーティングシステムを検出
  OS=$(uname)
  
  # webアプリを起動対象に含める
  if [[ "$APPS" == *"web"* ]]; then
    OPEN_WEB=true
  else
    OPEN_WEB=false
  fi
  
  if [ "$OS" = "Darwin" ]; then  # macOS
    # Webアプリを開く（起動している場合）
    if [ "$OPEN_WEB" = true ]; then
      open https://saedgewell.test
    fi
  elif [ "$OS" = "Linux" ]; then
    # Linux用ブラウザ起動コマンド
    if command -v xdg-open > /dev/null; then
      if [ "$OPEN_WEB" = true ]; then
        xdg-open https://saedgewell.test
      fi
    else
      echo "⚠️ xdg-openコマンドが見つかりません。手動でブラウザを開いてください。"
    fi
  elif [[ "$OS" =~ "MINGW" ]] || [[ "$OS" =~ "MSYS" ]]; then  # Windows Git Bash
    # Windows用ブラウザ起動コマンド
    if [ "$OPEN_WEB" = true ]; then
      start https://saedgewell.test
    fi
  else
    echo "⚠️ 未知のOS: $OS。手動でブラウザを開いてください。"
  fi
  
  echo "✅ ブラウザを自動起動しました"
else
  echo "⚠️ 一部のサービスが起動していないため、ブラウザの自動起動をスキップします"
  echo "   問題を解決した後、手動でアクセスしてください"
fi 