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
import type { SiteSettings } from '@kit/types';

// Zodスキーマ定義 (サーバーと共有)
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

// Propsの型定義
interface SiteSettingsFormClientProps {
  initialSettings: SiteSettings;
  updateSettingsAction: (
    values: FormValues
  ) => Promise<{ success: boolean; error?: Error }>;
}

export function SiteSettingsFormClient({
  initialSettings,
  updateSettingsAction,
}: SiteSettingsFormClientProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: initialSettings, // サーバーから渡された初期値を使用
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        // 開発環境でのログ出力はここに残しても良い
        if (process.env.NODE_ENV === 'development') {
          console.group('🔄 サイト設定の更新内容 [Client]');
          console.log('更新前 (Props):', initialSettings);
          console.log('更新データ:', values);
          console.groupEnd();
        }

        const result = await updateSettingsAction(values);

        if (!result.success) {
          throw result.error || new Error('不明なエラーが発生しました。');
        }

        toast.success('設定を更新しました');
        // Server Action内のrevalidateにより、親コンポーネント経由で
        // initialSettingsが更新されるはずなので、resetは不要かもしれない。
        // 必要であれば form.reset(values); のように更新後の値でリセット。
      } catch (error) {
        console.error('設定更新エラー [Client]:', error);
        toast.error(
          `設定の更新に失敗しました: ${error instanceof Error ? error.message : String(error)}`
        );
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
                    disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                    <Input {...field} disabled={isPending} />
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
                    <Textarea {...field} disabled={isPending} />
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
                    {/* 配列をカンマ区切り文字列に変換して表示・編集 */}
                    <Input
                      {...field}
                      value={
                        Array.isArray(field.value) ? field.value.join(', ') : ''
                      }
                      onChange={(e) => {
                        const keywords = e.target.value
                          .split(',')
                          .map((kw) => kw.trim())
                          .filter(Boolean); // 空文字を除去
                        field.onChange(keywords);
                      }}
                      placeholder="キーワードをカンマ区切りで入力"
                      disabled={isPending}
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
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      disabled={isPending}
                    />
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
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      disabled={isPending}
                    />
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
                      placeholder="User-agent: *\nAllow: /"
                      disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                      disabled={isPending}
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
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      disabled={isPending}
                    />
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
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      disabled={isPending}
                    />
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
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      disabled={isPending}
                    />
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
