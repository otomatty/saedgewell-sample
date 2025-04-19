#!/bin/bash
set -e

echo "=== Docker環境パフォーマンス計測 ==="

echo "ホスト側のSupabaseを使用しています（ポート54321）"

# ビルド時間の計測
echo "1/4: ビルド時間計測..."
START_BUILD=$(date +%s.%N)
docker compose build
END_BUILD=$(date +%s.%N)
BUILD_DIFF=$(echo "$END_BUILD - $START_BUILD" | bc)
echo "ビルド時間: ${BUILD_DIFF}秒"

# ホットリロード応答時間の計測
echo "2/4: ホットリロード応答時間計測..."
START=$(date +%s.%N)

# テスト用の一時ファイルに変更を加える（Reactコンポーネントを壊さないように）
TIMESTAMP=$(date)
mkdir -p apps/web/public/test
echo "// テスト変更 ${TIMESTAMP}" > apps/web/public/test/timestamp.txt

# 変更の伝播を待機
sleep 3

curl -s --head --retry 10 --retry-delay 1 http://web.saedgewell.test | grep -q "200"
END=$(date +%s.%N)
DIFF=$(echo "$END - $START" | bc)
echo "ホットリロード応答時間: ${DIFF}秒"

# コンテナのリソース使用量計測
echo "3/4: コンテナリソース使用量計測..."
docker stats --no-stream

# Supabase認証レスポンス時間計測
echo "4/4: Supabase認証レスポンス時間計測..."
AUTH_START=$(date +%s.%N)
curl -s -o /dev/null -w "%{time_total}s\n" http://localhost:54321/auth/v1/health
AUTH_END=$(date +%s.%N)
AUTH_DIFF=$(echo "$AUTH_END - $AUTH_START" | bc)
echo "認証API応答時間: ${AUTH_DIFF}秒"

echo "=== 計測完了 ===" 