/**
 * 見出しテキストからIDを生成する関数
 * @param text - 見出しテキスト
 * @returns 生成されたID
 */
export function generateIdFromText(text: React.ReactNode | undefined): string {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
