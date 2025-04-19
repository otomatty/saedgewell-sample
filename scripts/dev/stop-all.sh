#!/bin/bash
set -e

echo "全サービスを停止しています..."

# オプションを解析
REMOVE_VOLUMES=false
for arg in "$@"; do
  case $arg in
    --remove-volumes|-rv)
      REMOVE_VOLUMES=true
      shift
      ;;
  esac
done

# Docker Composeサービスを停止
if [ "$REMOVE_VOLUMES" = true ]; then
  echo "全てのコンテナとボリュームを削除します..."
  docker compose down -v
else
  echo "全てのコンテナを停止します（ボリュームは保持）..."
  docker compose down
fi

# プロセスの停止状態を確認
echo "サービスの停止状態を確認しています..."
if docker compose ps | grep -q "Up"; then
  echo "❌ 一部のサービスがまだ実行中です："
  docker compose ps | grep "Up"
  echo "手動で停止するには: docker compose down"
  exit 1
else
  echo "✅ 全てのサービスが正常に停止しました"
fi

# ポートの確認
for PORT in 80; do
  if lsof -i :$PORT > /dev/null 2>&1; then
    echo "⚠️ 警告: ポート $PORT がまだ使用されています"
    echo "   使用中のプロセス: $(lsof -i :$PORT | tail -n +2 | awk '{print $1}')"
  fi
done

echo "開発環境を完全に停止しました"
echo "再度起動するには: ./scripts/dev/start-for-arch.sh（アーキテクチャ最適化環境）"
echo "または: ./scripts/dev/start-dev-apps.sh（アプリケーションのみ）" 