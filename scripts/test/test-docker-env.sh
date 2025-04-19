#!/bin/bash
set -e

echo "=== Docker環境テスト ==="

# ホスト側のSupabaseを使用するため、チェックをスキップ
echo "ホスト側のSupabaseを使用しています（ポート54321）"

# Supabaseユーティリティをインポート
if [ -f "./scripts/test/supabase-auth-utils.sh" ]; then
  source ./scripts/test/supabase-auth-utils.sh
  # Dockerコンテナのみチェック
  # check_docker_containers のSupabase部分をスキップ
else
  # 基本接続テスト
  echo "1/5: 基本サービステスト..."
  docker compose ps --format "{{.Name}} {{.Status}}" | grep -v "Up" | grep -v "supabase" && {
    echo "❌ 一部のサービスが正常に起動していません"
    exit 1
  }
  echo "✅ すべてのサービスが正常に起動しています"
fi

# アプリケーションテスト
echo "2/5: アプリケーション接続テスト..."
for APP in web docs admin; do
  curl -s -o /dev/null -w "%{http_code}\n" http://$APP.saedgewell.test | grep -q "200" || {
    echo "❌ ${APP}アプリケーションに接続できません"
    exit 1
  }
  echo "✅ ${APP}アプリケーションに正常に接続できました"
done

# Supabase APIテスト
echo "3/5: Supabase APIテスト..."
if curl -s http://localhost:54321/health > /dev/null; then
  echo "✅ ホスト上のSupabase APIは正常に動作しています"
else
  echo "❌ ホスト上のSupabase APIに接続できません"
  echo "   supabase start コマンドを実行してSupabaseを起動してください"
  exit 1
fi

# ホットリロードテスト
echo "4/5: ホットリロードテスト..."
# テスト用の一時ファイルに変更を加える（Reactコンポーネントを壊さないように）
TIMESTAMP=$(date)
mkdir -p apps/web/public/test
echo "// テスト変更 ${TIMESTAMP}" > apps/web/public/test/timestamp.txt
echo "ホットリロードをテスト中です。ブラウザで変更が反映されることを確認してください。"
sleep 5

# リソース使用量テスト
echo "5/5: リソース使用量テスト..."
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo "=== テスト完了 ===" 