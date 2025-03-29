import { z } from 'zod';

const production = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1'; // Vercel環境かどうか確認

// 環境変数が設定されていない場合のデフォルト値
const DEFAULT_SITE_URL = 'https://docs.saedgewell.net';

// アプリケーション設定の型定義
interface AppConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  locale: string;
  theme: 'light' | 'dark' | 'system';
  production: boolean;
  themeColor: string;
  themeColorDark: string;
}

const AppConfigSchema = z
  .object({
    name: z
      .string({
        description: 'This is the name of your SaaS. Ex. "Makerkit"',
        required_error: 'Please provide the variable NEXT_PUBLIC_PRODUCT_NAME',
      })
      .min(1),
    title: z
      .string({
        description: 'This is the default title tag of your SaaS.',
        required_error: 'Please provide the variable NEXT_PUBLIC_SITE_TITLE',
      })
      .min(1),
    description: z.string({
      description: 'This is the default description of your SaaS.',
      required_error:
        'Please provide the variable NEXT_PUBLIC_SITE_DESCRIPTION',
    }),
    url: z
      .string({
        required_error: 'Please provide the variable NEXT_PUBLIC_SITE_URL',
      })
      .url()
      .default(DEFAULT_SITE_URL),
    locale: z
      .string({
        description: 'This is the default locale of your SaaS.',
        required_error:
          'Please provide the variable NEXT_PUBLIC_DEFAULT_LOCALE',
      })
      .default('en'),
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    production: z.boolean(),
    themeColor: z.string().default('#0ea5e9'),
    themeColorDark: z.string().default('#0369a1'),
  })
  .refine(
    (schema) => {
      const isCI = process.env.NEXT_PUBLIC_CI;

      // CI環境またはVercel環境、または非本番環境ではURLチェックをスキップ
      if (isCI || isVercel || !schema.production) {
        return true;
      }

      return !schema.url.startsWith('http:');
    },
    {
      message: `Please provide a valid HTTPS URL. Set the variable NEXT_PUBLIC_SITE_URL with a valid URL, such as: 'https://example.com'`,
      path: ['url'],
    }
  );

// 型安全のために try-catch を使用して、パース失敗時はデフォルト値を使用
let appConfig: AppConfig;
try {
  // Vercel環境では常にデフォルトURLを使用
  const siteUrl = isVercel
    ? DEFAULT_SITE_URL
    : process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;

  appConfig = AppConfigSchema.parse({
    name: process.env.NEXT_PUBLIC_PRODUCT_NAME,
    title: process.env.NEXT_PUBLIC_SITE_TITLE,
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
    url: siteUrl,
    locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
    theme:
      process.env.NEXT_PUBLIC_DEFAULT_THEME_MODE ||
      process.env.NEXT_PUBLIC_THEME,
    themeColor: process.env.NEXT_PUBLIC_THEME_COLOR,
    themeColorDark: process.env.NEXT_PUBLIC_THEME_COLOR_DARK,
    production,
  });

  // デバッグログ
  console.log(
    `[DEBUG] AppConfig URL: ${appConfig.url} (isVercel: ${isVercel})`
  );
} catch (error) {
  console.warn('Error parsing app config:', error);
  // エラーが発生した場合はデフォルト値を使用
  appConfig = {
    name: process.env.NEXT_PUBLIC_PRODUCT_NAME || 'Saedgewell',
    title: process.env.NEXT_PUBLIC_SITE_TITLE || 'Saedgewell Documentation',
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      'Saedgewellの公式ドキュメントサイト',
    url: DEFAULT_SITE_URL,
    locale: 'ja',
    theme: 'system',
    themeColor: '#0ea5e9',
    themeColorDark: '#0369a1',
    production,
  };
}

export default appConfig;
