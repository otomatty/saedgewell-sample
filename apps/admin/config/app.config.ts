import { z } from 'zod';

const production = process.env.NODE_ENV === 'production';

// アプリケーション設定の型定義
type AppConfig = {
  name: string;
  title: string;
  description: string;
  url: string;
  locale: string;
  theme: 'light' | 'dark' | 'system';
  production: boolean;
  themeColor: string;
  themeColorDark: string;
};

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
      .url({
        message: `You are deploying a production build but have entered a NEXT_PUBLIC_SITE_URL variable using http instead of https. It is very likely that you have set the incorrect URL. The build will now fail to prevent you from from deploying a faulty configuration. Please provide the variable NEXT_PUBLIC_SITE_URL with a valid URL, such as: 'https://example.com'`,
      }),
    locale: z
      .string({
        description: 'This is the default locale of your SaaS.',
        required_error:
          'Please provide the variable NEXT_PUBLIC_DEFAULT_LOCALE',
      })
      .default('en'),
    theme: z.enum(['light', 'dark', 'system']),
    production: z.boolean(),
    themeColor: z.string(),
    themeColorDark: z.string(),
  })
  .refine(
    (schema) => {
      const isCI = process.env.NEXT_PUBLIC_CI;

      if (isCI ?? !schema.production) {
        return true;
      }

      return !schema.url.startsWith('http:');
    },
    {
      message: `Please provide a valid HTTPS URL. Set the variable NEXT_PUBLIC_SITE_URL with a valid URL, such as: 'https://example.com'`,
      path: ['url'],
    }
  )
  .refine(
    (schema) => {
      return schema.themeColor !== schema.themeColorDark;
    },
    {
      message:
        'Please provide different theme colors for light and dark themes.',
      path: ['themeColor'],
    }
  );

const appConfigInput = {
  name: process.env.NEXT_PUBLIC_PRODUCT_NAME,
  title: process.env.NEXT_PUBLIC_SITE_TITLE,
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
  url: process.env.NEXT_PUBLIC_SITE_URL,
  locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  theme: process.env.NEXT_PUBLIC_DEFAULT_THEME_MODE,
  themeColor: process.env.NEXT_PUBLIC_THEME_COLOR,
  themeColorDark: process.env.NEXT_PUBLIC_THEME_COLOR_DARK,
  production,
};

// 入力値をログに出力

let appConfig: AppConfig;

try {
  appConfig = AppConfigSchema.parse(appConfigInput) as AppConfig;
  // パース成功時の値をログに出力
} catch (error) {
  // エラー情報を詳細に出力
  console.error('[ERROR] AppConfigSchema.parse()でエラーが発生:', error);

  // エラーがZodErrorの場合は詳細情報を出力
  if (error instanceof z.ZodError) {
    console.error(
      '[ERROR] ZodErrorの詳細:',
      JSON.stringify(error.format(), null, 2)
    );
  }

  // 開発環境やデバッグ時は、エラーを無視してビルドを続行するためのフォールバック設定
  // 本番環境では使用しないでください
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.DEBUG_IGNORE_CONFIG_ERROR === 'true'
  ) {
    console.warn(
      '[WARN] 開発環境のため、エラーを無視してフォールバック設定を使用します'
    );

    const fallbackConfig = {
      ...appConfigInput,
      // ダークテーマの色が未設定または同じ場合は、異なる値を設定
      themeColorDark:
        appConfigInput.themeColor === appConfigInput.themeColorDark
          ? `${appConfigInput.themeColor}-dark`
          : appConfigInput.themeColorDark,
    };

    appConfig = fallbackConfig as AppConfig;
  } else {
    // 本番環境ではエラーを再スロー
    throw error;
  }
}

export default appConfig;
