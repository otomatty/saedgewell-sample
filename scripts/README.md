# スクリプトディレクトリ

このディレクトリには、プロジェクトの様々な自動化スクリプトが含まれています。

## 公開リポジトリ同期スクリプト

`sync-public-repo.sh` スクリプトは、このプライベートリポジトリの特定のディレクトリとファイルを公開リポジトリに同期するために使用されます。

### 使用方法

#### GitHub Actionsによる自動実行

このスクリプトはGitHub Actionsによって自動的に実行されます。`main`ブランチに対するプッシュがあり、指定されたパスに変更がある場合に実行されます。

設定ファイルは `.github/workflows/sync-public-repo.yml` にあります。

#### 手動実行

手動でスクリプトを実行する場合は、以下のコマンドを使用します：

```bash
# 環境変数を設定
export GITHUB_TOKEN=your_personal_access_token

# スクリプトを実行可能にする
chmod +x ./scripts/sync-public-repo.sh

# スクリプトを実行
./scripts/sync-public-repo.sh
```

### 同期対象

以下のディレクトリとファイルが公開リポジトリに同期されます：

- ディレクトリ: `.github/`, `apps/`, `docker/`, `nginx/`, `packages/`, `scripts/`, `tooling/`, `turbo/`
- ルートファイル: `README.md`, `LICENSE`, `ACKNOWLEDGMENTS.md`, その他設定ファイル

### GitHub Personal Access Tokenの設定

GitHub Actionsで自動的に同期するには、以下の手順で設定が必要です：

1. GitHub Personal Access Tokenを作成する（リポジトリの書き込み権限が必要）
2. プライベートリポジトリの設定でシークレット `PUBLIC_REPO_TOKEN` を追加し、作成したトークンを設定する

### 注意事項

- 公開リポジトリは手動で作成し、存在している必要があります
- 同期はforce pushを使用するため、公開リポジトリに直接変更を加えないようにしてください
- 機密情報（.envファイルなど）は自動的に除外されますが、念のため公開前に確認することをお勧めします 