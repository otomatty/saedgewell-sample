# Supabase統合パッケージ / @kit/supabase

このパッケージはSupabaseとの統合機能を提供し、データベース操作、認証、ストレージなどのSupabase関連の機能を集約します。

## インストール

アプリケーションで使用する前に、必ず`@kit/supabase`パッケージをインストールしてください。

```json
{
    "name": "my-app",
    "dependencies": {
        "@kit/supabase": "*"
    }
}
```

## 主な機能

### データベース操作
- 型安全なクエリビルダー
- トランザクション管理
- リアルタイムサブスクリプション
- データベースマイグレーション

### 認証機能
- ユーザー認証（メール/パスワード、ソーシャル認証）
- セッション管理
- ロール・権限管理
- パスワードリセット

### ストレージ操作
- ファイルアップロード/ダウンロード
- 画像最適化
- アクセス制御
- 一時URLの生成

## 使用方法

### クライアントの初期化
```typescript
import { createClient } from '@kit/supabase/client';

const supabase = createClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});
```

### データベース操作の例
```typescript
// データの取得
const { data, error } = await supabase
  .from('table_name')
  .select('*');

// データの挿入
const { data, error } = await supabase
  .from('table_name')
  .insert({ column: 'value' });
```

### 認証の例
```typescript
// メール/パスワードでサインアップ
const { data, error } = await supabase.auth.signUp({
  email: 'example@email.com',
  password: 'password'
});

// サインイン
const { data, error } = await supabase.auth.signIn({
  email: 'example@email.com',
  password: 'password'
});
```

## エラーハンドリング

このパッケージは統一されたエラーハンドリングを提供します：

```typescript
try {
  const { data, error } = await supabase.from('table').select('*');
  if (error) throw error;
  // データの処理
} catch (error) {
  console.error('Error:', error.message);
}
```

## ベストプラクティス

1. 環境変数の使用
   - API キーは必ず環境変数として管理
   - 本番環境では適切なキーを使用

2. 型の活用
   - データベーステーブルの型定義
   - レスポンスの型安全性の確保

3. エラーハンドリング
   - 適切なエラー処理の実装
   - ユーザーフレンドリーなエラーメッセージ

4. セキュリティ
   - RLSポリシーの適切な設定
   - 認証・認可の確実な実装
