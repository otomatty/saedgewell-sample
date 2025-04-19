# 国際化（i18n）パッケージ / @kit/i18n

このパッケージはNext.jsアプリケーションのための国際化（i18n）機能を提供します。
サーバーサイドレンダリング（SSR）とクライアントサイドの両方で適切に動作するように設計されています。

## アーキテクチャ

このパッケージは以下の主要なコンポーネントで構成されています：

### 1. プロバイダー（i18n-provider.tsx）
- アプリケーション全体に翻訳機能を提供
- サーバー・クライアント間の設定の同期
- i18nextインスタンスの初期化と管理

```tsx
import { I18nProvider } from '@kit/i18n';

function App({ children }) {
  return (
    <I18nProvider 
      settings={i18nSettings} 
      resolver={async (lang, ns) => {
        // 翻訳ファイルの動的ロード
        return import(`./locales/${lang}/${ns}.json`);
      }}
    >
      {children}
    </I18nProvider>
  );
}
```

### 2. サーバーサイド機能（i18n.server.ts）
- SSRでの翻訳サポート
- React Server Components対応
- ブラウザの言語設定（Accept-Language）の解析

```tsx
import { createI18nServerInstance } from '@kit/i18n';

// サーバーコンポーネントでの使用例
async function ServerComponent() {
  const i18n = await createI18nServerInstance();
  return <h1>{i18n.t('welcome.title')}</h1>;
}
```

### 3. クライアントサイド機能（i18n.client.ts）
- ブラウザでの言語検出
- 動的な言語切り替え
- 翻訳リソースの非同期ロード

```tsx
import { useTranslation } from 'react-i18next';

// クライアントコンポーネントでの使用例
function ClientComponent() {
  const { t } = useTranslation();
  return <p>{t('welcome.message')}</p>;
}
```

### 4. 設定管理（create-i18n-settings.ts）
- i18next設定の一元管理
- 言語とネームスペースの設定
- フォールバック動作の制御

```typescript
import { createI18nSettings } from '@kit/i18n';

const settings = createI18nSettings({
  languages: ['ja', 'en'],
  language: 'ja',
  namespaces: ['common', 'auth']
});
```

## 主な機能

### 1. サーバー・クライアント間の整合性
- サーバーサイドでレンダリングされた翻訳の維持
- ハイドレーション時の言語設定の同期
- SEO対応の言語メタデータ

### 2. 効率的なリソース管理
- 必要な翻訳の動的ロード
- 名前空間による翻訳の分割
- キャッシュと再利用の最適化

### 3. 堅牢なエラーハンドリング
- 翻訳ファイルのロードエラー処理
- フォールバック言語のサポート
- 欠落した翻訳キーの検出

## 設定オプション

\`createI18nSettings\`で設定可能な主なオプション：

| オプション | 説明 | デフォルト値 |
|------------|------|--------------|
| languages | サポートする言語のリスト | 必須 |
| language | 現在の言語 | 必須 |
| namespaces | 翻訳カテゴリー | オプション |
| load | 言語コードの読み込み方式 | 'languageOnly' |
| preload | 事前読み込みの有効化 | false |
| lowerCaseLng | 言語コードの小文字化 | true |

## ベストプラクティス

1. **名前空間の適切な分割**
   - 機能単位での分割（'common', 'auth', 'settings'など）
   - 遅延ロードの活用
   - バンドルサイズの最適化

2. **型安全性の確保**
   - 翻訳キーの型定義
   - TypeScriptの活用
   - コード補完の活用

3. **パフォーマンスの最適化**
   - 必要な翻訳のみをロード
   - キャッシュの活用
   - 適切なフォールバック設定

## トラブルシューティング

よくある問題と解決方法：

1. **翻訳が表示されない**
   - 名前空間が正しく設定されているか確認
   - 翻訳ファイルが正しくロードされているか確認
   - コンソールのエラーを確認

2. **ハイドレーションエラー**
   - サーバーとクライアントの言語設定の一致を確認
   - `I18nProvider`の配置を確認
   - 非同期ロードの処理を確認

3. **パフォーマンスの問題**
   - 不要な翻訳ファイルのロードを確認
   - キャッシュの設定を確認
   - バンドルサイズを確認 