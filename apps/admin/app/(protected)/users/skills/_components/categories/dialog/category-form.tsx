'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { SkillCategory } from '@kit/types/skills';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { Button } from '@kit/ui/button';

export const formSchema = z.object({
  name: z.string().min(1, '必須項目です'),
  description: z.string().min(1, '必須項目です'),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  defaultValues?: Partial<SkillCategory>;
  onSubmit: (values: FormData) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({ defaultValues, onSubmit, onCancel }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリー名</FormLabel>
              <FormControl>
                <Input placeholder="例: フロントエンド" {...field} />
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
                <Textarea
                  placeholder="カテゴリーの説明を入力してください"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit">保存</Button>
        </div>
      </form>
    </Form>
  );
}
