import { updateSiteSettings } from '@kit/next/actions';
import type { SiteSettings } from '@kit/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { SiteSettingsFormClient } from './site-settings-form-client';

// Zodスキーマ (クライアントと共有)
const siteSettingsSchema = z.object({
  siteStatus: z.enum(['development', 'staging', 'production']),
  maintenanceMode: z.boolean(),
  isDevelopmentBannerEnabled: z.boolean(),
  siteName: z.string().min(1, 'サイト名は必須です'),
  siteDescription: z.string().min(1, 'サイトの説明は必須です'),
  siteKeywords: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.filter(Boolean)),
  ogImageUrl: z.string().nullable(),
  faviconUrl: z.string().nullable(),
  robotsTxtContent: z.string().nullable(),
  enableBlog: z.boolean(),
  enableWorks: z.boolean(),
  enableContact: z.boolean(),
  enableEstimate: z.boolean(),
  socialLinks: z.object({
    github: z.string().nullable(),
    twitter: z.string().nullable(),
    linkedin: z.string().nullable(),
  }),
});

type FormValues = z.infer<typeof siteSettingsSchema>;

// Propsの型定義 (親コンポーネントから初期設定を受け取る)
interface SiteSettingsFormProps {
  initialSettings: SiteSettings;
}

export function SiteSettingsForm({ initialSettings }: SiteSettingsFormProps) {
  // 設定更新のServer Action
  async function handleUpdateSettings(values: FormValues) {
    'use server';
    try {
      // サーバーサイドでのバリデーション
      const validatedData = siteSettingsSchema.parse(values);

      // 開発環境でのログ出力
      if (process.env.NODE_ENV === 'development') {
        console.group('🔄 サイト設定の更新内容 [Server Action]');
        console.log('受信データ:', values); // バリデーション前のデータも確認
        console.log('検証済みデータ:', validatedData);
        console.groupEnd();
      }

      await updateSiteSettings(validatedData);

      // 設定ページと関連ページを再検証
      revalidatePath('/settings/site');
      // revalidatePath('/'); // 必要に応じて他のパスも

      return { success: true };
    } catch (error) {
      console.error('設定更新エラー [Server Action]:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  // クライアントコンポーネントに初期設定とアクションを渡す
  return (
    <SiteSettingsFormClient
      initialSettings={initialSettings}
      updateSettingsAction={handleUpdateSettings}
    />
  );
}
