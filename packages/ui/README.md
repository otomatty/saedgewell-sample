# UIコンポーネントパッケージ / @kit/ui

このパッケージは再利用可能なUIコンポーネントを提供します。アプリケーション全体で使用される共通のデザインシステムとコンポーネントライブラリを含みます。

## コンポーネントセット

このパッケージは2種類のコンポーネントセットを定義しています：

- `shadcn-ui`: アプリケーション全体で使用できるShadcn UIベースのUIコンポーネント群
  - 高度にカスタマイズ可能なベースコンポーネント
  - アクセシビリティ対応
  - モダンなデザインシステム
- `makerkit`: MakerKit専用のコンポーネント群
  - プロジェクト固有の要件に対応したコンポーネント
  - ビジネスロジックと統合されたUI要素
  - カスタムデザインパターン

## Shadcn UIコンポーネントのインストール

Shadcn UIコンポーネントをインストールするには、リポジトリのルートで以下のコマンドを使用します：

```bash
bunx shadcn@latest add <component> -c packages/ui
```

例えば、`Button`コンポーネントをインストールする場合は以下のコマンドを使用します：

```bash
bunx shadcn-ui@latest add button -c packages/ui
```

## 使用方法

1. コンポーネントのインポート:
```tsx
import { Button } from '@kit/ui/components/button';
```

2. コンポーネントの使用:
```tsx
<Button variant="primary">クリック</Button>
```

## スタイリング

このパッケージは以下のスタイリングシステムを使用しています：

- Tailwind CSS: ユーティリティファーストのCSSフレームワーク
- CSS Modules: コンポーネント固有のスタイル
- CSS Variables: テーマのカスタマイズ

## ベストプラクティス

- コンポーネントは可能な限り再利用可能な形で設計
- アクセシビリティガイドラインに準拠
- レスポンシブデザインを考慮
- パフォーマンスの最適化