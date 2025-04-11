/**
 * タグのマッピング定義
 * タグIDと表示名のマッピングを管理します
 */

// タグのマッピング定義
export const TAG_MAPPINGS = {
  // すべてのタグを一つのマップにまとめる
  book: '書籍',
  project: 'プロジェクト',
  official: '公式ドキュメント',
  business: 'ビジネス',
  nextjs: 'Next.js',
  react: 'React',
  supabase: 'Supabase',
} as const;

/**
 * タグIDから表示名を取得する
 * @param tagId タグID
 * @param tagType タグタイプ（互換性のために残す、無視される）
 * @returns タグの表示名
 */
export function getTagDisplayName(tagId: string): string {
  // TAG_MAPPINGSから直接検索
  if (tagId in TAG_MAPPINGS) {
    return TAG_MAPPINGS[tagId as keyof typeof TAG_MAPPINGS];
  }

  // マッピングが見つからない場合はタグIDをそのまま返す
  return tagId;
}
