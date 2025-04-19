#!/bin/bash

# JWT認証デバッグスクリプト
# Supabaseとの接続問題、特にJWT署名エラーをデバッグするためのツール

# エラーハンドリングの設定
set -e

echo "Supabase JWT認証デバッグツール"
echo "-----------------------------"

# 環境変数の確認
echo "環境変数の確認:"
echo "NEXT_PUBLIC_SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL"
echo "SUPABASE_AUTH_JWT_SECRET: ${SUPABASE_AUTH_JWT_SECRET:0:10}... (最初の10文字のみ表示)"

# PostgreSQLデータベースの設定確認
echo -e "\nPostgreSQLデータベース設定の確認:"
docker exec supabase_db_saedgewell psql -U postgres -c "SHOW app.settings.jwt_secret;"

# PostgRESTコンテナの設定確認
echo -e "\nPostgRESTコンテナの情報確認:"
docker exec supabase_rest_saedgewell env | grep JWT

# テスト接続
echo -e "\nSupabase APIへのテスト接続:"
curl -v "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY"

echo -e "\n\nデバッグ情報の取得が完了しました"
echo "JWT_SECRET不一致がある場合は scripts/dev/setup-jwt-secret.sh を実行してください" 