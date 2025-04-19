/**
 * i18n.client.ts
 *
 * このファイルは、ブラウザ（クライアントサイド）でのi18n機能の初期化を担当します。
 * 主な役割：
 * 1. i18nextライブラリの初期化
 * 2. ブラウザの言語設定の検出
 * 3. 翻訳リソースの動的ロード
 * 4. React連携のセットアップ
 */

import i18next, { type InitOptions, type i18n } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

// 初期化の最大試行回数
const MAX_ITERATIONS = 20;
// 現在の試行回数
let iteration = 0;

/**
 * クライアントサイドでi18nを初期化する関数
 *
 * @param settings - i18nの設定（言語、名前空間など）
 * @param resolver - 翻訳ファイルを動的に読み込むための関数
 * @returns 初期化されたi18nインスタンス
 */
export async function initializeI18nClient(
  settings: InitOptions,
  resolver: (lang: string, namespace: string) => Promise<object>
): Promise<i18n> {
  // ロード済みの言語と名前空間を追跡
  const loadedLanguages: string[] = [];
  const loadedNamespaces: string[] = [];

  await i18next
    // 翻訳リソースを動的にロードするためのプラグイン
    .use(
      resourcesToBackend(async (language, namespace, callback) => {
        const data = await resolver(language, namespace);

        if (!loadedLanguages.includes(language)) {
          loadedLanguages.push(language);
        }

        if (!loadedNamespaces.includes(namespace)) {
          loadedNamespaces.push(namespace);
        }

        return callback(null, data);
      })
    )
    // ブラウザの言語を自動検出するプラグイン
    .use(LanguageDetector)
    // Reactとの連携用プラグイン
    .use(initReactI18next)
    // i18nextの初期化
    .init({
      ...settings,
      detection: {
        order: ['htmlTag', 'cookie', 'navigator'],
        caches: ['cookie'],
        lookupCookie: 'lang',
      },
      interpolation: {
        escapeValue: false,
      },
    });

  // 無限ループを防ぐため、一定回数で強制終了
  if (iteration >= MAX_ITERATIONS) {
    console.debug(`Max iterations reached: ${MAX_ITERATIONS}`);
    return i18next;
  }

  // 必要な言語リソースがロードされていない場合は再試行
  if (loadedLanguages.length === 0 || loadedNamespaces.length === 0) {
    iteration++;
    throw new Error('No languages or namespaces loaded');
  }

  return i18next;
}
