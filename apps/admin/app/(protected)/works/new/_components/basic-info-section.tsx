'use client'; // react-hook-form との連携のため

/**
 * @file 実績フォームの基本情報セクションコンポーネント。
 * @description タイトル、スラッグ、概要、カテゴリなどの基本情報を入力します。
 * react-hook-form の useFormContext を使用してフォーム状態にアクセスします。
 */

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Switch } from '@kit/ui/switch';
import type { WorkFormData } from '~/types/works/work-form';
import { getWorkCategories } from '~/actions/works/works-categories';
import { GithubRepositorySelectorModal } from '~/components/github/github-repository-selector-modal';

// TODO: カテゴリやステータスの選択肢を定義 (DBや定数から取得)
// const categories = [ { value: 'web', label: 'Web開発' }, { value: 'mobile', label: 'モバイルアプリ' }, /* ... */ ];
// const statuses = [ { value: 'draft', label: '下書き' }, { value: 'public', label: '公開' } ];

const BasicInfoSection = () => {
  const { control, setValue, watch } = useFormContext<WorkFormData>();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // タイトルを監視して自動的にスラッグを生成（編集時を除く）
  const title = watch('title');
  const slug = watch('slug');
  const isPublic = watch('status') === 'public';

  // カテゴリ一覧を取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getWorkCategories();
        setCategories(result);
        setIsLoading(false);
      } catch (err) {
        console.error('カテゴリの取得に失敗しました:', err);
        setError('カテゴリ一覧の取得に失敗しました。');
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // タイトルからスラッグを自動生成（未入力の場合のみ）
  useEffect(() => {
    if (title && !slug) {
      // スラッグ化：小文字、空白をハイフンに、英数字とハイフン以外を削除
      const newSlug = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-'); // 連続するハイフンを単一に
      setValue('slug', newSlug);
    }
  }, [title, slug, setValue]);

  // 公開状態の切り替え
  const handlePublicToggle = (checked: boolean) => {
    setValue('status', checked ? 'public' : 'draft');
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">基本情報</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* タイトル */}
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input placeholder="実績のタイトルを入力" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* スラッグ */}
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>スラッグ（URL）</FormLabel>
              <FormControl>
                <Input placeholder="url-friendly-slug" {...field} />
              </FormControl>
              <FormDescription>
                URLに使用される識別子です。英数字とハイフンのみ使用できます。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* カテゴリ */}
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリ</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      読み込み中...
                    </SelectItem>
                  ) : error ? (
                    <SelectItem value="error" disabled>
                      {error}
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* サムネイルURL */}
        <FormField
          control={control}
          name="thumbnail_url"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>サムネイル画像URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                実績一覧に表示されるサムネイル画像のURLを入力してください。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GitHubリポジトリURL（任意） */}
        <FormField
          control={control}
          name="github_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHubリポジトリURL（任意）</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    placeholder="https://github.com/username/repo"
                    {...field}
                  />
                </FormControl>
                <GithubRepositorySelectorModal
                  onSelect={(url) => setValue('github_url', url)}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ウェブサイトURL（任意） */}
        <FormField
          control={control}
          name="website_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ウェブサイトURL（任意）</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 概要 */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>概要</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="実績の概要を入力してください"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 公開状態 */}
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2">
              <div className="space-y-0.5">
                <FormLabel className="text-base">公開する</FormLabel>
                <FormDescription>
                  オンにすると実績が公開され、ポートフォリオサイトに表示されます
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === 'public'}
                  onCheckedChange={handlePublicToggle}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </section>
  );
};

export default BasicInfoSection;
