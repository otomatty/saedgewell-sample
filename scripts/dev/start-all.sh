#!/bin/bash
set -e

echo "開発環境を完全に起動しています..."

# すでに実行中のサービスがないか確認
echo "既存のサービスをチェックしています..."
./scripts/dev/stop-all.sh || true

# HTTPS証明書の生成
echo "HTTPS証明書を確認しています..."
if [ ! -f "./docker/nginx/certs/saedgewell.crt" ]; then
  echo "HTTPS証明書が見つかりません。新しい証明書を生成します..."
  ./scripts/dev/setup-https-certs.sh
else
  echo "既存のHTTPS証明書が見つかりました。"
fi

# アーキテクチャに最適化された環境を起動
echo "アプリケーションを起動しています..."
./scripts/dev/start-for-arch.sh

echo "全ての開発環境が起動しました"
echo ""
echo "アクセスURL:"
echo "- Web: https://saedgewell.test"
echo "- Docs: https://docs.saedgewell.test"
echo "- Admin: https://admin.saedgewell.test"
echo ""
echo "停止するには: ./scripts/dev/stop-all.sh" 