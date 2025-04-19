#!/bin/bash
set -e

echo "Supabase Docker環境を起動します..."

# 必ず既存のSupabaseをチェック
if [ -f "./scripts/dev/check-local-supabase.sh" ]; then
  echo "既存のSupabaseプロセスをチェックしています..."
  ./scripts/dev/check-local-supabase.sh || {
    echo "❌ 既存のSupabaseプロセスのチェックでエラーが発生しました。"
    echo "   既存のプロセスを適切に停止してから再試行してください。"
    exit 1
  }
else
  echo "⚠️ 警告: check-local-supabase.shスクリプトが見つかりません。"
  echo "   既存のSupabaseプロセスが実行中でないことを確認してください。"
  
  # 基本的なポートチェック
  for PORT in 54321 54322 54323 54324; do
    if lsof -i :$PORT > /dev/null 2>&1; then
      echo "❌ エラー: ポート $PORT が既に使用されています。"
      echo "   既存のSupabaseプロセスが実行中の可能性があります。"
      echo "   先に停止してから再試行してください。"
      exit 1
    fi
  done
fi

# シークレットの確認
if [ ! -f "./secrets/db_password.txt" ] || [ ! -f "./secrets/jwt_secret.txt" ]; then
  echo "シークレットファイルが見つかりません。生成します..."
  if [ -f "./scripts/dev/generate-secrets.sh" ]; then
    ./scripts/dev/generate-secrets.sh
  else
    echo "⚠️ 警告: generate-secrets.shスクリプトが見つかりません。"
    echo "   手動でシークレットを設定してください。"
  fi
fi

echo "Supabaseコンテナを起動しています..."
docker compose up supabase -d

echo "Supabaseサービスの起動を待機しています..."
MAX_RETRIES=10
RETRY_COUNT=0

until curl -s http://localhost:54321/health > /dev/null; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "❌ タイムアウト: Supabase APIが応答しません。ログを確認してください:"
    echo "   docker compose logs supabase"
    exit 1
  fi
  echo "Supabase APIの起動を待機中... ($RETRY_COUNT/$MAX_RETRIES)"
  sleep 5
done

echo "✅ Supabase APIが正常に応答しています"

# マイグレーションを実行する前に確認
read -p "データベースマイグレーションを実行しますか？(y/n): " RUN_MIGRATIONS

if [ "$RUN_MIGRATIONS" = "y" ]; then
  echo "マイグレーションを実行しています..."
  docker compose exec supabase supabase db reset -f
  echo "✅ マイグレーション完了"
fi

echo "======================================"
echo "🎉 Supabaseが正常に起動しました！"
echo "アクセスURL:"
echo "- API: http://localhost:54321"
echo "- Studio: http://localhost:54323"
echo "- Inbucket (メール): http://localhost:54324"
echo "======================================" 