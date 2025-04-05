# @kit/types

このパッケージは、アプリケーション全体で使用される共通の型定義を提供します。

## 構造

```
src/
├── auth/        # 認証関連の型定義
├── blog/        # ブログ機能の型定義
├── contact/     # お問い合わせ機能の型定義
├── error/       # エラー関連の型定義
├── github/      # GitHub連携の型定義
├── notification/# 通知機能の型定義
├── profile/     # プロフィール関連の型定義
└── project/     # プロジェクト関連の型定義
```

## 使用方法

### 基本的なインポート

```typescript
import { ProfileType } from '@kit/types';
```

### 特定のカテゴリからのインポート

```typescript
import { Profile } from '@kit/types/profile';
import { ErrorResponse } from '@kit/types/error';
import { Notification } from '@kit/types/notification';
import { BlogPost } from '@kit/types/blog';
import { ContactForm } from '@kit/types/contact';
import { GithubRepo } from '@kit/types/github';
import { Project } from '@kit/types/project';
import { Auth } from '@kit/types/auth';
```

## 開発

```bash
# 開発モード
bun run dev

# ビルド
bun run build

# 型チェック
bun run typecheck

# リント
bun run lint

# フォーマット
bun run format
```

## ガイドライン

1. 型定義は明確で理解しやすい名前を使用する
2. 必要に応じてJSDocでドキュメントを追加する
3. 可能な限り再利用可能な型を作成する
4. 型の変更は慎重に行い、変更履歴を明確にする
5. 新しい機能の型定義を追加する場合は、適切なディレクトリを作成する

## パッケージの拡張

新しい機能の型定義を追加する場合は、以下の手順に従ってください：

1. 機能に応じたディレクトリを作成
2. index.tsファイルを作成
3. 型定義ファイルを作成
4. メインのindex.tsでエクスポート
5. package.jsonのexportsに追加
6. tsup.config.tsのentryに追加 