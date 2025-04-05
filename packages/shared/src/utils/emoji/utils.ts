/**
 * 絵文字ユーティリティ関数
 * 絵文字の検索や操作に関する関数を提供します。
 */

import { emojiCategories } from "./data";

/**
 * 検索語に基づいて絵文字を検索する
 * @param searchTerm 検索語
 * @returns 検索結果の絵文字配列（最大30個）
 */
export function searchEmojis(searchTerm: string): string[] {
	if (!searchTerm) return [];

	const normalizedSearch = searchTerm.toLowerCase();
	const results = new Set<string>();

	for (const category of emojiCategories) {
		for (const emoji of category.emojis) {
			if (results.size >= 30) return Array.from(results); // 検索結果は最大30個まで

			// 絵文字の名前や説明を含む検索も可能にするため、
			// 将来的にはEmojiDataのような形で絵文字の詳細情報を持つことを想定
			if (emoji.includes(normalizedSearch)) {
				results.add(emoji);
			}
		}
	}

	return Array.from(results);
}

/**
 * カテゴリ名から絵文字リストを取得する
 * @param categoryName カテゴリ名
 * @returns 絵文字の配列
 */
export function getEmojisByCategory(categoryName: string): string[] {
	const category = emojiCategories.find((cat) => cat.name === categoryName);
	return category ? category.emojis : [];
}

/**
 * すべての絵文字カテゴリ名を取得する
 * @returns カテゴリ名の配列
 */
export function getAllCategories(): string[] {
	return emojiCategories.map((category) => category.name);
}

/**
 * すべての絵文字を取得する
 * @returns すべての絵文字の配列
 */
export function getAllEmojis(): string[] {
	return emojiCategories.flatMap((category) => category.emojis);
}
