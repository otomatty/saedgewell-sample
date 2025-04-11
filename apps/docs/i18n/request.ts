// i18n/request.ts
// next-intlのリクエスト設定

import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locale || 'ja',
    messages: await import(`../messages/${locale || 'ja'}.json`).then(
      (module) => module.default
    ),
    timeZone: 'Asia/Tokyo',
  };
});
