#!/bin/bash
set -e

echo "=== PostgREST修正スクリプト ==="

# JWT秘密鍵
JWT_SECRET="super-secret-jwt-token-with-at-least-32-characters-long"
JWT_SECRET_BASE64=$(echo -n $JWT_SECRET | base64)
echo "JWT秘密鍵: $JWT_SECRET"
echo "Base64エンコード済みJWT秘密鍵: $JWT_SECRET_BASE64"

# 既存のPostgRESTコンテナを停止・削除
echo "既存のPostgRESTコンテナを停止・削除..."
docker stop supabase_rest_saedgewell || true
docker rm supabase_rest_saedgewell || true

# 新しいPostgRESTコンテナを起動
echo "新しいPostgRESTコンテナを起動..."
# 注: "host.docker.internal"ではなく"supabase_db_saedgewell"をホスト名として使用
CONTAINER_ID=$(docker run -d --name supabase_rest_saedgewell \
  --network supabase_network_saedgewell \
  -e PGRST_DB_URI="postgres://authenticator:postgres@supabase_db_saedgewell:5432/postgres" \
  -e PGRST_DB_SCHEMA="public,storage,graphql_public" \
  -e PGRST_DB_ANON_ROLE="anon" \
  -e PGRST_JWT_SECRET=$JWT_SECRET_BASE64 \
  -e PGRST_DB_USE_LEGACY_GUCS="false" \
  public.ecr.aws/supabase/postgrest:v12.2.3)

if [ -z "$CONTAINER_ID" ]; then
  echo "エラー: PostgRESTコンテナの起動に失敗しました"
  exit 1
fi

echo "PostgRESTコンテナ(ID: ${CONTAINER_ID})が正常に起動しました"

# .env.localファイルを更新
echo "ローカル環境ファイルを更新..."
ENV_FILE=".env.local"
if [ -f "$ENV_FILE" ]; then
  # JWTシークレットを更新
  grep -q "SUPABASE_AUTH_JWT_SECRET" $ENV_FILE && \
    sed -i.bak "s|SUPABASE_AUTH_JWT_SECRET=.*|SUPABASE_AUTH_JWT_SECRET=$JWT_SECRET_BASE64|" $ENV_FILE || \
    echo "SUPABASE_AUTH_JWT_SECRET=$JWT_SECRET_BASE64" >> $ENV_FILE
  
  echo "環境変数ファイルを更新しました"
else
  echo "警告: $ENV_FILE が見つかりません"
fi

# Webコンテナの環境変数を更新
echo "Webコンテナの環境変数を更新..."
WEB_CONTAINER_ID=$(docker ps --filter name=saedgewell-web-1 --format "{{.ID}}")
if [ -n "$WEB_CONTAINER_ID" ]; then
  docker cp $ENV_FILE $WEB_CONTAINER_ID:/app/.env.local
  echo "Webコンテナの環境変数を更新しました"
else
  echo "警告: Webコンテナが見つかりません"
fi

# アプリケーションコンテナの再起動
echo "アプリケーションコンテナを再起動..."
docker-compose restart web docs admin

echo "=== 修正完了 ==="
echo "PostgRESTが正常に起動しているか確認してください" 