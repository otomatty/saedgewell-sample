import { z } from 'zod';

/**
 * セッションIDスキーマ
 */
export const SessionIdSchema = z.object({
  sessionId: z.string().uuid(),
});

/**
 * インターバル開始スキーマ
 */
export const StartIntervalSchema = z.object({
  sessionId: z.string().uuid(),
  intervalType: z.enum(['focus', 'break', 'long_break']),
});

/**
 * インターバルIDスキーマ
 */
export const IntervalIdSchema = z.object({
  intervalId: z.string().uuid(),
});
