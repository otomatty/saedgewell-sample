/**
 * 日付操作ユーティリティ関数
 */

/**
 * 日付文字列から曜日を取得する（日本語表記）
 * @param dateString YYYY-MM-DD形式の日付文字列
 * @returns 曜日（日本語表記）
 */
export function getJapaneseDayOfWeek(dateString: string): string {
  const dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'];
  const date = new Date(dateString || '');
  return dayOfWeekStr[date.getDay()] || '月';
}

/**
 * 日付文字列から曜日が土日かどうかを判定する
 * @param dateString YYYY-MM-DD形式の日付文字列
 * @returns 土日であればtrue、それ以外はfalse
 */
export function isWeekend(dateString: string): boolean {
  const date = new Date(dateString || '');
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0: 日曜日, 6: 土曜日
}

/**
 * 日付文字列から年月を取得する
 * @param dateString YYYY-MM-DD形式の日付文字列
 * @returns YYYY年MM月の形式
 */
export function getYearMonth(dateString: string): string {
  const date = new Date(dateString || '');
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

/**
 * 日付文字列から日にちを取得する（例：21日（月））
 * @param dateString YYYY-MM-DD形式の日付文字列
 * @returns 日付+曜日の文字列（例：21日（月））
 */
export function getFormattedDay(dateString: string): string {
  const date = new Date(dateString || '');
  const day = date.getDate();
  const dayOfWeek = getJapaneseDayOfWeek(dateString || '');
  return `${day}日（${dayOfWeek}）`;
}

/**
 * 文字列から日付部分を抽出する（例：2025-03-21 or 2025-03-21-title）
 * @param str 日付を含む文字列
 * @returns YYYY-MM-DD形式の日付文字列（取得できない場合は空文字列）
 */
export function extractDateFromString(str: string): string {
  const match = (str || '').match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? '';
}
