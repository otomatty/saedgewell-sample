import { describe, it, expect } from "vitest";
import {
	handleSupabaseError,
	handleUnknownError,
	handleError,
} from "../handlers";
import type { PostgrestError } from "@supabase/supabase-js";

describe("エラーハンドリングユーティリティ", () => {
	describe("handleSupabaseError", () => {
		it("NOT_FOUNDエラーを正しく変換する", () => {
			// Arrange
			const error = {
				code: "PGRST116",
				message: "リソースが見つかりません",
				details: "",
				hint: "",
				name: "PostgrestError",
			} as PostgrestError;

			// Act
			const result = handleSupabaseError(error);

			// Assert
			expect(result).toEqual({
				code: "NOT_FOUND",
				message: "リソースが見つかりません",
				status: 404,
				cause: error,
			});
		});

		it("FORBIDDENエラーを正しく変換する", () => {
			// Arrange
			const error = {
				code: "42501",
				message: "アクセス権限がありません",
				details: "",
				hint: "",
				name: "PostgrestError",
			} as PostgrestError;

			// Act
			const result = handleSupabaseError(error);

			// Assert
			expect(result).toEqual({
				code: "FORBIDDEN",
				message: "アクセス権限がありません",
				status: 403,
				cause: error,
			});
		});

		it("VALIDATION_ERRORエラーを正しく変換する", () => {
			// Arrange
			const error = {
				code: "23505",
				message: "一意制約違反",
				details: "",
				hint: "",
				name: "PostgrestError",
			} as PostgrestError;

			// Act
			const result = handleSupabaseError(error);

			// Assert
			expect(result).toEqual({
				code: "VALIDATION_ERROR",
				message: "一意制約違反",
				status: 400,
				cause: error,
			});
		});

		it("その他のエラーをDATABASE_ERRORとして変換する", () => {
			// Arrange
			const error = {
				code: "OTHER_ERROR",
				message: "データベースエラー",
				details: "",
				hint: "",
				name: "PostgrestError",
			} as PostgrestError;

			// Act
			const result = handleSupabaseError(error);

			// Assert
			expect(result).toEqual({
				code: "DATABASE_ERROR",
				message: "データベースエラー",
				status: 500,
				cause: error,
			});
		});
	});

	describe("handleUnknownError", () => {
		it("Errorインスタンスを正しく変換する", () => {
			// Arrange
			const error = new Error("未知のエラー");

			// Act
			const result = handleUnknownError(error);

			// Assert
			expect(result).toEqual({
				code: "INTERNAL_ERROR",
				message: "未知のエラー",
				status: 500,
				cause: error,
			});
		});

		it("Errorインスタンス以外のエラーを正しく変換する", () => {
			// Arrange
			const error = "エラー文字列";

			// Act
			const result = handleUnknownError(error);

			// Assert
			expect(result).toEqual({
				code: "INTERNAL_ERROR",
				message: "予期せぬエラーが発生しました",
				status: 500,
				cause: error,
			});
		});
	});

	describe("handleError", () => {
		it("PostgrestErrorを正しく処理する", () => {
			// Arrange
			const error = {
				code: "PGRST116",
				message: "リソースが見つかりません",
				details: "",
				hint: "",
				name: "PostgrestError",
			} as PostgrestError;

			// Act
			const result = handleError(error);

			// Assert
			expect(result).toEqual({
				code: "NOT_FOUND",
				message: "リソースが見つかりません",
				status: 404,
				cause: error,
			});
		});

		it("その他のエラーを正しく処理する", () => {
			// Arrange
			const error = new Error("その他のエラー");

			// Act
			const result = handleError(error);

			// Assert
			expect(result).toEqual({
				code: "INTERNAL_ERROR",
				message: "その他のエラー",
				status: 500,
				cause: error,
			});
		});
	});
});
