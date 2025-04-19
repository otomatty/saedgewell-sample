#!/bin/bash

# JWT設定スクリプト
# PostgreSQLデータベースでJWT秘密鍵を設定し、JWT認証の問題を解決します

# エラーハンドリングの設定
set -e

echo "Supabase JWT秘密鍵設定ツール"
echo "------------------------------"

# Base64エンコードされたシークレットをデコード
JWT_SECRET_BASE64="c3VwZXItc2VjcmV0LWp3dC10b2tlbi13aXRoLWF0LWxlYXN0LTMyLWNoYXJhY3RlcnMtbG9uZw=="
JWT_SECRET=$(echo $JWT_SECRET_BASE64 | base64 -d)
echo "JWTシークレットを準備しました: ${JWT_SECRET}"

# 環境変数ファイルも更新
ENV_FILE=".env.local"
if [ -f "$ENV_FILE" ]; then
  # 既存の環境変数ファイルを更新
  if grep -q "SUPABASE_AUTH_JWT_SECRET" "$ENV_FILE"; then
    sed -i.bak "s/SUPABASE_AUTH_JWT_SECRET=.*/SUPABASE_AUTH_JWT_SECRET=$JWT_SECRET_BASE64/" "$ENV_FILE"
  else
    echo "SUPABASE_AUTH_JWT_SECRET=$JWT_SECRET_BASE64" >> "$ENV_FILE"
  fi
  echo "環境変数ファイルを更新しました"
fi

# PostgreSQLの設定を更新するためのSQLファイルを作成
echo "PostgreSQLの設定を更新するためのSQLファイルを作成..."
cat > /tmp/set_jwt_secret.sql << EOF
-- システム全体のJWT設定を変更
ALTER SYSTEM SET "app.settings.jwt_secret" = '${JWT_SECRET}';
SELECT pg_reload_conf();
-- データベース固有の設定も試行
ALTER DATABASE postgres SET "app.settings.jwt_secret" = '${JWT_SECRET}';
EOF

# SQLファイルをコンテナにコピーして実行
echo "SQLファイルをPostgreSQLコンテナにコピーして実行..."
docker cp /tmp/set_jwt_secret.sql supabase_db_saedgewell:/tmp/
docker exec supabase_db_saedgewell bash -c "chmod 644 /tmp/set_jwt_secret.sql"
docker exec supabase_db_saedgewell psql -U postgres -f /tmp/set_jwt_secret.sql

# データベースとPostgRESTの再起動
echo "データベース設定を適用するためにサービスを再起動しています..."
docker restart supabase_db_saedgewell
docker restart supabase_rest_saedgewell

echo "JWT設定が完了しました"
echo "アプリケーションのコンテナも再起動することを推奨します"
echo "コマンド実行例: docker-compose restart web docs admin" 