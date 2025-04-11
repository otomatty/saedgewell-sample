import { describe, it, expect } from "vitest";
import {
	truncate,
	isValidUrl,
	isValidEmail,
	escapeHtml,
	slugify,
} from "../manipulators";

describe("文字列操作ユーティリティ", () => {
	describe("truncate", () => {
		it("指定された長さで文字列を切り詰める", () => {
			// Arrange
			const input = "Hello World";
			const maxLength = 8;
			const expected = "Hello...";

			// Act
			const result = truncate(input, maxLength);

			// Assert
			expect(result).toBe(expected);
		});

		it("文字列が最大長より短い場合は元の文字列を返す", () => {
			// Arrange
			const input = "Hello";
			const maxLength = 10;
			const expected = "Hello";

			// Act
			const result = truncate(input, maxLength);

			// Assert
			expect(result).toBe(expected);
		});

		it("カスタムの省略記号を使用できる", () => {
			// Arrange
			const input = "Hello World";
			const maxLength = 7;
			const suffix = "…";
			const expected = "Hello …";

			// Act
			const result = truncate(input, maxLength, suffix);

			// Assert
			expect(result).toBe(expected);
		});
	});

	describe("isValidUrl", () => {
		it("有効なURLを正しく検証する", () => {
			// Arrange
			const validUrls = [
				"https://example.com",
				"http://localhost:3000",
				"https://sub.domain.co.jp/path?query=value",
			];

			// Act & Assert
			for (const url of validUrls) {
				expect(isValidUrl(url)).toBe(true);
			}
		});

		it("無効なURLを正しく検証する", () => {
			// Arrange
			const invalidUrls = [
				"ftp://example.com", // HTTPとHTTPS以外のプロトコル
				"just a string",
				"",
			];

			// Act & Assert
			for (const url of invalidUrls) {
				expect(isValidUrl(url)).toBe(false);
			}
		});
	});

	describe("isValidEmail", () => {
		it("有効なメールアドレスを正しく検証する", () => {
			// Arrange
			const validEmails = [
				"test@example.com",
				"user.name@domain.co.jp",
				"user+tag@example.com",
			];

			// Act & Assert
			for (const email of validEmails) {
				expect(isValidEmail(email)).toBe(true);
			}
		});

		it("無効なメールアドレスを正しく検証する", () => {
			// Arrange
			const invalidEmails = [
				"test@example",
				"user@.com",
				"@domain.com",
				"user@domain.",
				"just a string",
				"",
			];

			// Act & Assert
			for (const email of invalidEmails) {
				expect(isValidEmail(email)).toBe(false);
			}
		});
	});

	describe("escapeHtml", () => {
		it("HTMLの特殊文字をエスケープする", () => {
			// Arrange
			const html = '<div class="container">Hello & "World"</div>';
			const expected =
				"&lt;div class=&quot;container&quot;&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;";

			// Act
			const result = escapeHtml(html);

			// Assert
			expect(result).toBe(expected);
		});

		it("特殊文字がない場合はそのまま返す", () => {
			// Arrange
			const input = "Hello World";
			const expected = "Hello World";

			// Act
			const result = escapeHtml(input);

			// Assert
			expect(result).toBe(expected);
		});
	});

	describe("slugify", () => {
		it("文字列をスラッグ形式に変換する", () => {
			// Arrange
			const input = "Hello World";
			const expected = "hello-world";

			// Act
			const result = slugify(input);

			// Assert
			expect(result).toBe(expected);
		});

		it("特殊文字を含む文字列をスラッグ形式に変換する", () => {
			// Arrange
			const input = "Hello! @World#";
			const expected = "hello-world";

			// Act
			const result = slugify(input);

			// Assert
			expect(result).toBe(expected);
		});

		it("空文字列の場合は空文字列を返す", () => {
			// Arrange
			const input = "";
			const expected = "";

			// Act
			const result = slugify(input);

			// Assert
			expect(result).toBe(expected);
		});
	});
});
