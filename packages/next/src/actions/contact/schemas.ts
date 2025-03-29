import { z } from 'zod';

/**
 * カテゴリ取得用のスキーマ
 */
export const GetCategorySchema = z.object({
  id: z.string().uuid(),
});

/**
 * カテゴリ作成用のスキーマ
 */
export const CreateCategorySchema = z.object({
  name: z.string().min(1, { message: 'カテゴリ名は必須です' }),
  description: z.string().optional(),
});

/**
 * カテゴリ更新用のスキーマ
 */
export const UpdateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: 'カテゴリ名は必須です' }),
  description: z.string().optional(),
});

/**
 * カテゴリ削除用のスキーマ
 */
export const DeleteCategorySchema = z.object({
  id: z.string().uuid(),
});
