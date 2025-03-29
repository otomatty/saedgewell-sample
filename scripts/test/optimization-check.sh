#!/bin/bash
set -e

echo "=== Docker環境最適化チェックリスト ==="
  
# Docker設定チェック
echo "1/5: Docker設定チェック..."
  
# メモリ設定チェック
MEMORY_INFO=$(docker info | grep -i "total memory")
echo "Docker に割り当てられたメモリ: $MEMORY_INFO"
MEMORY_GB=$(echo $MEMORY_INFO | grep -o '[0-9.]\+GiB')
if [[ $(echo $MEMORY_GB | grep -o '[0-9.]\+') -lt 8 ]]; then
  echo "⚠️ メモリ割り当てが少なすぎる可能性があります (8GB以上推奨)"
else
  echo "✅ メモリ割り当ては十分です"
fi
  
# VirtioFS設定（Apple Silicon）
if [[ $(uname -m) == "arm64" ]]; then
  if docker info | grep -q "Filesystem: virtiofs"; then
    echo "✅ VirtioFSが有効です（最適なパフォーマンス）"
  else
    echo "⚠️ VirtioFSが有効化されていません。Docker Desktop設定で有効化することをお勧めします"
  fi
fi
  
# ボリュームマウント最適化
echo "2/5: ボリュームマウント最適化チェック..."
if docker compose config | grep -q "cached"; then
  echo "✅ キャッシュされたボリュームマウントが使用されています"
else
  echo "⚠️ キャッシュされたボリュームマウントが設定されていません。パフォーマンス向上のため ':cached' を追加してください"
fi
  
# サービスリソース制限
echo "3/5: サービスリソース制限チェック..."
if docker compose config | grep -q "resources"; then
  echo "✅ コンテナリソース制限が設定されています"
else
  echo "⚠️ コンテナリソース制限が設定されていません。安定性向上のために設定を検討してください"
fi
  
# Buildkitの使用確認
echo "4/5: Buildkit最適化チェック..."
if docker info | grep -q "buildkit: true"; then
  echo "✅ Buildkitが有効です（ビルド最適化）"
else
  echo "⚠️ Buildkitが有効化されていません。ビルド高速化のため有効化を検討してください"
  echo "   export DOCKER_BUILDKIT=1 を実行するか環境変数を設定してください"
fi
  
# アプリケーション固有の最適化
echo "5/5: アプリケーション固有の最適化チェック..."
  
# Bunの最適化（Apple Silicon）
if [[ $(uname -m) == "arm64" ]]; then
  if docker compose config | grep -q "BUN_RUNTIME"; then
    echo "✅ Bun最適化フラグが設定されています"
  else
    echo "⚠️ Apple Silicon向けのBun最適化フラグが設定されていません"
  fi
fi
  
# ホットリロード設定
if docker compose config | grep -q "WATCHPACK_POLLING"; then
  echo "✅ ホットリロード用のポーリング設定が有効です"
else
  echo "⚠️ ホットリロード用のポーリング設定が不足しているかもしれません"
fi
  
echo "=== チェック完了 ==="
echo "推奨されている最適化を適用して、パフォーマンスと安定性を向上させてください。" 