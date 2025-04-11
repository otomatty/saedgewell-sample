# Journals

このディレクトリには日付ごとの開発日誌（Journal）が保存されています。

## ディレクトリ構造

Journalは以下のような構造で管理されています：

```
journals/
├── 2025-03-21/                 # 日付ディレクトリ
│   ├── index.json              # その日のエントリー一覧とコミット情報
│   ├── local-https-implementation.mdx   # 個別のエントリー
│   └── docker-jwt-authentication-debugging.mdx
├── 2025-03-22/
│   ├── index.json
│   └── ...
└── ...
```

## 日記ディレクトリの自動作成

最新の日付ディレクトリから今日（または指定した終了日）までの範囲で、存在しない日付ディレクトリを自動的に作成できます。

```bash
cd apps/docs

# 最新の日付から今日までのディレクトリを作成
bun run create:journal:dirs

# 既存のindex.jsonも含めて強制的に作成
bun run create:journal:dirs -- --force

# 詳細なログを表示
bun run create:journal:dirs -- --verbose

# 特定の日付までのディレクトリを作成（未来の日付も指定可能）
bun run create:journal:dirs -- --end-date 2025-04-01
```

このスクリプトは以下の処理を行います：

1. 既存の日付ディレクトリから最新の日付を検出
2. 最新の日付の翌日から今日（または指定した終了日）までの範囲を計算
3. 各日付のディレクトリとindex.jsonファイルを作成

### オプション

- `--help` - ヘルプを表示
- `--force` - 既存のindex.jsonを上書きして強制的に作成
- `--verbose` - 詳細な情報を表示
- `--end-date` - 終了日を指定（YYYY-MM-DD形式、未来の日付も指定可能）

実行例：

```bash
日記ディレクトリの自動作成を開始します...
カレントディレクトリ: /Users/sugaiakimasa/apps/saedgewell/apps/docs
プロジェクトルート: /Users/sugaiakimasa/apps/saedgewell
Journalsパス: /Users/sugaiakimasa/apps/saedgewell/.docs/journals
最新の日付ディレクトリ: 2025-03-25
指定された終了日: 2025-03-28
終了日: 2025-03-28
作成対象の日付: 2025-03-26, 2025-03-27, 2025-03-28
  2025-03-26: ディレクトリを作成しました
  2025-03-26: index.jsonを作成しました
  2025-03-27: ディレクトリを作成しました
  2025-03-27: index.jsonを作成しました
  2025-03-28: ディレクトリを作成しました
  2025-03-28: index.jsonを作成しました

処理結果サマリー:
- 作成した日付ディレクトリ: 3個
- 作成したindex.jsonファイル: 3個 
- 対象日付範囲: 3個

処理が完了しました
```

## エントリーの作成方法

1. 対象の日付ディレクトリを作成（例: `journals/2025-03-21/`）
2. MDXファイルを作成（例: `local-https-implementation.mdx`）
3. フロントマターに必要な情報を記述

```md
---
title: 'エントリーのタイトル'
description: '簡単な説明'
date: '2025-03-21'
author: '作者名'
tags: ['タグ1', 'タグ2', 'タグ3']
---

# 本文

エントリーの内容...
```

## index.jsonの更新方法

各日付ディレクトリのindex.jsonファイルは、自動的に更新できます。スクリプトは変更を検出し、必要な場合のみindex.jsonを更新します。

```bash
cd apps/docs

# すべてのディレクトリを処理（変更があるディレクトリのみ更新）
bun run update:journal:entries

# 特定の日付のディレクトリのみを処理
bun run update:journal:entries -- --dir 2025-03-21

# 変更確認をスキップして強制的に全ディレクトリを更新
bun run update:journal:entries -- --force

# GitHubコミット情報を更新
bun run update:journal:commits

# MDXフロントマーターとGitHubコミット情報の両方を一度に更新
bun run update:journal
```

### オプション

- `--dir <YYYY-MM-DD>`: 指定した日付ディレクトリのみを処理
- `--force`: タイムスタンプに関わらず強制的に更新（通常は変更があった場合のみ更新）

### 変更検出の仕組み

スクリプトは以下の条件に基づいて更新が必要かどうかを判断します：

1. index.jsonが存在しない場合は更新が必要
2. MDXファイルがindex.jsonよりも新しい（最終更新日時が新しい）場合は更新が必要
3. MDXファイル数とindex.jsonのentriesの数が一致しない場合は更新が必要

これにより、変更がないディレクトリに対しては不要な処理をスキップし、効率よく更新できます。

### 使用例

```bash
# すべてのディレクトリを一括処理（変更検出あり）
cd apps/docs
bun run update:journal:entries

# 結果サマリー表示
処理結果サマリー:
- 処理したディレクトリ: 2個
- スキップしたディレクトリ: 4個
- 更新されたエントリ数: 5件

スキップしたディレクトリ:
- 2025-03-20: 変更なし
- 2025-03-22: 変更なし
- 2025-03-24: 変更なし
- 2025-03-25: 変更なし
```

詳細は `apps/docs/scripts/update-journal-entries.ts` および `apps/docs/scripts/update-journal-commits.ts` を参照してください。 