#!/bin/bash
# 本番環境からデータをローカルに取り込むためのスクリプト

echo "===== Supabase本番環境からローカル環境へのデータ同期 ====="

# マイグレーションファイルのバックアップを作成
echo "📁 マイグレーションファイルのバックアップを作成しています..."
mkdir -p supabase/migrations.bak.$(date +%Y%m%d%H%M%S)
cp -r supabase/migrations/* supabase/migrations.bak.$(date +%Y%m%d%H%M%S)/

# 本番環境がリンクされていることを確認
echo "🔗 本番環境との連携を確認しています..."
supabase link --project-ref pkgvisiqnidmpqchosnv

# 本番環境からスキーマを取得
echo "📥 本番環境からスキーマを取得しています..."
supabase db pull

# マイグレーションファイルのエラー箇所を修正
echo "🔧 マイグレーションファイルを修正しています..."
for file in supabase/migrations/*.sql; do
  # storage.get_level関数の削除行をコメントアウト
  sed -i '' 's/drop function if exists "storage"."get_level"(name text);/-- drop function if exists "storage"."get_level"(name text);/g' $file
  echo "  - $file を修正しました"
done

# シードデータを取得（--data-onlyフラグで構造ではなくデータのみを取得）
echo "🌱 シードデータを取得しています..."
supabase db dump -f ./supabase/seed.sql --data-only

# データベースをリセットしてシードデータを適用
echo "🔄 データベースをリセットしてシードデータを適用しています..."
supabase db reset

# 完了確認
echo "✅ 同期が完了しました！"
echo "以下のコマンドで動作確認ができます："
echo "  psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c \"SELECT count(*) FROM profiles;\""
echo "  psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c \"SELECT count(*) FROM projects;\"" 