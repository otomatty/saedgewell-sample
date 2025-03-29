#!/bin/bash
set -e

echo "スクリプトファイルに実行権限を付与しています..."

# devディレクトリ内のスクリプト
find ./scripts/dev -type f -name "*.sh" -exec chmod +x {} \;
echo "✅ dev スクリプトに実行権限を付与しました"

# testディレクトリ内のスクリプト
find ./scripts/test -type f -name "*.sh" -exec chmod +x {} \;
echo "✅ test スクリプトに実行権限を付与しました"

# buildディレクトリ内のスクリプト
find ./scripts/build -type f -name "*.sh" -exec chmod +x {} \;
echo "✅ build スクリプトに実行権限を付与しました"

# deployディレクトリ内のスクリプト
find ./scripts/deploy -type f -name "*.sh" -exec chmod +x {} \;
echo "✅ deploy スクリプトに実行権限を付与しました"

# このスクリプト自体にも実行権限を付与
chmod +x ./scripts/setup-permissions.sh

echo "✅ すべてのスクリプトに実行権限を付与しました"
echo "これでDockerとSupabase関連のスクリプトがすべて実行可能になりました" 