/**
 * 日付操作ユーティリティ
 */

/**
 * 日付をYYYY-MM-DD形式の文字列に変換する
 * @param date 変換する日付
 * @returns YYYY-MM-DD形式の文字列
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

/**
 * 日付をYYYY年MM月DD日形式の文字列に変換する
 * @param date 変換する日付
 * @returns YYYY年MM月DD日形式の文字列
 */
export const formatDateToJapanese = (date: Date): string => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${year}年${month}月${day}日`;
};

/**
 * 現在の日付から指定した日数前の日付を取得する
 * @param days 日数
 * @returns 指定した日数前の日付
 */
export const getDateBefore = (days: number): Date => {
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date;
};

/**
 * 現在の日付から指定した日数後の日付を取得する
 * @param days 日数
 * @returns 指定した日数後の日付
 */
export const getDateAfter = (days: number): Date => {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return date;
};

/**
 * 2つの日付の間の日数を計算する
 * @param date1 日付1
 * @param date2 日付2
 * @returns 日数
 */
export const getDaysBetween = (date1: Date, date2: Date): number => {
	const diffTime = Math.abs(date2.getTime() - date1.getTime());
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * 日付が週末（土曜または日曜）かどうかを判定する
 * @param date 判定する日付
 * @returns 週末の場合はtrue、それ以外の場合はfalse
 */
export const isWeekend = (date: Date): boolean => {
	const day = date.getDay();
	return day === 0 || day === 6; // 0: 日曜日, 6: 土曜日
};
