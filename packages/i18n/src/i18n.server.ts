/**
 * i18n.server.ts
 *
 * このファイルは、サーバーサイドでのi18n機能の初期化と言語設定の処理を担当します。
 * 主な役割：
 * 1. サーバーサイドレンダリング（SSR）時のi18n初期化
 * 2. React Server Components（RSC）でのi18nサポート
 * 3. ブラウザの言語設定（Accept-Language）の解析
 */

import { type InitOptions, createInstance, type i18n } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';

/**
 * サーバーサイドでi18nを初期化する関数
 * SSRとRSCの両方で使用されます
 *
 * @param settings - i18nの設定（言語、名前空間など）
 * @param resolver - 翻訳ファイルを動的に読み込むための関数
 * @returns 初期化されたi18nインスタンス
 */
export async function initializeServerI18n(
  settings: InitOptions,
  resolver: (language: string, namespace: string) => Promise<object>
): Promise<i18n> {
  const i18nInstance = createInstance();
  const loadedNamespaces = new Set<string>();

  // i18nインスタンスの初期化と設定
  await new Promise((resolve) => {
    void i18nInstance
      .use(
        // 翻訳リソースを動的にロードするプラグイン
        resourcesToBackend(async (language, namespace, callback) => {
          try {
            const data = await resolver(language, namespace);
            loadedNamespaces.add(namespace);
            return callback(null, data);
          } catch (error) {
            console.log(
              `Error loading i18n file: locales/${language}/${namespace}.json`,
              error
            );
            return callback(null, {});
          }
        })
      )
      // React連携の初期化を待機するプラグイン
      .use({
        type: '3rdParty',
        init: async (i18next: typeof i18nInstance) => {
          let iterations = 0;
          const maxIterations = 100;

          while (i18next.isInitializing) {
            iterations++;
            if (iterations > maxIterations) {
              console.error(
                `i18next is not initialized after ${maxIterations} iterations`
              );
              break;
            }
            await new Promise((resolve) => setTimeout(resolve, 1));
          }

          initReactI18next.init(i18next);
          resolve(i18next);
        },
      })
      .init(settings);
  });

  // 必要な全ての名前空間がロードされるまで待機
  const namespaces = settings.ns as string[];
  if (loadedNamespaces.size === namespaces.length) {
    return i18nInstance;
  }

  const maxWaitTime = 0.1; // 100ミリ秒
  const checkIntervalMs = 5; // 5ミリ秒

  // 名前空間のロードを待機する関数
  async function waitForNamespaces() {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitTime) {
      const allNamespacesLoaded = namespaces.every((ns) =>
        loadedNamespaces.has(ns)
      );
      if (allNamespacesLoaded) return true;
      await new Promise((resolve) => setTimeout(resolve, checkIntervalMs));
    }
    return false;
  }

  const success = await waitForNamespaces();
  if (!success) {
    console.warn(
      `Not all namespaces were loaded after ${maxWaitTime}ms. Initialization may be incomplete.`
    );
  }

  return i18nInstance;
}

/**
 * ブラウザから送信される Accept-Language ヘッダーを解析する関数
 *
 * @param languageHeaderValue - Accept-Language ヘッダーの値（例：'ja,en-US;q=0.9,en;q=0.8'）
 * @param acceptedLanguages - アプリケーションがサポートする言語のリスト
 * @returns サポートされている言語のリスト（優先度順）
 */
export function parseAcceptLanguageHeader(
  languageHeaderValue: string | null | undefined,
  acceptedLanguages: string[]
): string[] {
  if (!languageHeaderValue) return [];

  const ignoreWildcard = true;

  return languageHeaderValue
    .split(',')
    .map((lang): [number, string] => {
      const [locale, q = 'q=1'] = lang.split(';');
      if (!locale) return [0, ''];

      const trimmedLocale = locale.trim();
      const numQ = Number(q.replace(/q ?=/, ''));

      return [Number.isNaN(numQ) ? 0 : numQ, trimmedLocale];
    })
    .sort(([q1], [q2]) => q2 - q1)
    .flatMap(([_, locale]) => {
      if (locale === '*' && ignoreWildcard) return [];

      const languageSegment = locale.split('-')[0];
      if (!languageSegment) return [];

      try {
        return acceptedLanguages.includes(languageSegment)
          ? [languageSegment]
          : [];
      } catch {
        return [];
      }
    });
}
