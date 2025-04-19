# Version Manager

モノレポ内のパッケージバージョンを一元管理するためのツールです。

## 機能

- パッケージバージョンの一貫性チェック
- 未定義パッケージの検出と自動分類
- パッケージバージョンの一括更新
- 選択的なパッケージ更新
- 安全性チェック機能

## コマンド

```bash
# バージョンチェック
bun run version:check

# 全パッケージの更新
bun run version:update

# 選択的な更新
bun run version:update:selected

# 特定グループの更新
bun run version:update:next    # Next.js関連パッケージ
bun run version:update:react   # React関連パッケージ
bun run version:update:supabase # Supabase関連パッケージ
```

## 設定ファイル

### dependencies.json

パッケージバージョンの定義ファイル。カテゴリーごとにパッケージとそのバージョンを管理します。

```json
{
  "next": {
    "next": "14.1.0",
    "@next/bundle-analyzer": "14.1.0"
  },
  "react": {
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
```

### update-config.json

バージョン管理の設定ファイル。

```json
{
  "updateGroups": {
    "next": {
      "packages": ["next", "@next/bundle-analyzer"],
      "relatedPackages": ["react", "react-dom"],
      "testPatterns": ["next.config.*", "app/**/*"]
    }
  },
  "safetyChecks": {
    "requiredTests": true,
    "typeCheck": true,
    "lint": true,
    "backupBeforeUpdate": true
  },
  "categorize": {
    "categories": [
      {
        "name": "next",
        "patterns": ["^next", "^@next"],
        "description": "Next.js関連のパッケージ"
      },
      {
        "name": "react",
        "patterns": ["^react", "^@react", "^@types/react"],
        "description": "React関連のパッケージ"
      }
    ],
    "defaultCategory": "dependencies"
  }
}
```

## 機能詳細

### バージョンチェック (`version:check`)

1. 未定義パッケージの検出
   - 各ワークスペースの`package.json`から依存関係を読み取り
   - `dependencies.json`に定義されていないパッケージを検出
   - 内部パッケージ（@kit/）は除外
   - 重複するパッケージは統合し、最新バージョンを採用

2. 自動分類
   - 検出された未定義パッケージを`update-config.json`の`categorize`設定に基づいて分類
   - パターンマッチングによる自動カテゴリー分類
   - ユーザーに分類結果を表示し、設定への追加を確認

3. バージョン不一致チェック
   - 各パッケージの現在のバージョンと期待されるバージョンを比較
   - 新しいバージョンと古いバージョンを区別して表示

### パッケージ更新

1. 全パッケージ更新 (`version:update`)
   - `dependencies.json`に定義された全パッケージを最新バージョンに更新

2. 選択的更新 (`version:update:selected`)
   - バージョン不一致のあるパッケージから更新対象を選択
   - 選択されたパッケージのみを更新

3. グループ更新 (`version:update:[group]`)
   - 特定のグループに属するパッケージを一括更新
   - 関連パッケージの依存関係も考慮

### 安全性チェック

更新時に以下のチェックを実行（設定可能）：
- TypeScriptの型チェック
- リントチェック
- テストの実行
- 更新前のバックアップ作成

## アーキテクチャ

```
tooling/scripts/version-manager/
├── services/
│   ├── file-service.ts      # ファイル操作
│   ├── version-service.ts   # バージョン操作
│   ├── safety-service.ts    # 安全性チェック
│   ├── package-service.ts   # パッケージ管理
│   ├── categorize-service.ts # カテゴリー分類
│   └── prompt-service.ts    # ユーザー入力
├── types.ts                 # 型定義
├── version-manager.ts       # メインロジック
└── cli.ts                  # CLIインターフェース
```

## エラーハンドリング

- 更新失敗時の自動ロールバック
- バックアップからの復元機能
- 詳細なエラーメッセージの表示

## 注意事項

1. 内部パッケージ（@kit/）は自動検出から除外されます
2. バージョン更新前に必ずバックアップを作成することを推奨します
3. 大規模な更新を行う前にステージング環境でのテストを推奨します

## 今後の改善予定

- [ ] 依存関係グラフの可視化
- [ ] 更新履歴の管理
- [ ] CI/CDパイプラインとの統合
- [ ] パッケージの健全性チェック機能
- [ ] インタラクティブな更新UIの改善 