#!/bin/bash

HOSTS=("saedgewell.test" "docs.saedgewell.test" "admin.saedgewell.test")
HOSTS_FILE="/etc/hosts"
IP="127.0.0.1"

# すでに設定があるか確認
NEEDS_UPDATE=false
for HOST in "${HOSTS[@]}"; do
  if ! grep -q "$HOST" "$HOSTS_FILE"; then
    NEEDS_UPDATE=true
    break
  fi
done

if $NEEDS_UPDATE; then
  echo "以下のホストエントリを $HOSTS_FILE に追加します:"
  for HOST in "${HOSTS[@]}"; do
    echo " - $HOST"
  done
  
  echo "パスワードを入力してください（hostsファイル編集に必要）"
  
  # ホストエントリを追加
  for HOST in "${HOSTS[@]}"; do
    sudo sh -c "echo '$IP $HOST' >> $HOSTS_FILE"
  done
  
  # DNS再キャッシュ（Mac OS X）
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "DNSキャッシュをフラッシュしています..."
    sudo dscacheutil -flushcache
    sudo killall -HUP mDNSResponder
  fi
  
  echo "ローカルドメイン設定が完了しました！"
else
  echo "ホストエントリはすでに存在しています。変更は不要です。"
fi

# DNSテスト
echo "DNSテスト実行中..."
for HOST in "${HOSTS[@]}"; do
  ping -c 1 $HOST > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "✓ $HOST にアクセス可能"
  else
    echo "✗ $HOST にアクセスできません。設定を確認してください"
  fi
done 