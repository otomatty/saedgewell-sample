import { describe, test, expect } from "vitest";
import { camelToSnake, snakeToCamel } from "../converters";

describe("ケース変換ユーティリティ", () => {
	describe("snakeToCamel", () => {
		test("スネークケースのオブジェクトをキャメルケースに変換する", () => {
			// Arrange
			const snakeCaseObj = {
				user_id: 1,
				user_name: "John",
				created_at: "2023-03-15",
			};
			// Act
			const result = snakeToCamel(snakeCaseObj);
			// Assert
			expect(result).toEqual({
				userId: 1,
				userName: "John",
				createdAt: "2023-03-15",
			});
		});

		test("ネストされたオブジェクトも変換する", () => {
			// Arrange
			const snakeCaseObj = {
				user_id: 1,
				user_profile: {
					first_name: "John",
					last_name: "Doe",
					address_info: {
						postal_code: "123-4567",
						street_name: "Main St",
					},
				},
			};
			// Act
			const result = snakeToCamel(snakeCaseObj);
			// Assert
			expect(result).toEqual({
				userId: 1,
				userProfile: {
					firstName: "John",
					lastName: "Doe",
					addressInfo: {
						postalCode: "123-4567",
						streetName: "Main St",
					},
				},
			});
		});

		test("配列内のオブジェクトも変換する", () => {
			// Arrange
			const snakeCaseArray = [
				{ user_id: 1, user_name: "John" },
				{ user_id: 2, user_name: "Jane" },
			];
			// Act
			const result = snakeToCamel(snakeCaseArray);
			// Assert
			expect(result).toEqual([
				{ userId: 1, userName: "John" },
				{ userId: 2, userName: "Jane" },
			]);
		});
	});

	describe("camelToSnake", () => {
		test("キャメルケースのオブジェクトをスネークケースに変換する", () => {
			// Arrange
			const camelCaseObj = {
				userId: 1,
				userName: "John",
				createdAt: "2023-03-15",
			};
			// Act
			const result = camelToSnake(camelCaseObj);
			// Assert
			expect(result).toEqual({
				user_id: 1,
				user_name: "John",
				created_at: "2023-03-15",
			});
		});

		test("ネストされたオブジェクトも変換する", () => {
			// Arrange
			const camelCaseObj = {
				userId: 1,
				userProfile: {
					firstName: "John",
					lastName: "Doe",
					addressInfo: {
						postalCode: "123-4567",
						streetName: "Main St",
					},
				},
			};
			// Act
			const result = camelToSnake(camelCaseObj);
			// Assert
			expect(result).toEqual({
				user_id: 1,
				user_profile: {
					first_name: "John",
					last_name: "Doe",
					address_info: {
						postal_code: "123-4567",
						street_name: "Main St",
					},
				},
			});
		});

		test("配列内のオブジェクトも変換する", () => {
			// Arrange
			const camelCaseArray = [
				{ userId: 1, userName: "John" },
				{ userId: 2, userName: "Jane" },
			];
			// Act
			const result = camelToSnake(camelCaseArray);
			// Assert
			expect(result).toEqual([
				{ user_id: 1, user_name: "John" },
				{ user_id: 2, user_name: "Jane" },
			]);
		});
	});
});
