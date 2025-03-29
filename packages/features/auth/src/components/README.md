# 認証関連コンポーネント

このディレクトリには、アプリケーションの認証機能に関連するコンポーネントが含まれています。
これらのコンポーネントは、ユーザーのサインイン、サインアップ、パスワードリセットなどの認証フローを処理します。
なお 🔄 がついているコンポーネントはエクスポートしているものです。

## コンポーネント階層構造

```
🔄 SignInMethodsContainer                  # サインイン方法を集約して表示するコンテナ
├── 🔄 PasswordSignInContainer             # メール/パスワードサインインのコンテナ
│   ├── 🔄 AuthErrorAlert                  # 認証エラーを表示するアラート
│   └── 🔄 PasswordSignInForm              # メール/パスワードサインインフォーム
├── 🔄 MagicLinkAuthContainer              # マジックリンク認証のコンテナ
│   ├── SuccessAlert                    # 成功メッセージを表示するアラート
│   ├── ErrorAlert                      # エラーメッセージを表示するアラート
│   └── 🔄 TermsAndConditionsFormField     # 利用規約同意チェックボックス
└── 🔄 OauthProviders                      # OAuth認証プロバイダーを表示するコンテナ
    ├── LoadingOverlay                  # ローディング中のオーバーレイ
    ├── 🔄 AuthProviderButton              # 認証プロバイダーボタン
    │   └── 🔄 OauthProviderLogoImage      # 認証プロバイダーのロゴ画像
    └── 🔄 AuthErrorAlert                  # 認証エラーを表示するアラート

🔄 SignUpMethodsContainer                  # サインアップ方法を集約して表示するコンテナ
├── 🔄 EmailPasswordSignUpContainer        # メール/パスワードサインアップのコンテナ
│   ├── 🔄 AuthErrorAlert                  # 認証エラーを表示するアラート
│   ├── 🔄 PasswordSignUpForm              # メール/パスワードサインアップフォーム
│   │   └── 🔄 TermsAndConditionsFormField # 利用規約同意チェックボックス
│   └── SuccessAlert                    # 成功メッセージを表示するアラート
├── 🔄 MagicLinkAuthContainer              # マジックリンク認証のコンテナ
│   ├── SuccessAlert                    # 成功メッセージを表示するアラート
│   ├── ErrorAlert                      # エラーメッセージを表示するアラート
│   └── 🔄 TermsAndConditionsFormField     # 利用規約同意チェックボックス
└── 🔄 OauthProviders                      # OAuth認証プロバイダーを表示するコンテナ
    ├── LoadingOverlay                  # ローディング中のオーバーレイ
    ├── 🔄 AuthProviderButton              # 認証プロバイダーボタン
    │   └── 🔄 OauthProviderLogoImage      # 認証プロバイダーのロゴ画像
    └── 🔄 AuthErrorAlert                  # 認証エラーを表示するアラート

🔄 PasswordResetRequestContainer           # パスワードリセットリクエストのコンテナ
├── 🔄 AuthErrorAlert                      # 認証エラーを表示するアラート
└── SuccessAlert                        # 成功メッセージを表示するアラート

🔄 UpdatePasswordForm                      # パスワード更新フォーム
├── SuccessState                        # 成功状態の表示
└── ErrorState                          # エラー状態の表示

🔄 MultiFactorChallengeContainer           # 多要素認証チャレンジのコンテナ
├── FactorsListContainer                # 認証要素リストのコンテナ
└── VerificationCodeForm                # 検証コード入力フォーム

🔄 AuthLinkRedirect                        # 認証リンクからのリダイレクト処理

🔄 ResendAuthLinkForm                      # 認証リンク再送信フォーム
```

## 主要コンポーネントの説明


### コンテナコンポーネント

#### 🔄 SignInMethodsContainer
- サインイン方法を集約して表示するコンテナコンポーネントです。
- パスワード認証、マジックリンク認証、OAuthプロバイダー認証など、複数の認証方法を設定に基づいて表示します。
- 設定に応じて必要なコンポーネントのみを表示する柔軟性を持っています。

#### 🔄 SignUpMethodsContainer
- サインアップ方法を集約して表示するコンテナコンポーネントです。
- パスワード登録、マジックリンク登録、OAuthプロバイダー登録など、複数の登録方法を設定に基づいて表示します。
- 利用規約チェックボックスの表示/非表示を制御できます。

#### 🔄 PasswordSignInContainer
- メールアドレスとパスワードを使用したサインインのコンテナコンポーネントです。
- Supabaseの認証機能と連携し、実際のサインイン処理を行います。
- CAPTCHAトークンの管理も行います。

#### 🔄 EmailPasswordSignUpContainer
- メールアドレスとパスワードを使用したサインアップ（新規登録）のコンテナコンポーネントです。
- Supabaseの認証機能と連携し、実際のサインアップ処理を行います。
- 登録成功時の確認メール送信通知を表示します。

#### 🔄 MagicLinkAuthContainer
- マジックリンク認証（メールリンク認証）のコンテナコンポーネントです。
- ユーザーのメールアドレスを入力し、認証リンクを送信する機能を提供します。
- 送信成功/エラー状態を適切に表示します。

#### 🔄 PasswordResetRequestContainer
- パスワードリセットリクエストを処理するコンテナコンポーネントです。
- ユーザーのメールアドレスを入力し、パスワードリセットリンクを送信する機能を提供します。
- リクエスト送信後の成功メッセージを表示します。

#### 🔄 MultiFactorChallengeContainer
- 多要素認証（MFA）のチャレンジを処理するコンテナコンポーネントです。
- ユーザーが認証アプリなどから取得した検証コードを入力し、多要素認証を完了する機能を提供します。
- 認証成功後に指定されたパスにリダイレクトします。

### フォームコンポーネント

#### 🔄 PasswordSignInForm
- メールアドレスとパスワードを使用したサインインフォームコンポーネントです。
- React Hook Formを使用してフォームの状態管理と検証を行います。
- パスワードリセットページへのリンクも提供します。

#### 🔄 PasswordSignUpForm
- メールアドレスとパスワードを使用したサインアップ（新規登録）フォームコンポーネントです。
- React Hook Formを使用してフォームの状態管理と検証を行います。
- パスワードの確認入力フィールドを含みます。

#### 🔄 UpdatePasswordForm
- パスワードリセット後の新しいパスワード設定フォームコンポーネントです。
- ユーザーが新しいパスワードを入力し、アカウントのパスワードを更新する機能を提供します。
- 成功/エラー状態を適切に表示します。

#### 🔄 ResendAuthLinkForm
- 認証リンク（サインアップ確認メールなど）の再送信フォームコンポーネントです。
- ユーザーがメールアドレスを入力し、認証リンクを再送信する機能を提供します。
- 送信成功時にアラートを表示します。

### UI要素コンポーネント

#### 🔄 AuthLayoutShell
- 認証関連ページの共通レイアウトを提供するコンポーネントです。
- ログイン、サインアップ、パスワードリセットなどの認証関連ページで使用されます。
- オプションでロゴを表示できます。

#### 🔄 AuthErrorAlert
- 認証プロセス中に発生したエラーを表示するアラートコンポーネントです。
- Supabaseから返されるエラーコードを受け取り、ユーザーフレンドリーなエラーメッセージを表示します。
- エラーがない場合は何も表示しません。

#### 🔄 AuthProviderButton
- 認証プロバイダー（Google、GitHub、Facebookなど）のボタンコンポーネントです。
- OAuthプロバイダーのロゴとテキストを表示し、クリック時に認証フローを開始します。
- データ属性によるテスト対応も行っています。

#### 🔄 OauthProviderLogoImage
- 認証プロバイダー（Google、GitHub、Facebookなど）のロゴ画像を表示するコンポーネントです。
- プロバイダーIDに基づいて適切なロゴを表示します。
- カスタムサイズ設定が可能です。

#### 🔄 TermsAndConditionsFormField
- 利用規約とプライバシーポリシーへの同意を得るためのフォームフィールドコンポーネントです。
- サインアップフォームなどで使用され、ユーザーに利用規約への同意を求めます。
- 利用規約とプライバシーポリシーへのリンクを含みます。

### ユーティリティコンポーネント

#### 🔄 AuthLinkRedirect
- 認証リンク（マジックリンクなど）からのリダイレクトを処理するコンポーネントです。
- ユーザーがサインインした後、指定されたパスにリダイレクトします。
- URLパラメータからリダイレクトパスを取得することもできます。

## 使用方法

### サインインページの実装例

```tsx
import { AuthLayoutShell } from 'packages/features/auth/src/components/auth-layout';
import { SignInMethodsContainer } from 'packages/features/auth/src/components/sign-in-methods-container';

export default function SignInPage() {
  return (
    <AuthLayoutShell Logo={MyLogo}>
      <h1>ログイン</h1>
      <SignInMethodsContainer
        paths={{
          callback: '/auth/callback',
          home: '/dashboard',
        }}
        providers={{
          password: true,
          magicLink: true,
          oAuth: ['google', 'github'],
        }}
      />
    </AuthLayoutShell>
  );
}
```

### サインアップページの実装例

```tsx
import { AuthLayoutShell } from 'packages/features/auth/src/components/auth-layout';
import { SignUpMethodsContainer } from 'packages/features/auth/src/components/sign-up-methods-container';

export default function SignUpPage() {
  return (
    <AuthLayoutShell Logo={MyLogo}>
      <h1>新規登録</h1>
      <SignUpMethodsContainer
        paths={{
          callback: '/auth/callback',
          appHome: '/dashboard',
        }}
        providers={{
          password: true,
          magicLink: true,
          oAuth: ['google', 'github'],
        }}
        displayTermsCheckbox={true}
      />
    </AuthLayoutShell>
  );
}
```

## 注意事項

- 通常shadcn/uiの `Alert` コンポーネントには `variant="success"` が存在しませんが、packages/uiの`Alert`コンポーネントに`success`バリアントを追加して対応しています。