/**
 * 文字列操作ユーティリティ
 */

/**
 * 文字列を指定した長さに切り詰め、必要に応じて末尾に省略記号を追加する
 * @param str 対象の文字列
 * @param maxLength 最大長
 * @param suffix 省略記号（デフォルト: "..."）
 * @returns 切り詰められた文字列
 */
export const truncate = (
	str: string,
	maxLength: number,
	suffix = "...",
): string => {
	if (str.length <= maxLength) return str;
	return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * 文字列が有効なURLかどうかを検証する
 * @param str 検証する文字列
 * @returns 有効なURLの場合はtrue、それ以外の場合はfalse
 */
export const isValidUrl = (str: string): boolean => {
	try {
		const url = new URL(str);
		// 有効なプロトコルかどうかを確認
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
};

/**
 * 文字列が有効なメールアドレスかどうかを検証する
 * @param str 検証する文字列
 * @returns 有効なメールアドレスの場合はtrue、それ以外の場合はfalse
 */
export const isValidEmail = (str: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(str);
};

/**
 * 文字列から特殊文字をエスケープする
 * @param str エスケープする文字列
 * @returns エスケープされた文字列
 */
export const escapeHtml = (str: string): string => {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
};

/**
 * 文字列をスラッグ形式に変換する（小文字、ハイフン区切り）
 * @param str 変換する文字列
 * @returns スラッグ形式の文字列
 */
export const slugify = (str: string): string => {
	return str
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "")
		.replace(/--+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
};
