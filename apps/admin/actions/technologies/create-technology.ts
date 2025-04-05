'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Database } from '../../lib/database.types';
import { z } from 'zod';

type Technology = Database['public']['Tables']['technologies']['Row'];

// categoryの有効な値
const validCategories = [
  'frontend',
  'backend',
  'database',
  'infrastructure',
  'other',
  'programming',
  'language',
  'framework',
  'library',
  'tool',
  'ai',
] as const;

type TechnologyCategory = (typeof validCategories)[number];

// バリデーションスキーマ
const createTechnologySchema = z.object({
  name: z.string().min(1, '技術名は必須です'),
  slug: z
    .string()
    .min(1, 'スラッグは必須です')
    .regex(/^[a-z0-9-]+$/, 'スラッグは小文字英数字とハイフンのみ使用可能です'),
  description: z.string().optional(),
  website_url: z
    .string()
    .url('有効なURLを入力してください')
    .optional()
    .or(z.literal('')),
  icon_url: z
    .string()
    .url('有効なURLを入力してください')
    .optional()
    .or(z.literal('')),
  category: z.enum(validCategories).optional(),
});

export type CreateTechnologyInput = z.infer<typeof createTechnologySchema>;

/**
 * 新規技術要素を作成する
 * @param data 技術要素のデータ
 * @returns 作成された技術要素
 */
export async function createTechnology(
  data: CreateTechnologyInput
): Promise<Technology> {
  // 入力データをバリデーション
  const validated = createTechnologySchema.parse(data);

  const supabase = getSupabaseServerClient();

  // スラッグの重複チェック
  const { data: existing, error: checkError } = await supabase
    .from('technologies')
    .select('slug')
    .eq('slug', validated.slug)
    .maybeSingle();

  if (checkError) {
    console.error('技術スラッグ確認エラー:', checkError);
    throw new Error(
      `技術情報の確認中にエラーが発生しました: ${checkError.message}`
    );
  }

  if (existing) {
    throw new Error(`スラッグ「${validated.slug}」は既に使用されています`);
  }

  // デフォルトのカテゴリを設定
  const categoryValue: TechnologyCategory = validated.category || 'other';

  // 技術要素を作成
  const { data: created, error } = await supabase
    .from('technologies')
    .insert({
      name: validated.name,
      slug: validated.slug,
      description: validated.description || null,
      website_url: validated.website_url || null,
      icon_url: validated.icon_url || null,
      category: categoryValue,
    })
    .select()
    .single();

  if (error) {
    console.error('技術作成エラー:', error);
    throw new Error(`技術の作成に失敗しました: ${error.message}`);
  }

  return created as Technology;
}

/**
 * スラッグを生成する（名前から）
 * @param name 技術名
 * @returns スラッグ文字列
 */
export async function generateSlug(name: string): Promise<string> {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
