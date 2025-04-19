#!/bin/bash
# Public repository synchronization script

set -e

# 公開リポジトリ情報
PUBLIC_REPO_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/otomatty/saedgewell-sample.git"
PUBLIC_BRANCH="main"

# 一時ディレクトリを作成
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# 公開対象のディレクトリ
PUBLIC_DIRS=(.github apps docker nginx packages scripts tooling turbo)

# 公開対象のディレクトリをコピー
for dir in "${PUBLIC_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "Copying directory: $dir"
    mkdir -p "$TEMP_DIR/$dir"
    cp -r "$dir"/* "$TEMP_DIR/$dir/"
  fi
done

# 公開対象のルートファイル
echo "Copying root files"
cp -f README.md LICENSE ACKNOWLEDGMENTS.md tsconfig.json turbo.json biome.json \
   bunfig.toml .npmrc .nvmrc .syncpackrc .gitattributes \
   package.json docker-compose.yml docker-compose.apple-silicon.yml \
   .dockerignore "$TEMP_DIR/"

# .gitignoreも公開用に修正して追加
cp -f .gitignore "$TEMP_DIR/"

# .env.exampleのみコピー（実際の.envファイルは除外）
cp -f .env.example "$TEMP_DIR/"

# 公開すべきでない情報を削除（念のため）
find "$TEMP_DIR" -name "*.env" -not -name "*.env.example" -delete
find "$TEMP_DIR" -name "*.pem" -delete
find "$TEMP_DIR" -name ".DS_Store" -delete

# Gitリポジトリとして初期化
cd "$TEMP_DIR"
git init
git add .
git config --local user.email "github-actions@github.com"
git config --local user.name "GitHub Actions"
git commit -m "Sync from private repository $(date +'%Y-%m-%d %H:%M:%S')"

# 公開リポジトリにプッシュ
echo "Pushing to public repository"
git remote add origin "$PUBLIC_REPO_URL"
git push -f origin HEAD:"$PUBLIC_BRANCH"

# 後片付け
cd -
rm -rf "$TEMP_DIR"
echo "Synchronization completed successfully!" 