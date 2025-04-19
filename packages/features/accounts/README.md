# @kit/accounts

ユーザーアカウント管理機能を提供するパッケージです。プロフィール情報の管理、アカウント設定、アカウント削除などの機能を実装します。

## 機能

- 👤 ユーザープロフィール管理
  - 表示名の更新
  - プロフィール画像のアップロード
- 📧 メールアドレスの更新
- 🔑 パスワードの更新
- 🌍 言語設定
- 🔒 多要素認証の管理
- ⚠️ アカウント削除

## インストール

```bash
bun add @kit/accounts
```

## 使用方法

### アカウント設定画面

```tsx
import { PersonalAccountSettingsContainer } from '@kit/accounts/personal-account-settings';

export function AccountSettingsPage() {
  return (
    <PersonalAccountSettingsContainer
      userId={user.id}
      features={{
        enableAccountDeletion: true,
        enablePasswordUpdate: true
      }}
      paths={{
        callback: '/auth/callback'
      }}
    />
  );
}
```

### プロフィールドロップダウン

```tsx
import { PersonalAccountDropdown } from '@kit/accounts/personal-account-dropdown';

export function Header() {
  return (
    <PersonalAccountDropdown
      user={user}
      signOutRequested={() => {/* サインアウト処理 */}}
      paths={{
        home: '/home'
      }}
      features={{
        enableThemeToggle: true
      }}
    />
  );
}
```

## エクスポート

```typescript
{
  "./personal-account-dropdown": "./src/components/personal-account-dropdown.tsx",
  "./personal-account-settings": "./src/components/account-settings-container.tsx",
  "./components": "./src/components/index.ts",
  "./hooks/*": "./src/hooks/*.ts",
  "./api": "./src/server/api.ts"
}
```

## コンポーネント

- `PersonalAccountSettingsContainer` - アカウント設定画面
- `PersonalAccountDropdown` - ユーザープロフィールドロップダウン
- `UpdateAccountDetailsForm` - アカウント詳細更新フォーム
- `UpdateAccountImageContainer` - プロフィール画像更新
- `UpdateEmailFormContainer` - メールアドレス更新
- `UpdatePasswordFormContainer` - パスワード更新
- `AccountDangerZone` - アカウント削除UI

## フック

- `usePersonalAccountData` - アカウント情報の取得
- `useUpdateAccountData` - アカウント情報の更新
- `useRevalidatePersonalAccountDataQuery` - アカウントデータの再検証

## API

`AccountsApi`クラスを通じて、以下の機能を提供します：

- アカウント情報の取得
- アカウント情報の更新
- アカウントの削除

## スキーマ

- `AccountDetailsSchema` - アカウント詳細のバリデーション
- `DeletePersonalAccountSchema` - アカウント削除のバリデーション

## 設定

### 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|------------|
| `NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION` | アカウント削除機能の有効化 | `false` |

## セキュリティ

- アカウント削除時の確認
- 画像アップロードの制限
- アクセス制御
- データ検証

## パフォーマンス最適化

### データ取得の最適化

1. **クエリのキャッシング**
```tsx
// アカウントデータのキャッシング
const { data: account } = usePersonalAccountData(userId, {
  staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  cacheTime: 1000 * 60 * 30, // 30分間キャッシュを保持
});
```

2. **選択的なデータ取得**
```tsx
// 必要なフィールドのみを取得
const { data } = await supabase
  .from('accounts')
  .select('id, name, picture_url')
  .eq('id', userId)
  .single();
```

3. **並列データ取得**
```tsx
// 複数のデータを並列で取得
const [accountData, preferences] = await Promise.all([
  getAccountData(userId),
  getAccountPreferences(userId)
]);
```

### UI最適化

1. **コンポーネントの分割**
```tsx
// 重い処理を行うコンポーネントを分割
const AccountSettings = dynamic(() => import('./account-settings'), {
  loading: () => <SettingsPlaceholder />
});
```

2. **画像の最適化**
```tsx
// プロフィール画像の最適化
<UpdateAccountImageContainer
  options={{
    maxSize: 1024 * 1024, // 1MB
    compressionQuality: 0.8,
    acceptedFormats: ['image/jpeg', 'image/png']
  }}
/>
```

## 詳細な使い方

### 1. アカウント設定のカスタマイズ

#### カスタムセクションの追加
```tsx
<PersonalAccountSettingsContainer
  userId={user.id}
  customSections={[
    {
      title: 'API設定',
      description: 'APIキーの管理',
      component: <ApiKeysManager />
    }
  ]}
/>
```

#### 設定の保存と検証
```tsx
const updateAccount = useUpdateAccountData(userId);

const onSubmit = async (data) => {
  try {
    await updateAccount.mutateAsync({
      name: data.displayName,
      settings: {
        notifications: data.notifications,
        theme: data.theme
      }
    });
    
    toast.success('設定を保存しました');
  } catch (error) {
    toast.error('設定の保存に失敗しました');
  }
};
```

### 2. プロフィール画像の管理

```tsx
<UpdateAccountImageContainer
  user={user}
  onUploadComplete={(url) => {
    // 画像アップロード後の処理
    updateProfileImage(url);
  }}
  onUploadError={(error) => {
    // エラーハンドリング
    toast.error('画像のアップロードに失敗しました');
  }}
  customDropzone={<CustomDropzone />}
/>
```

### 3. アカウント削除のカスタマイズ

```tsx
<AccountDangerZone
  onDeleteRequest={async () => {
    // カスタム確認ダイアログ
    const confirmed = await showCustomConfirmDialog({
      title: 'アカウントを削除しますか？',
      description: '全てのデータが削除されます'
    });

    if (confirmed) {
      await deleteAccount();
    }
  }}
  customConfirmation={{
    text: 'DELETE',
    validation: (value) => value === 'DELETE'
  }}
/>
```

### 4. データの同期

```tsx
// アカウントデータの再検証
const revalidate = useRevalidatePersonalAccountDataQuery();

useEffect(() => {
  // WebSocketでの更新通知を受け取った場合
  supabase
    .channel('account_updates')
    .on('UPDATE', () => {
      revalidate(userId);
    })
    .subscribe();
}, [userId]);
```

## トラブルシューティング

### よくある問題と解決方法

1. **データ更新の反映遅延**
- 原因: キャッシュの更新タイミング
- 解決: 適切なキャッシュ無効化の実装

2. **画像アップロードの失敗**
- 原因: ファイルサイズ制限、形式制限
- 解決: 適切なバリデーションと圧縮の実装

3. **アカウント設定の競合**
- 原因: 同時更新による競合
- 解決: 楽観的ロックの実装

4. **パフォーマンスの低下**
- 原因: 不要なデータ取得、レンダリング
- 解決: データ取得の最適化、コンポーネントの分割

### ベストプラクティス

1. **データ取得**
- 必要最小限のデータのみを取得
- 適切なキャッシュ戦略の使用
- エラー時の適切なフォールバック

2. **UI/UX**
- ローディング状態の適切な表示
- エラーメッセージの明確な表示
- 確認操作の実装

3. **セキュリティ**
- 入力データの検証
- 権限チェックの実装
- センシティブデータの適切な処理 