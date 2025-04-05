/**
 * create-i18n-settings.ts
 *
 * このファイルは、i18nextライブラリの設定を生成する関数を提供します。
 * 主な役割：
 * 1. i18nextの基本設定の生成
 * 2. 言語とネームスペースの設定
 * 3. フォールバック（代替言語）の設定
 * 4. Reactでの使用設定
 */

import type { InitOptions } from 'i18next';

/**
 * i18nextの設定を生成する関数
 *
 * @param languages - サポートする言語のリスト（例：['en', 'ja', 'fr']）
 * @param language - 現在選択されている言語
 * @param namespaces - 翻訳のカテゴリー（例：['common', 'auth', 'settings']）
 * @returns i18nextの設定オブジェクト
 */
export function createI18nSettings({
  languages,
  language,
  namespaces,
}: {
  languages: string[];
  language: string;
  namespaces?: string | string[];
}): InitOptions {
  const lng = language;
  const ns = namespaces;

  return {
    // サポートする言語のリスト
    supportedLngs: languages,
    // 要求された言語が利用できない場合のフォールバック言語
    fallbackLng: languages[0],
    // サーバーサイドでは言語検出を無効化
    detection: undefined,
    // 現在の言語
    lng,
    // 言語コードのみを使用（国コードは無視）
    load: 'languageOnly' as const,
    // 起動時に全言語をプリロードしない
    preload: false as const,
    // 言語コードを小文字に統一
    lowerCaseLng: true as const,
    // フォールバック時に使用する名前空間
    fallbackNS: ns,
    // 補間値が見つからない場合のハンドラー
    missingInterpolationHandler: (text, value, options) => {
      console.debug(
        `Missing interpolation value for key: ${text}`,
        value,
        options
      );
    },
    // 使用する名前空間
    ns,
    // Reactでの設定
    react: {
      // Suspenseを使用して非同期ローディングを有効化
      useSuspense: true,
    },
  };
}
