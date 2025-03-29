import { describe, test, expect, beforeEach } from "vitest";
import {
	formatDateToYYYYMMDD,
	formatDateToJapanese,
	getDateBefore,
	getDateAfter,
	getDaysBetween,
	isWeekend,
} from "../formatters";

describe("日付操作ユーティリティ", () => {
	let testDate: Date;

	beforeEach(() => {
		// 2023年3月15日（水曜日）を基準日として使用
		testDate = new Date(2023, 2, 15); // 月は0から始まるため、3月は2
	});

	describe("formatDateToYYYYMMDD", () => {
		test("日付をYYYY-MM-DD形式に変換する", () => {
			// Arrange
			// Act
			const result = formatDateToYYYYMMDD(testDate);
			// Assert
			expect(result).toBe("2023-03-15");
		});
	});

	describe("formatDateToJapanese", () => {
		test("日付をYYYY年MM月DD日形式に変換する", () => {
			// Arrange
			// Act
			const result = formatDateToJapanese(testDate);
			// Assert
			expect(result).toBe("2023年3月15日");
		});
	});

	describe("getDateBefore", () => {
		test("指定した日数前の日付を取得する", () => {
			// Arrange
			const originalDate = new Date();
			const days = 5;
			// Act
			const result = getDateBefore(days);
			// Assert
			const expectedDate = new Date(originalDate);
			expectedDate.setDate(expectedDate.getDate() - days);
			expect(result.getDate()).toBe(expectedDate.getDate());
			expect(result.getMonth()).toBe(expectedDate.getMonth());
			expect(result.getFullYear()).toBe(expectedDate.getFullYear());
		});
	});

	describe("getDateAfter", () => {
		test("指定した日数後の日付を取得する", () => {
			// Arrange
			const originalDate = new Date();
			const days = 5;
			// Act
			const result = getDateAfter(days);
			// Assert
			const expectedDate = new Date(originalDate);
			expectedDate.setDate(expectedDate.getDate() + days);
			expect(result.getDate()).toBe(expectedDate.getDate());
			expect(result.getMonth()).toBe(expectedDate.getMonth());
			expect(result.getFullYear()).toBe(expectedDate.getFullYear());
		});
	});

	describe("getDaysBetween", () => {
		test("2つの日付の間の日数を計算する", () => {
			// Arrange
			const date1 = new Date(2023, 2, 15); // 2023年3月15日
			const date2 = new Date(2023, 2, 20); // 2023年3月20日
			// Act
			const result = getDaysBetween(date1, date2);
			// Assert
			expect(result).toBe(5);
		});

		test("日付の順序が逆でも正しい日数を計算する", () => {
			// Arrange
			const date1 = new Date(2023, 2, 20); // 2023年3月20日
			const date2 = new Date(2023, 2, 15); // 2023年3月15日
			// Act
			const result = getDaysBetween(date1, date2);
			// Assert
			expect(result).toBe(5);
		});
	});

	describe("isWeekend", () => {
		test("土曜日は週末と判定される", () => {
			// Arrange
			const saturday = new Date(2023, 2, 18); // 2023年3月18日（土曜日）
			// Act
			const result = isWeekend(saturday);
			// Assert
			expect(result).toBe(true);
		});

		test("日曜日は週末と判定される", () => {
			// Arrange
			const sunday = new Date(2023, 2, 19); // 2023年3月19日（日曜日）
			// Act
			const result = isWeekend(sunday);
			// Assert
			expect(result).toBe(true);
		});

		test("平日は週末と判定されない", () => {
			// Arrange
			const wednesday = new Date(2023, 2, 15); // 2023年3月15日（水曜日）
			// Act
			const result = isWeekend(wednesday);
			// Assert
			expect(result).toBe(false);
		});
	});
});
