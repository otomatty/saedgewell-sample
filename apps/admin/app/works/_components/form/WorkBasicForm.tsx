'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import type { Work } from '@kit/types/works';
import type { SubmitHandler } from 'react-hook-form';

interface WorkBasicFormProps {
  work?: Work;
  onSubmit: (data: WorkBasicFormData) => void;
}

const workBasicFormSchema = z.object({
  title: z.string().min(1, { message: 'タイトルを入力してください' }),
  slug: z.string().min(1, { message: 'スラッグを入力してください' }),
  description: z.string().min(1, { message: '説明を入力してください' }),
  thumbnail_url: z.string().nullable(),
  github_url: z.string().nullable(),
  website_url: z.string().nullable(),
  category: z.enum(['company', 'freelance', 'personal']),
  status: z.enum(['draft', 'published', 'archived']),
});

type WorkBasicFormData = z.infer<typeof workBasicFormSchema>;

export function WorkBasicForm({ work, onSubmit }: WorkBasicFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<WorkBasicFormData>({
    resolver: zodResolver(workBasicFormSchema),
    defaultValues: {
      title: work?.title ?? '',
      slug: work?.slug ?? '',
      description: work?.description ?? '',
      thumbnail_url: work?.thumbnail_url ?? null,
      github_url: work?.github_url ?? null,
      website_url: work?.website_url ?? null,
      category: work?.category ?? 'company',
      status: work?.status ?? 'draft',
    },
  });

  const handleSubmit: SubmitHandler<WorkBasicFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input placeholder="タイトル" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>スラッグ</FormLabel>
              <FormControl>
                <Input placeholder="スラッグ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>説明</FormLabel>
              <FormControl>
                <Textarea placeholder="説明" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>サムネイル URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="サムネイル URL"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="github_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="GitHub URL"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Website URL"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリー</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリーを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="company">会社</SelectItem>
                  <SelectItem value="freelance">フリーランス</SelectItem>
                  <SelectItem value="personal">個人</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ステータス</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">下書き</SelectItem>
                  <SelectItem value="published">公開</SelectItem>
                  <SelectItem value="archived">アーカイブ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? '更新中...' : '更新'}
        </Button>
      </form>
    </Form>
  );
}
