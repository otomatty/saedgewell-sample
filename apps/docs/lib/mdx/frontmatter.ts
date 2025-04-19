import { z } from 'zod';

/**
 * MDXファイルのフロントマターのスキーマ定義
 * titleが未定義の場合はファイル名から生成します
 */
export const DocFrontmatterSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
    status: z
      .enum(['published', 'draft', 'private'])
      .optional()
      .default('published'),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    image: z.string().optional(),
    author: z.string().optional(),
    toc: z.boolean().optional(),
    featured: z.boolean().optional(),
  })
  .passthrough();

/**
 * ファイル名からタイトルを生成する
 * @param filename ファイル名
 * @returns 生成されたタイトル
 */
export function generateTitleFromFilename(filename: string): string {
  return filename
    .replace(/\.mdx$/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
