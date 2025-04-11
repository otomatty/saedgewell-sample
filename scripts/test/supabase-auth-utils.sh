#!/bin/bash

# Supabase認証テスト用の共通ユーティリティ関数

# 既存のSupabaseプロセスをチェック
check_local_supabase() {
  if [ -f "./scripts/dev/check-local-supabase.sh" ]; then
    ./scripts/dev/check-local-supabase.sh || {
      echo "既存のSupabaseプロセスが検出されました。Docker環境でテストする前に停止してください。"
      exit 1
    }
  else
    # ポートチェックのみ実行
    for PORT in 54321 54322 54323; do
      if lsof -i :$PORT > /dev/null 2>&1; then
        echo "⚠️ 警告: ポート $PORT が既に使用されています。既存のSupabaseが実行中の可能性があります。"
        echo "Docker環境でテストする前に、既存のSupabaseを停止してください。"
        exit 1
      fi
    done
  fi
}

# Dockerコンテナのテスト準備
check_docker_containers() {
  # Supabaseが起動しているか確認
  if ! docker compose ps | grep -q "supabase.*running"; then
    echo "❌ Supabaseコンテナが実行されていません。先に起動してください。"
    echo "コマンド: docker compose up -d supabase"
    exit 1
  fi
  
  # 他の必要なサービスが起動しているか確認
  for SERVICE in web docs admin; do
    if ! docker compose ps | grep -q "$SERVICE.*running"; then
      echo "⚠️ 警告: $SERVICE コンテナが実行されていません。テストに影響する可能性があります。"
    fi
  done
}

# Supabase APIの健全性チェック
check_supabase_api() {
  echo "Supabase API健全性チェック..."
  if ! curl -s http://localhost:54321/health > /dev/null; then
    echo "❌ Supabase APIに接続できません。コンテナが正常に起動しているか確認してください。"
    exit 1
  fi
  echo "✅ Supabase APIは正常に動作しています"
} 