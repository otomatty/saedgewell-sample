#!/bin/bash
set -e

echo "=== HTTPS環境のテスト ==="

# 証明書の存在確認
echo "1/4: 証明書の確認..."
if [ ! -f "./docker/nginx/certs/saedgewell.crt" ] || [ ! -f "./docker/nginx/certs/saedgewell.key" ]; then
  echo "❌ 証明書ファイルが見つかりません"
  echo "証明書を生成するには: ./scripts/dev/setup-https-certs.sh を実行してください"
  exit 1
fi
echo "✅ 証明書ファイルが存在します"

# Nginxの設定確認
echo "2/4: Nginx HTTPS設定の確認..."
if ! grep -q "listen 443 ssl" ./docker/nginx/conf.d/default.conf; then
  echo "❌ Nginxの設定にHTTPSの設定が見つかりません"
  exit 1
fi
echo "✅ Nginxの設定にHTTPSの設定が含まれています"

# Docker Composeの確認
echo "3/4: Docker Compose設定の確認..."
if ! grep -q "\"443:443\"" docker-compose.yml; then
  echo "❌ Docker Composeの設定にポート443のマッピングが含まれていません"
  exit 1
fi
echo "✅ Docker Composeの設定にポート443のマッピングが含まれています"

# HTTPSへのアクセス確認
echo "4/4: HTTPSアクセスのテスト..."
echo "各サブドメインへのHTTPSアクセスをテストしています..."

for APP in web docs admin; do
  echo "[$APP] HTTPS接続をテストしています..."
  
  # curlがHTTPSを使ってステータスコードを返すか確認
  # -k オプションは自己署名証明書を許可するため使用
  STATUS=$(curl -s -k -o /dev/null -w "%{http_code}" https://$APP.saedgewell.test)
  
  if [ "$STATUS" -eq 200 ] || [ "$STATUS" -eq 302 ]; then
    echo "✅ https://$APP.saedgewell.test にアクセスできました (ステータス: $STATUS)"
  else
    echo "❌ https://$APP.saedgewell.test へのアクセスに失敗しました (ステータス: $STATUS)"
  fi
done

echo ""
echo "=== テスト完了 ==="

# リダイレクトの確認
echo "HTTPからHTTPSへのリダイレクト確認:"
for APP in web docs admin; do
  REDIRECT=$(curl -s -I -o /dev/null -w "%{redirect_url}" http://$APP.saedgewell.test)
  if [[ "$REDIRECT" == https://* ]]; then
    echo "✅ http://$APP.saedgewell.test は正しくリダイレクトされています → $REDIRECT"
  else
    echo "❌ http://$APP.saedgewell.test のリダイレクトに問題があります: $REDIRECT"
  fi
done 