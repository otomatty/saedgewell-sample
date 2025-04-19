#!/bin/bash
set -e

echo "ローカル開発環境用のHTTPS証明書を生成しています..."

# mkcertがインストールされているか確認
if ! command -v mkcert &> /dev/null; then
  echo "❌ mkcertがインストールされていません"
  echo "macOSの場合: brew install mkcert"
  echo "Linuxの場合: apt-get install mkcert または同等のコマンド"
  exit 1
fi

# 証明書ディレクトリの作成
CERT_DIR="./docker/nginx/certs"
mkdir -p $CERT_DIR

# ローカルCAのインストール
echo "ローカル認証局をインストールしています..."
mkcert -install

# saedgewell.testとそのサブドメイン用の証明書を生成
echo "saedgewell.testとサブドメイン用の証明書を生成しています..."
mkcert -key-file $CERT_DIR/saedgewell.key -cert-file $CERT_DIR/saedgewell.crt "*.saedgewell.test" "saedgewell.test"

echo "✅ HTTPS証明書の生成が完了しました"
echo "証明書とキーファイルが $CERT_DIR に保存されました" 