'use client';

import type { Control } from 'react-hook-form';
import type { Skill, SkillCategory } from '@kit/types/skills';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { Button } from '@kit/ui/button';
import { Calendar } from '@kit/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@kit/ui/popover';
import { cn } from '@kit/ui/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';

export type ManualSkillFormData = {
  name: string;
  slug: string;
  description: string;
  categories: string[];
  icon_url: string | null;
  started_at: Date;
};

interface Props {
  control: Control<ManualSkillFormData>;
  categories: SkillCategory[];
}

export function ManualSkillForm({ control, categories }: Props) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>スキル名</FormLabel>
            <FormControl>
              <Input placeholder="例: React" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>スラッグ</FormLabel>
            <FormControl>
              <Input placeholder="例: react" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="categories"
        render={({ field }) => (
          <FormItem>
            <FormLabel>カテゴリー</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(value.split(','))}
              defaultValue={field.value.join(',')}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリーを選択" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>説明</FormLabel>
            <FormControl>
              <Textarea
                placeholder="スキルの説明を入力してください"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="icon_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>アイコンURL</FormLabel>
            <FormControl>
              <Input
                placeholder="例: https://example.com/icon.png"
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || null)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="started_at"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>開始日</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[240px] pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'yyyy年MM月dd日', {
                        locale: ja,
                      })
                    ) : (
                      <span>日付を選択</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date('2000-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
