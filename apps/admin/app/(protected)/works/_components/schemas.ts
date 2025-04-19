import { z } from 'zod';

// 画像アイテムのスキーマ
export const ImageItemSchema = z.object({
  // id は DnD や React の key で使う内部的なID (UUID想定)
  id: z.string().uuid('無効なID形式です'),
  // dbId はデータベース上のID (数値、オプショナル)
  dbId: z.number().int().optional(),
  // url は Supabase Storage の URL または ローカル Blob URL
  // url() で基本的なURL形式をバリデーション
  url: z.string().url('無効なURL形式です'),
  // alt は必須の代替テキスト
  alt: z.string().min(1, '代替テキストは必須です'),
  // caption はオプショナルのキャプション
  caption: z.string().optional(),
  // order は表示順 (整数)
  order: z.number().int('表示順は整数である必要があります'),
  // --- RHF管理外のプロパティ (スキーマには含めないことが多い) ---
  // file: z.instanceof(File).optional(), // Fileオブジェクトはフォーム送信時に別途処理
  // uploading: z.boolean().optional(),    // UI表示用の状態
  // error: z.string().optional(),         // UI表示用の状態
});

// ImageItem の TypeScript 型 (Zod スキーマから生成)
export type ImageItem = z.infer<typeof ImageItemSchema>;

// 実績フォーム全体のスキーマ (仮)
// TODO: 他のフィールド (title, description, etc.) を追加する
export const WorkFormSchema = z.object({
  // 基本情報 (例)
  title: z.string().min(1, 'タイトルは必須です'),
  publishedAt: z.date().optional(), // 公開日

  // 詳細情報 (例)
  description: z.string().optional(),

  // 画像リスト (ImageItemSchema の配列)
  images: z.array(ImageItemSchema).optional().default([]), // 空配列をデフォルト値に

  // TODO: 他のフィールド (tags, skills, etc.) を追加
  // tags: z.array(z.object({ id: z.string(), name: z.string() })).optional().default([]),
});

// WorkForm の TypeScript 型 (Zod スキーマから生成)
export type WorkFormData = z.infer<typeof WorkFormSchema>;

// 詳細ページで表示・編集するためのデータ型
// WorkFormData に加えて、編集・更新に必要な ID を含む
export type WorkDetailData = WorkFormData & {
  id: string; // または number, DBの型に合わせる
  // 必要であれば、フォームデータには含まれない他の関連データも追加
  // createdAt?: Date;
  // updatedAt?: Date;
};

// 一覧表示用のデータ型
// WorkDetailData から必要なフィールドを抜粋
export type WorkListItem = Pick<
  WorkDetailData,
  'id' | 'title' | 'publishedAt' // publishedAt は null の可能性あり
> & {
  createdAt: Date; // 作成日は一覧にあると便利
};
