# @kit/auth

認証機能を提供するパッケージです。Next.js + Supabaseを使用した認証フローを実装します。

## 機能

- 📧 メールアドレス/パスワードによる認証
- 🔗 マジックリンク認証
- 🌐 OAuth認証（複数のプロバイダーをサポート）
- 🔒 多要素認証（MFA）
- 🤖 reCAPTCHA/Turnstileサポート
- 🔄 パスワードリセット
- 🌍 i18n対応

## インストール

```bash
bun add @kit/auth
```

## 使用方法

### メールアドレス/パスワード認証

```tsx
import { PasswordSignInContainer } from '@kit/auth/sign-in';

export function SignInPage() {
  return <PasswordSignInContainer onSignIn={(userId) => {
    // サインイン後の処理
  }} />;
}
```

### マジックリンク認証

```tsx
import { MagicLinkAuthContainer } from '@kit/auth/sign-in';

export function SignInPage() {
  return <MagicLinkAuthContainer 
    redirectUrl="/auth/callback"
    shouldCreateUser={false}
  />;
}
```

### OAuth認証

```tsx
import { OauthProviders } from '@kit/auth/sign-in';
import type { Provider } from '@supabase/supabase-js';

const providers: Provider[] = ['google', 'github'];

export function SignInPage() {
  return <OauthProviders
    enabledProviders={providers}
    shouldCreateUser={false}
    paths={{
      callback: '/auth/callback',
      returnPath: '/home'
    }}
  />;
}
```

## 設定

### 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|------------|
| `NEXT_PUBLIC_PASSWORD_REQUIRE_SPECIAL_CHARS` | パスワードに特殊文字を要求 | `false` |
| `NEXT_PUBLIC_PASSWORD_REQUIRE_NUMBERS` | パスワードに数字を要求 | `false` |
| `NEXT_PUBLIC_PASSWORD_REQUIRE_UPPERCASE` | パスワードに大文字を要求 | `false` |

## エクスポート

```typescript
{
  "./sign-in": "./src/sign-in.ts",
  "./sign-up": "./src/sign-up.ts",
  "./password-reset": "./src/password-reset.ts",
  "./shared": "./src/shared.ts",
  "./mfa": "./src/mfa.ts",
  "./captcha/client": "./src/captcha/client/index.ts",
  "./captcha/server": "./src/captcha/server/index.ts",
  "./resend-email-link": "./src/components/resend-auth-link-form.tsx"
}
```

## スキーマ

パスワードのバリデーションなど、各種スキーマを提供します：

- `PasswordSchema` - 基本的なパスワードバリデーション
- `RefinedPasswordSchema` - 追加要件を含むパスワードバリデーション
- `PasswordSignInSchema` - サインインフォームのバリデーション

## コンポーネント

- `AuthLayoutShell` - 認証ページの共通レイアウト
- `SignInMethodsContainer` - サインイン方法の選択UI
- `SignUpMethodsContainer` - サインアップ方法の選択UI
- `PasswordSignInForm` - パスワードサインインフォーム
- `MagicLinkAuthContainer` - マジックリンク認証UI
- `OauthProviders` - OAuth認証プロバイダーUI

## セキュリティ

- CAPTCHA対応
- パスワード要件のカスタマイズ
- セキュアなリダイレクトハンドリング
- XSS/CSRF対策 

## パフォーマンス最適化

### クライアントサイドの最適化

1. **認証状態のキャッシング**
```tsx
// 認証状態をReact Queryでキャッシュ
const { data: session } = useQuery({
  queryKey: ['auth', 'session'],
  queryFn: () => supabase.auth.getSession(),
  staleTime: 1000 * 60 * 5, // 5分間キャッシュ
});
```

2. **選択的なコンポーネントレンダリング**
```tsx
// 必要なコンポーネントのみを条件付きでレンダリング
<If condition={props.providers.password}>
  <PasswordSignInContainer />
</If>
```

3. **遅延ローディング**
```tsx
// 重いコンポーネントは必要時に動的インポート
const OAuthProviders = dynamic(() => import('./oauth-providers'), {
  loading: () => <LoadingSpinner />,
});
```

### サーバーサイドの最適化

1. **セッション管理の効率化**
- セッショントークンの適切なキャッシュ
- 不要なセッション更新の防止

2. **データベースクエリの最適化**
- インデックスの適切な使用
- 必要最小限のデータ取得

## 詳細な使い方

### 1. 認証フローのカスタマイズ

#### カスタムリダイレクト
```tsx
<PasswordSignInContainer
  onSignIn={(userId) => {
    // カスタムリダイレクトロジック
    if (isNewUser) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  }}
/>
```

#### エラーハンドリング
```tsx
<PasswordSignInContainer
  onError={(error) => {
    if (error.code === 'invalid_credentials') {
      toast.error('認証情報が正しくありません');
    } else {
      toast.error('予期せぬエラーが発生しました');
    }
  }}
/>
```

### 2. 多要素認証の実装

```tsx
import { MFASetupContainer } from '@kit/auth/mfa';

export function MFASetupPage() {
  return (
    <MFASetupContainer
      onSetupComplete={() => {
        toast.success('多要素認証が有効化されました');
      }}
      onSetupError={(error) => {
        toast.error('設定中にエラーが発生しました');
      }}
    />
  );
}
```

### 3. カスタムバリデーション

```tsx
import { PasswordSchema } from '@kit/auth/schemas';
import { z } from 'zod';

// パスワードスキーマの拡張
const CustomPasswordSchema = PasswordSchema.extend({
  // 追加のバリデーションルール
  password: z.string()
    .min(10, 'パスワードは10文字以上である必要があります')
    .regex(/[!@#$%^&*]/, '特殊文字を含める必要があります'),
});
```

### 4. OAuth設定のカスタマイズ

```tsx
<OauthProviders
  enabledProviders={['google', 'github']}
  shouldCreateUser={true}
  customScopes={{
    google: ['profile', 'email', 'calendar.readonly'],
    github: ['repo', 'user']
  }}
  onProviderSignIn={(provider) => {
    analytics.track('oauth_sign_in', { provider });
  }}
/>
```

### 5. 認証ページのカスタマイズ

```tsx
<AuthLayoutShell
  Logo={CustomLogo}
  theme="dark"
  background={customBackgroundImage}
>
  <SignInMethodsContainer
    providers={{
      password: true,
      magicLink: true,
      oAuth: ['google', 'github']
    }}
    customComponents={{
      divider: <CustomDivider />,
      socialButton: CustomSocialButton
    }}
  />
</AuthLayoutShell>
```

## トラブルシューティング

### よくある問題と解決方法

1. **リダイレクトループ**
- 原因: 認証状態の不適切な処理
- 解決: `useEffect`内でのリダイレクト処理の見直し

2. **セッション期限切れ**
- 原因: トークンの更新処理の失敗
- 解決: 自動リフレッシュの実装

3. **OAuth認証エラー**
- 原因: コールバックURLの設定ミス
- 解決: Supabaseダッシュボードでの正しいURL設定

4. **パフォーマンス問題**
- 原因: 不要な再レンダリング
- 解決: メモ化とコンポーネントの分割 