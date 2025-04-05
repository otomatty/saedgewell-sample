/**
 * next-intl/plugin モジュールの型定義
 * @see https://next-intl-docs.vercel.app/docs/getting-started/app-router
 */
declare module 'next-intl/plugin' {
  import type { NextConfig } from 'next';

  interface NextIntlPluginOptions {
    locales?: string[];
    defaultLocale?: string;
    // その他のオプションがあれば追加
  }

  /**
   * Next.jsの設定に国際化プラグインを追加するための関数
   * @param {NextIntlPluginOptions} [options] - プラグインのオプション
   * @returns {Function} 設定を拡張するプラグイン関数
   */
  export default function createNextIntlPlugin(
    options?: NextIntlPluginOptions
  ): (config: NextConfig) => NextConfig;
}
