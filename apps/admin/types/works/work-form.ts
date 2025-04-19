import { z } from 'zod';

/**
 * 実績フォームのバリデーションスキーマ
 */
export const workFormSchema = z.object({
  // works テーブルのフィールド
  title: z.string().min(1, 'タイトルは必須です'),
  slug: z
    .string()
    .min(1, 'スラッグは必須です')
    .regex(/^[a-z0-9-]+$/, 'スラッグは小文字英数字とハイフンのみ使用できます'),
  description: z.string().min(1, '概要説明は必須です'),
  thumbnail_url: z
    .string()
    .url('有効なURLを入力してください')
    .min(1, 'サムネイルURLは必須です'),
  category: z.string().min(1, 'カテゴリは必須です'),
  github_url: z
    .string()
    .url('有効なURLを入力してください')
    .optional()
    .or(z.literal('')),
  website_url: z
    .string()
    .url('有効なURLを入力してください')
    .optional()
    .or(z.literal('')),
  status: z.enum(['draft', 'public', 'featured', 'archived']).default('draft'),

  // work_details テーブルのフィールド
  detail_overview: z.string().min(1, 'プロジェクト概要は必須です'),
  detail_role: z.string().min(1, '担当役割は必須です'),
  detail_period: z.string().min(1, '開発期間は必須です'),
  detail_team_size: z.string().min(1, 'チーム規模は必須です'),

  // 関連テーブルのフィールド (配列)
  images: z
    .array(
      z.object({
        url: z.string().url('有効な画像URLを入力してください'),
        alt: z.string().optional(),
        caption: z.string().optional(),
      })
    )
    .optional()
    .default([]),

  challenges: z
    .array(
      z.object({
        title: z.string().min(1, '課題タイトルは必須です'),
        description: z.string().min(1, '課題の説明は必須です'),
      })
    )
    .optional()
    .default([]),

  solutions: z
    .array(
      z.object({
        title: z.string().min(1, '解決策タイトルは必須です'),
        description: z.string().min(1, '解決策の説明は必須です'),
        challenge_id: z.string().optional(),
      })
    )
    .optional()
    .default([]),

  responsibilities: z
    .array(
      z.object({
        description: z.string().min(1, '担当業務の説明は必須です'),
      })
    )
    .optional()
    .default([]),

  results: z
    .array(
      z.object({
        description: z.string().min(1, '成果の説明は必須です'),
      })
    )
    .optional()
    .default([]),

  technologies: z.array(z.string()).optional().default([]), // 技術要素ID（UUID）の配列

  skills: z
    .array(
      z.object({
        skill_id: z.string().min(1, 'スキルIDは必須です'),
        description: z.string().optional(),
        highlights: z.array(z.string()).optional(),
      })
    )
    .optional()
    .default([]),
});

/**
 * 実績フォームのデータ型
 * Zodスキーマから推論
 */
export type WorkFormData = z.infer<typeof workFormSchema>;

/**
 * 実績フォームのProps型
 */
export interface WorkFormProps {
  onSubmit: (data: WorkFormData) => Promise<void>; // フォーム送信時の処理
  initialData?: Partial<WorkFormData>; // 編集時の初期データ
  isLoading?: boolean; // 送信中のローディング状態
}
