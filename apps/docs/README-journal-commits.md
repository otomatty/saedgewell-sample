# 日記エントリのコミット情報自動更新機能

このプロジェクトでは、GitHub上のコミット情報を日記エントリに自動的に反映させる機能が実装されています。これにより、各日の開発活動が視覚的に表示され、進捗状況を容易に確認できます。

## 機能概要

- 指定したGitHubユーザーの全リポジトリからコミット情報を収集
- コミット情報を日付ごとにグループ化
- 追加行数、削除行数、変更ファイル数などの詳細情報を表示
- GitHubへのプッシュ時に自動的に更新（GitHub Actions経由）

## 自動更新の仕組み

このプロジェクトには以下の自動化が実装されています：

1. リポジトリのメインブランチへのプッシュが行われると、GitHub Actionsワークフローが起動
2. ワークフローは`update-journal-commits.ts`スクリプトを実行し、最新のコミット情報を取得
3. 更新されたコミット情報は各日付ディレクトリの`index.json`ファイルに保存
4. 変更があれば自動的にコミットしてプッシュ

## 手動での実行方法

自動更新に加えて、手動でスクリプトを実行することも可能です：

```bash
# 特定ユーザーの全リポジトリからコミット情報を取得
cd apps/docs
npx ts-node scripts/update-journal-commits.ts --user <GitHubユーザー名>

# または特定リポジトリのコミット情報を取得
npx ts-node scripts/update-journal-commits.ts --owner <オーナー名> --repo <リポジトリ名>
```

## GitHub Actionsでの手動実行

GitHub Actionsのワークフローは「Actions」タブから手動で実行することもできます：

1. リポジトリのGitHubページにアクセス
2. 「Actions」タブを選択
3. 「Update Journal Commits」ワークフローを選択
4. 「Run workflow」ボタンをクリック

## 注意事項

- GitHub APIにはレート制限があるため、短時間に何度も実行するとエラーになる可能性があります
- リポジトリ数や期間が多い場合、実行に時間がかかることがあります
- 適切な権限設定がされたGitHubトークンが必要です 