# 共有ユーティリティパッケージ / @kit/shared

このパッケージは複数のパッケージで共有される共通のユーティリティ、型定義、定数などを提供します。

## 主な機能

### 型定義
- 共通のインターフェース定義
- 型ガード関数
- ユーティリティ型
- APIレスポンスの型定義

### ユーティリティ関数
- 日付操作
- 文字列処理
- 数値計算
- 配列操作
- オブジェクト操作

### 定数
- 設定値
- エラーメッセージ
- API エンドポイント
- 環境変数の型定義

### バリデーション
- 入力値の検証
- スキーマ定義
- カスタムバリデーター

## 使用方法

### 型定義の使用
```typescript
import { User, Post } from '@kit/shared/types';

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};
```

### ユーティリティ関数の使用
```typescript
import { formatDate, calculateAge } from '@kit/shared/utils';

const date = formatDate(new Date(), 'YYYY-MM-DD');
const age = calculateAge('1990-01-01');
```

### 定数の使用
```typescript
import { API_ENDPOINTS, ERROR_MESSAGES } from '@kit/shared/constants';

const response = await fetch(API_ENDPOINTS.USERS);
```

## ベストプラクティス

1. 型の使用
   - 適切な型定義の活用
   - 型安全性の確保

2. 関数の再利用
   - DRYの原則に従う
   - 共通処理の抽象化

3. 定数の管理
   - 環境に応じた値の切り替え
   - 定数の一元管理

4. バリデーション
   - 一貫性のある入力検証
   - エラーメッセージの標準化 