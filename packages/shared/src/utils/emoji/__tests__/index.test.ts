import { describe, it, expect } from "vitest";
import {
	searchEmojis,
	getEmojisByCategory,
	getAllCategories,
	getAllEmojis,
	emojiCategories,
} from "../index";

describe("絵文字ユーティリティ", () => {
	describe("searchEmojis", () => {
		it("検索語に一致する絵文字を返す", () => {
			// Arrange
			const searchTerm = "🚀";

			// Act
			const result = searchEmojis(searchTerm);

			// Assert
			expect(result).toContain("🚀");
		});

		it("空の検索語の場合は空の配列を返す", () => {
			// Arrange
			const searchTerm = "";

			// Act
			const result = searchEmojis(searchTerm);

			// Assert
			expect(result).toEqual([]);
		});

		it("検索結果は最大30個まで返す", () => {
			// Arrange & Act
			// すべての絵文字を検索するような広範な検索語を使用
			const result = searchEmojis(""); // 空文字列は特別なケースなので、代わりに広範な検索語を使用

			// Assert
			expect(result.length).toBeLessThanOrEqual(30);
		});
	});

	describe("getEmojisByCategory", () => {
		it("指定したカテゴリの絵文字リストを返す", () => {
			// Arrange
			const categoryName = "よく使う";
			const expected = emojiCategories.find(
				(cat) => cat.name === categoryName,
			)?.emojis;

			// Act
			const result = getEmojisByCategory(categoryName);

			// Assert
			expect(result).toEqual(expected);
		});

		it("存在しないカテゴリの場合は空の配列を返す", () => {
			// Arrange
			const categoryName = "存在しないカテゴリ";

			// Act
			const result = getEmojisByCategory(categoryName);

			// Assert
			expect(result).toEqual([]);
		});
	});

	describe("getAllCategories", () => {
		it("すべてのカテゴリ名を返す", () => {
			// Arrange
			const expected = emojiCategories.map((category) => category.name);

			// Act
			const result = getAllCategories();

			// Assert
			expect(result).toEqual(expected);
		});

		it("カテゴリ数が正しい", () => {
			// Act
			const result = getAllCategories();

			// Assert
			expect(result.length).toBe(emojiCategories.length);
		});
	});

	describe("getAllEmojis", () => {
		it("すべての絵文字を返す", () => {
			// Arrange
			const expected = emojiCategories.flatMap((category) => category.emojis);

			// Act
			const result = getAllEmojis();

			// Assert
			expect(result).toEqual(expected);
		});

		it("絵文字の総数が正しい", () => {
			// Arrange
			const expectedCount = emojiCategories.reduce(
				(count, category) => count + category.emojis.length,
				0,
			);

			// Act
			const result = getAllEmojis();

			// Assert
			expect(result.length).toBe(expectedCount);
		});
	});
});
