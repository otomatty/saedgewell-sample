'use client'; // react-hook-form との連携のため

/**
 * @file 実績フォームの詳細情報セクションコンポーネント。
 * @description プロジェクト概要、役割、期間、チーム規模などの詳細情報を入力します。
 * react-hook-form の useFormContext を使用。
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import type { WorkFormData } from '~/types/works/work-form';

const DetailsSection = () => {
  const { control } = useFormContext<WorkFormData>();

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">詳細情報</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* プロジェクト概要 */}
        <FormField
          control={control}
          name="detail_overview"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>プロジェクト概要</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="プロジェクトの背景や目的などについて詳しく説明してください"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 担当役割 */}
        <FormField
          control={control}
          name="detail_role"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>担当役割</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="プロジェクトでの担当役割について説明してください"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 開発期間 */}
        <FormField
          control={control}
          name="detail_period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>開発期間</FormLabel>
              <FormControl>
                <Input
                  placeholder="例: 2023年4月～2023年9月（6ヶ月）"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* チーム規模 */}
        <FormField
          control={control}
          name="detail_team_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>チーム規模</FormLabel>
              <FormControl>
                <Input
                  placeholder="例: 5名（PM1名、エンジニア3名、デザイナー1名）"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
};

export default DetailsSection;
