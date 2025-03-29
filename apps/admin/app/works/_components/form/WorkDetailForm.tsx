'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Work, WorkWithRelations } from '@kit/types/works';
import { Button } from '@kit/ui/button';
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
import type { SubmitHandler } from 'react-hook-form';

interface WorkDetailFormProps {
  work?: WorkWithRelations;
  onSubmit: (data: WorkDetailFormData) => void;
}

const workDetailFormSchema = z.object({
  overview: z.string().min(1, { message: '概要を入力してください' }),
  role: z.string().min(1, { message: '役割を入力してください' }),
  period: z.string().min(1, { message: '期間を入力してください' }),
  team_size: z.string().min(1, { message: 'チーム規模を入力してください' }),
});

type WorkDetailFormData = z.infer<typeof workDetailFormSchema>;

export function WorkDetailForm({ work, onSubmit }: WorkDetailFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<WorkDetailFormData>({
    resolver: zodResolver(workDetailFormSchema),
    defaultValues: {
      overview: work?.work_details?.[0]?.overview ?? '',
      role: work?.work_details?.[0]?.role ?? '',
      period: work?.work_details?.[0]?.period ?? '',
      team_size: work?.work_details?.[0]?.team_size ?? '',
    },
  });

  const handleSubmit: SubmitHandler<WorkDetailFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="overview"
          render={({ field }) => (
            <FormItem>
              <FormLabel>概要</FormLabel>
              <FormControl>
                <Textarea placeholder="概要" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>役割</FormLabel>
              <FormControl>
                <Input placeholder="役割" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>期間</FormLabel>
              <FormControl>
                <Input placeholder="期間" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="team_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>チーム規模</FormLabel>
              <FormControl>
                <Input placeholder="チーム規模" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? '更新中...' : '更新'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
