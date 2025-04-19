/**
 * i18n-provider.tsx
 *
 * このファイルは、アプリケーション全体の国際化（i18n）機能を提供するReactコンポーネントを定義します。
 * 主な役割：
 * 1. サーバーサイドで生成された言語設定をクライアントサイドで読み取る
 * 2. i18nextの初期化を管理
 * 3. アプリケーション全体に翻訳機能を提供
 *
 * 使用例：
 * ```tsx
 * <I18nProvider settings={i18nSettings} resolver={loadTranslations}>
 *   <App />
 * </I18nProvider>
 * ```
 */

'use client';

import type { InitOptions, i18n } from 'i18next';
import type React from 'react';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import { initializeI18nClient } from './i18n.client';

/**
 * 翻訳リソースを取得するための関数の型定義
 * lang: 言語コード（例：'en', 'ja'）
 * namespace: 翻訳のカテゴリー（例：'common', 'auth'）
 */
type Resolver = (
  lang: string,
  namespace: string
) => Promise<Record<string, string>>;

/**
 * サーバーサイドで生成された言語設定を取得する関数
 * HTMLに埋め込まれたscriptタグから設定を読み取ります
 */
function getServerSettings(): InitOptions | null {
  if (typeof window === 'undefined') return null;

  const settingsElement = document.getElementById('i18n-settings');
  if (!settingsElement) return null;

  try {
    return JSON.parse(settingsElement.getAttribute('data-settings') || '');
  } catch (e) {
    console.error('Failed to parse i18n settings:', e);
    return null;
  }
}

/**
 * i18n機能を提供するプロバイダーコンポーネント
 *
 * @param settings - i18nの基本設定（デフォルトの言語、サポートする言語など）
 * @param resolver - 翻訳ファイルを動的に読み込むための関数
 * @param children - 子コンポーネント
 */
export function I18nProvider({
  settings,
  children,
  resolver,
}: React.PropsWithChildren<{
  settings: InitOptions;
  resolver: Resolver;
}>) {
  // i18nインスタンスの状態を管理
  const [i18n, setI18n] = useState<i18n | null>(null);

  // コンポーネントのマウント時にi18nを初期化
  useEffect(() => {
    const serverSettings = getServerSettings();
    initializeI18nClient(serverSettings ?? settings, resolver)
      .then(setI18n)
      .catch((err) => {
        console.error('Failed to initialize i18n:', err);
      });
  }, [settings, resolver]);

  // 初期化が完了するまで何も表示しない
  if (!i18n) return null;

  // 初期化完了後、翻訳機能を子コンポーネントに提供
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
