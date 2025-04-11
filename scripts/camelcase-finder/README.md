# 変換できないキャメルケースファイル検出ツール

このツールは、プロジェクト内のキャメルケースのファイルを検出し、一覧表示するためのユーティリティです。

## 概要

キャメルケース（例：`MyComponent`）からケバブケース（例：`my-component`）への変換プロセスにおいて、検出対象となるファイルを特定し、リスト化します。

## 主な機能

- プロジェクト内の `.tsx` と `.jsx` ファイルを再帰的に検索
- キャメルケース命名規則を使用しているファイルを検出
- 検出結果を標準出力またはファイルに出力
- キャッシュディレクトリや `node_modules` などを自動的に除外

## 使い方

```bash
# カレントディレクトリから検索
go run main.go

# 特定のディレクトリから検索
go run main.go -dir=apps/web/app

# 結果をファイルに出力
go run main.go -output=camelcase-files.txt

# 詳細ログを表示
go run main.go -verbose

# apps/とpackages/ディレクトリのみを検索
go run main.go -apps-only

# 複数のオプションを組み合わせる
go run main.go -dir=apps/web/app -output=camelcase-files.txt -verbose
```

## コマンドラインオプション

| オプション | 説明 |
|------------|------|
| `-dir` | 検索を開始するルートディレクトリ（デフォルト: カレントディレクトリ） |
| `-output` | 結果を出力するファイル（指定しない場合は標準出力） |
| `-verbose` | 詳細なログを出力（合計ファイル数や処理状況など） |
| `-apps-only` | apps/とpackages/ディレクトリのみを検索対象にする |

## 出力例

```
検出されたキャメルケースファイル一覧
==============================

[FILE] WorkCard (/Users/user/project/apps/web/app/works/_components/WorkCard.tsx)
[DIR] Introduction (/Users/user/project/apps/web/app/_components/Introduction)
[FILE] UserMenu (/Users/user/project/apps/web/app/_layout/UserMenu.tsx)

合計: 3 件のキャメルケースファイルが見つかりました
```

## 検出条件

以下の条件に一致するファイルはキャメルケースとして検出されます：

1. 大文字で始まる（例：`MyComponent.tsx`）
2. ハイフン（-）やアンダースコア（_）を含まない
3. `.tsx` または `.jsx` の拡張子を持つファイル（またはディレクトリ）

## ビルド方法

```bash
# 実行可能ファイルをビルド
cd scripts/camelcase-finder
go build -o camelcase-finder

# ビルドした実行ファイルを使用
./camelcase-finder -dir=apps/web/app
```

## 注意事項

- このツールは、キャメルケース命名の検出に特化しています。厳密にはキャメルケースではなくパスカルケース（PascalCase）を検出していますが、React コンポーネントの命名としては一般的な形式です。
- 実行時には、`.bun`、`.bun-cache`、`node_modules`、`.next` などのディレクトリは自動的に除外されます。 