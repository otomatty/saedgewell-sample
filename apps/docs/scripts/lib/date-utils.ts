/**
 * 日付関連のユーティリティ関数
 */

/**
 * 現在の日本標準時の日付を YYYY-MM-DD 形式で取得する
 * @returns 日本標準時の日付文字列 (YYYY-MM-DD)
 */
export function getJSTDateString(): string {
  // 日本標準時のタイムゾーンオフセットを設定（UTC+9時間）
  const now = new Date();
  const jstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  const year = jstDate.getUTCFullYear();
  const month = String(jstDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(jstDate.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 日本標準時のDate オブジェクトを取得する
 * @returns 日本標準時の Date オブジェクト
 */
export function getJSTDate(): Date {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}

/**
 * 指定された日付文字列をJST基準のDateオブジェクトに変換する
 * @param dateStr 日付文字列 (YYYY-MM-DD)
 * @returns JST基準のDateオブジェクト
 */
export function parseJSTDate(dateStr: string): Date {
  // 日付文字列にJST指定をつける
  return new Date(`${dateStr}T00:00:00+09:00`);
}

/**
 * 2つの日付の間の日数を計算する
 * @param date1 日付1
 * @param date2 日付2
 * @returns 日数
 */
export function getDaysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
