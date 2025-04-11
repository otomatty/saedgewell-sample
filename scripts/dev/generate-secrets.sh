#!/bin/bash
mkdir -p ./secrets

# パスワード生成（ランダムな32文字の文字列）
if [ ! -f ./secrets/db_password.txt ]; then
  openssl rand -base64 32 > ./secrets/db_password.txt
  echo "データベースパスワードを生成しました"
fi

# JWT Secret生成（ランダムな64文字の文字列）
if [ ! -f ./secrets/jwt_secret.txt ]; then
  openssl rand -base64 64 > ./secrets/jwt_secret.txt
  echo "JWTシークレットを生成しました"
fi 