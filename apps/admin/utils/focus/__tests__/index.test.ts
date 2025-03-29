import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	calculateTotalFocusTime,
	calculateSessionDuration,
	calculateTodaysFocusTime,
} from "../index";
import type { FocusSession, FocusStatus } from "../../../../types/src/focus";

describe("フォーカスユーティリティ", () => {
	// テスト用のモックデータ
	const mockSessions: FocusSession[] = [
		{
			id: "1",
			user_id: "user1",
			started_at: "2023-03-15T10:00:00.000Z",
			ended_at: "2023-03-15T11:00:00.000Z",
			status: "completed" as FocusStatus,
			created_at: "2023-03-15T10:00:00.000Z",
			updated_at: null,
		},
		{
			id: "2",
			user_id: "user1",
			started_at: "2023-03-15T13:00:00.000Z",
			ended_at: "2023-03-15T14:30:00.000Z",
			status: "completed" as FocusStatus,
			created_at: "2023-03-15T13:00:00.000Z",
			updated_at: null,
		},
		{
			id: "3",
			user_id: "user1",
			started_at: "2023-03-16T09:00:00.000Z",
			ended_at: "2023-03-16T10:30:00.000Z",
			status: "completed" as FocusStatus,
			created_at: "2023-03-16T09:00:00.000Z",
			updated_at: null,
		},
	];

	describe("calculateTotalFocusTime", () => {
		it("複数のセッションの合計フォーカス時間を正しく計算する", () => {
			// Arrange
			const expected = 4 * 60 * 60; // 4時間 = 14400秒

			// Act
			const result = calculateTotalFocusTime(mockSessions);

			// Assert
			expect(result).toBe(expected);
		});

		it("空のセッション配列の場合は0を返す", () => {
			// Arrange
			const emptySessions: FocusSession[] = [];
			const expected = 0;

			// Act
			const result = calculateTotalFocusTime(emptySessions);

			// Assert
			expect(result).toBe(expected);
		});
	});

	describe("calculateSessionDuration", () => {
		it("終了時間がある場合、セッションの経過時間を正しく計算する", () => {
			// Arrange
			const session = mockSessions[0];
			const expected = 60 * 60; // 1時間 = 3600秒

			// Act
			const result = calculateSessionDuration(session);

			// Assert
			expect(result).toBe(expected);
		});

		it("終了時間がない場合、現在時刻までの経過時間を計算する", () => {
			// Arrange
			const now = new Date();
			const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

			const session: FocusSession = {
				id: "4",
				user_id: "user1",
				started_at: tenMinutesAgo.toISOString(),
				ended_at: null,
				status: "in_progress" as FocusStatus,
				created_at: tenMinutesAgo.toISOString(),
				updated_at: null,
			};

			// Act
			const result = calculateSessionDuration(session);

			// Assert - 約10分（600秒）経過しているはずだが、テスト実行時間によって多少のずれがあるため、範囲で確認
			expect(result).toBeGreaterThanOrEqual(590);
			expect(result).toBeLessThanOrEqual(610);
		});
	});

	describe("calculateTodaysFocusTime", () => {
		it("今日のセッションのみの合計時間を計算する", () => {
			// Arrange
			// 現在の日付を基準にモックデータを作成
			const today = new Date();
			const todayStr = today.toISOString().split("T")[0];

			const todaySessions: FocusSession[] = [
				{
					id: "5",
					user_id: "user1",
					started_at: `${todayStr}T08:00:00.000Z`,
					ended_at: `${todayStr}T09:00:00.000Z`,
					status: "completed" as FocusStatus,
					created_at: `${todayStr}T08:00:00.000Z`,
					updated_at: null,
				},
				{
					id: "6",
					user_id: "user1",
					started_at: `${todayStr}T10:00:00.000Z`,
					ended_at: `${todayStr}T11:30:00.000Z`,
					status: "completed" as FocusStatus,
					created_at: `${todayStr}T10:00:00.000Z`,
					updated_at: null,
				},
			];

			const expected = 2.5 * 60 * 60; // 2.5時間 = 9000秒

			// Act
			const result = calculateTodaysFocusTime(todaySessions);

			// Assert
			expect(result).toBe(expected);
		});

		it("今日のセッションがない場合は0を返す", () => {
			// Arrange - 過去のセッションのみ
			const pastSessions = mockSessions;
			const expected = 0;

			// 現在の日付を2023-03-20に設定
			const mockDate = new Date("2023-03-20");
			const originalDateNow = Date.now;
			Date.now = vi.fn(() => mockDate.getTime());

			// Act
			const result = calculateTodaysFocusTime(pastSessions);

			// Assert
			expect(result).toBe(expected);

			// モックをリセット
			Date.now = originalDateNow;
		});
	});
});
