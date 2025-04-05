# テンプレートリポジトリ管理ガイド

このガイドでは、このプロジェクトをテンプレートリポジトリとして使用し、子プロジェクトで親プロジェクトの更新を取り込む方法について説明します。

## 目次

1. [親プロジェクトの設定](#親プロジェクトの設定)
2. [子プロジェクトの作成](#子プロジェクトの作成)
3. [子プロジェクトの初期設定](#子プロジェクトの初期設定)
4. [更新の管理](#更新の管理)
5. [トラブルシューティング](#トラブルシューティング)

## 親プロジェクトの設定

### 1. GitHubでテンプレートリポジトリとして設定

1. GitHubのリポジトリページに移動
2. Settings > Template repository にチェックを入れる
3. 必要に応じてリポジトリの説明を更新

### 2. 更新管理用ファイルの準備

以下のファイルが正しく設定されていることを確認：

- `.gitattributes`: マージ戦略の設定
- `scripts/update-from-template.sh`: 更新スクリプト

## 子プロジェクトの作成

### 1. テンプレートからリポジトリを作成

1. 親プロジェクトのGitHubページで「Use this template」をクリック
2. 新しいリポジトリ名を入力
3. 「Create repository from template」をクリック

### 2. ローカル環境のセットアップ

```bash
# 親リポジトリをupstreamとして追加
git remote add upstream https://github.com/otomatty/super-next-app.git
git fetch upstream
```

## 子プロジェクトの初期設定

### 1. プロジェクト固有の設定

1. `package.json`の更新
```bash
# プロジェクト名とバージョンの更新
bun install
```

2. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集して必要な値を設定
```

### 2. gitattributesの確認

`.gitattributes`ファイルが存在し、以下の設定が含まれていることを確認：

\`\`\`
# パッケージ関連ファイルは親プロジェクトの変更を優先
packages/* merge=recursive-ours
# ドキュメント関連も親プロジェクトの変更を優先
docs/* merge=recursive-ours

# 子プロジェクト固有の設定ファイルは子プロジェクトの変更を維持
apps/* merge=recursive-theirs
.env* merge=recursive-theirs
\`\`\`

### 3. 更新スクリプトの準備

1. スクリプトの実行権限を付与
```bash
chmod +x scripts/update-from-template.sh
```

## 更新の管理

### 1. 自動更新の設定

子プロジェクトでは、GitHub Actionsを使用して自動更新を設定できます：

1. `.github/workflows/template-sync.yml`が存在することを確認
2. デフォルトでは1日おきの午前0時に自動更新を確認
3. GitHub上から手動でも実行可能
4. 更新がある場合、自動的にプルリクエストが作成されます

更新対象となるディレクトリ：
- `packages/`: 共有パッケージ
- `docs/`: ドキュメント
- `tooling/`: ツール類
- ルートディレクトリの設定ファイル（*.json, *.toml, *.yml, .gitattributes など）

除外対象：
- `apps/`: アプリケーション固有のコード

### 2. 定期的な更新

親プロジェクトの変更を取り込む場合：

```bash
./scripts/update-from-template.sh
```

### 3. 選択的な更新

特定のディレクトリやファイルのみ更新する場合：

```bash
# packagesディレクトリの更新
git checkout upstream/main -- packages/

# 特定のパッケージの更新
git checkout upstream/main -- packages/ui/
```

### 4. コンフリクトの解決

1. コンフリクトが発生した場合：
   - `.gitattributes`の設定に従って自動的に解決されるものもある
   - 手動での解決が必要な場合は、変更内容を確認して適切にマージ

2. 重要なファイルの確認：
   - `package.json`の依存関係
   - 設定ファイル
   - 共有コンポーネント

## トラブルシューティング

### 1. よくある問題と解決方法

1. マージコンフリクトが多発する場合：
   - `.gitattributes`の設定を見直す
   - 更新頻度を上げて、一度の更新での変更量を減らす

2. 依存関係の問題：
   - `bun install`を実行
   - `node_modules`を削除して再インストール

3. ブランチの問題：
   - `git fetch upstream --prune`で古い参照を削除
   - 必要に応じて`git reset --hard upstream/main`で強制リセット

### 2. サポートとヘルプ

- 問題が発生した場合は、親プロジェクトのIssuesを確認
- 解決できない問題は、新しいIssueを作成

## ベストプラクティス

1. 更新の頻度
   - 定期的な更新を推奨（週1回程度）
   - 重要な更新がある場合は即時対応

2. テストとレビュー
   - 更新後は必ずテストを実行
   - CI/CDパイプラインでの確認
   - コードレビューの実施

3. コミュニケーション
   - 重要な更新は子プロジェクトのチームに通知
   - 更新履歴の文書化 