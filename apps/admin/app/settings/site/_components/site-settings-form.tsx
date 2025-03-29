'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { Switch } from '@kit/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { updateSiteSettings } from '@kit/next/actions';
import type { SiteSettings } from '@kit/types';

// バリデーションスキーマ
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

interface SiteSettingsFormProps {
  initialSettings: SiteSettings;
}

export function SiteSettingsForm({ initialSettings }: SiteSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  // フォームの初期化
  const form = useForm<FormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteStatus: initialSettings.siteStatus,
      maintenanceMode: initialSettings.maintenanceMode,
      isDevelopmentBannerEnabled: initialSettings.isDevelopmentBannerEnabled,
      siteName: initialSettings.siteName,
      siteDescription: initialSettings.siteDescription,
      siteKeywords: initialSettings.siteKeywords,
      ogImageUrl: initialSettings.ogImageUrl,
      faviconUrl: initialSettings.faviconUrl,
      robotsTxtContent: initialSettings.robotsTxtContent,
      enableBlog: initialSettings.enableBlog,
      enableWorks: initialSettings.enableWorks,
      enableContact: initialSettings.enableContact,
      enableEstimate: initialSettings.enableEstimate,
      socialLinks: initialSettings.socialLinks,
    },
  });

  // フォーム送信処理
  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        // 開発環境でのみ更新内容をコンソールに表示
        if (process.env.NODE_ENV === 'development') {
          console.group('🔄 サイト設定の更新内容');
          console.log('更新前:', initialSettings);
          console.log('更新後:', values);
          console.groupEnd();
        }

        await updateSiteSettings(values);
        toast.success('設定を更新しました');
      } catch (error) {
        console.error(error);
        toast.error('設定の更新に失敗しました');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 基本設定 */}
        <Card>
          <CardHeader>
            <CardTitle>基本設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="siteStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>サイトの状態</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="サイトの状態を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="development">開発中</SelectItem>
                      <SelectItem value="staging">ステージング</SelectItem>
                      <SelectItem value="production">本番</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maintenanceMode"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>メンテナンスモード</FormLabel>
                    <FormDescription>
                      有効にすると、管理者以外はサイトにアクセスできなくなります
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDevelopmentBannerEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>開発中バナー</FormLabel>
                    <FormDescription>
                      サイトが開発中であることを示すバナーを表示します
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* SEO設定 */}
        <Card>
          <CardHeader>
            <CardTitle>SEO設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>サイト名</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>サイトの説明</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>キーワード</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="キーワードをカンマ区切りで入力"
                    />
                  </FormControl>
                  <FormDescription>
                    例: プロダクトエンジニア, Web開発, Next.js
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ogImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OGP画像URL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="faviconUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ファビコンURL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="robotsTxtContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>robots.txt</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      placeholder="User-agent: *&#10;Allow: /"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* 機能設定 */}
        <Card>
          <CardHeader>
            <CardTitle>機能設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="enableBlog"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>ブログ機能</FormLabel>
                    <FormDescription>
                      ブログ機能の有効/無効を切り替えます
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableWorks"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>実績機能</FormLabel>
                    <FormDescription>
                      実績機能の有効/無効を切り替えます
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableContact"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>お問い合わせ機能</FormLabel>
                    <FormDescription>
                      お問い合わせ機能の有効/無効を切り替えます
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableEstimate"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>見積もり機能</FormLabel>
                    <FormDescription>
                      見積もり機能の有効/無効を切り替えます
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* SNS設定 */}
        <Card>
          <CardHeader>
            <CardTitle>SNS設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="socialLinks.github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialLinks.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter URL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialLinks.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? '更新中...' : '設定を更新'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
