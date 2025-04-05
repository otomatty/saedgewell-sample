import { describe, it, expect } from "vitest";
import {
	formatFileSize,
	formatDate,
	formatDateTime,
	formatNumber,
	formatTime,
	formatTimerDisplay,
} from "../formatters";

describe("フォーマットユーティリティ", () => {
	describe("formatFileSize", () => {
		it("0バイトを正しくフォーマットする", () => {
			// Arrange
			const bytes = 0;
			const expected = "0 B";

			// Act
			const result = formatFileSize(bytes);

			// Assert
			expect(result).toBe(expected);
		});

		it("キロバイト単位の値を正しくフォーマットする", () => {
			// Arrange
			const bytes = 1536;
			const expected = "1.5 KB";

			// Act
			const result = formatFileSize(bytes);

			// Assert
			expect(result).toBe(expected);
		});

		it("メガバイト単位の値を正しくフォーマットする", () => {
			// Arrange
			const bytes = 2097152;
			const expected = "2.0 MB";

			// Act
			const result = formatFileSize(bytes);

			// Assert
			expect(result).toBe(expected);
		});
	});

	describe("formatDate", () => {
		it("日付を日本語形式にフォーマットする", () => {
			// Arrange
			const date = "2023-03-15T00:00:00.000Z";
			const expected = "2023年03月15日";

			// Act
			const result = formatDate(date);

			// Assert
			expect(result).toBe(expected);
		});
	});

	describe("formatDateTime", () => {
		it("日付と時刻を日本語形式にフォーマットする", () => {
			// Arrange
			const date = "2023-03-15T12:30:45.000Z";
			// タイムゾーンの影響で時間が変わる可能性があるため、部分一致で検証
			const expectedPattern = /2023年03月15日 \d{2}:\d{2}:\d{2}/;

			// Act
			const result = formatDateTime(date);

			// Assert
			expect(result).toMatch(expectedPattern);
		});
	});

	describe("formatNumber", () => {
		it("数値を日本語形式にフォーマットする", () => {
			// Arrange
			const num = 1234567;
			const expected = "1,234,567";

			// Act
			const result = formatNumber(num);

			// Assert
			expect(result).toBe(expected);
		});
	});

	describe("formatTime", () => {
		it("秒数を時間形式にフォーマットする", () => {
			// Arrange
			const seconds = 3665;
			const expected = "1時間1分5秒";

			// Act
			const result = formatTime(seconds);

			// Assert
			expect(result).toBe(expected);
		});
	});

	describe("formatTimerDisplay", () => {
		it("1時間未満の秒数をMM:SS形式にフォーマットする", () => {
			// Arrange
			const seconds = 125;
			const expected = "02:05";

			// Act
			const result = formatTimerDisplay(seconds);

			// Assert
			expect(result).toBe(expected);
		});

		it("1時間以上の秒数をHH:MM:SS形式にフォーマットする", () => {
			// Arrange
			const seconds = 3665;
			const expected = "01:01:05";

			// Act
			const result = formatTimerDisplay(seconds);

			// Assert
			expect(result).toBe(expected);
		});
	});
});
