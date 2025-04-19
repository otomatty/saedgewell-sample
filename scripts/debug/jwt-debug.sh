#!/bin/bash

# スクリプトの目的：JWTトークン検証問題のデバッグモードを有効にする

echo "Supabaseのログレベルを上げてJWT検証の詳細を確認します..."

# Supabaseのステータス確認
supabase status

# Supabase サービスの詳細なログを表示（デバッグモード）
echo "supabase logs --level=debug"
supabase logs --level=debug auth

# Auth サービスのJWT関連のログを表示
echo "Auth サービスのJWTログ:"
supabase logs auth | grep -i jwt

echo "完了しました。上記のログを確認して、JWT検証の問題を分析してください。" 