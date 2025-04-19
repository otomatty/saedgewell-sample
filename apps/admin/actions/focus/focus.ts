'use server';

import type {
  FocusSession,
  FocusInterval,
  FocusStatus,
  IntervalType,
} from '../../types/focus';
import { startOfDay, endOfDay } from 'date-fns';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { revalidatePath } from 'next/cache';
import { enhanceAction } from '@kit/next/actions/enhance-action';
import {
  SessionIdSchema,
  StartIntervalSchema,
  IntervalIdSchema,
} from './schemas';

/**
 * 新しいフォーカスセッションを開始する
 */
export const startFocusSession = enhanceAction(
  async (_, user) => {
    if (!user) throw new Error('ユーザーが認証されていません');

    const supabase = getSupabaseServerClient();
    const { data: session, error } = await supabase
      .from('focus_sessions')
      .insert({
        user_id: user.id,
        started_at: new Date().toISOString(),
        status: 'in_progress' as const,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      throw new Error('セッションの作成に失敗しました');
    }
    if (!session) throw new Error('セッションの作成に失敗しました');

    revalidatePath('/admin/focus');
    return session as FocusSession;
  },
  {
    auth: true,
  }
);

/**
 * フォーカスセッションを終了する
 */
export const endFocusSession = enhanceAction(
  async (data, user) => {
    if (!user) throw new Error('ユーザーが認証されていません');

    const supabase = getSupabaseServerClient();

    // セッションの所有者を確認
    const { data: existingSession } = await supabase
      .from('focus_sessions')
      .select('user_id')
      .eq('id', data.sessionId)
      .single();

    if (!existingSession) throw new Error('セッションが見つかりません');
    if (existingSession.user_id !== user.id)
      throw new Error('許可されていないユーザーです');

    const { data: session, error } = await supabase
      .from('focus_sessions')
      .update({
        ended_at: new Date().toISOString(),
        status: 'completed' as const,
      })
      .eq('id', data.sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating session:', error);
      throw new Error('セッションの更新に失敗しました');
    }
    if (!session) throw new Error('セッションの更新に失敗しました');

    revalidatePath('/admin/focus');
    return session as FocusSession;
  },
  {
    auth: true,
    schema: SessionIdSchema,
  }
);

/**
 * 新しいインターバルを開始する
 */
export const startInterval = enhanceAction(
  async (data, user) => {
    if (!user) throw new Error('ユーザーが認証されていません');

    const supabase = getSupabaseServerClient();

    // セッションの所有者を確認
    const { data: existingSession } = await supabase
      .from('focus_sessions')
      .select('user_id')
      .eq('id', data.sessionId)
      .single();

    if (!existingSession) throw new Error('セッションが見つかりません');
    if (existingSession.user_id !== user.id)
      throw new Error('許可されていないユーザーです');

    const { data: interval, error } = await supabase
      .from('focus_intervals')
      .insert({
        session_id: data.sessionId,
        interval_type: data.intervalType,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating interval:', error);
      throw new Error('インターバルの作成に失敗しました');
    }
    if (!interval) throw new Error('インターバルの作成に失敗しました');

    revalidatePath('/admin/focus');
    return interval as FocusInterval;
  },
  {
    auth: true,
    schema: StartIntervalSchema,
  }
);

/**
 * インターバルを終了する
 */
export const endInterval = enhanceAction(
  async (data, user) => {
    if (!user) throw new Error('ユーザーが認証されていません');

    const supabase = getSupabaseServerClient();

    // インターバルの所有者を確認
    const { data: existingInterval } = await supabase
      .from('focus_intervals')
      .select('focus_sessions!inner(user_id)')
      .eq('id', data.intervalId)
      .single();

    if (!existingInterval) throw new Error('インターバルが見つかりません');
    if (existingInterval.focus_sessions.user_id !== user.id)
      throw new Error('許可されていないユーザーです');

    const { data: interval, error } = await supabase
      .from('focus_intervals')
      .update({
        ended_at: new Date().toISOString(),
      })
      .eq('id', data.intervalId)
      .select()
      .single();

    if (error) {
      console.error('Error updating interval:', error);
      throw new Error('インターバルの更新に失敗しました');
    }
    if (!interval) throw new Error('インターバルの更新に失敗しました');

    revalidatePath('/admin/focus');
    return interval as FocusInterval;
  },
  {
    auth: true,
    schema: IntervalIdSchema,
  }
);

/**
 * 今日のフォーカスセッションを取得する
 */
export const getTodaysFocusSessions = enhanceAction(
  async (_, user) => {
    if (!user) throw new Error('ユーザーが認証されていません');

    const supabase = getSupabaseServerClient();
    const today = new Date();
    const { data: sessions, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user.id)
      .gte('started_at', startOfDay(today).toISOString())
      .lte('started_at', endOfDay(today).toISOString())
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      throw new Error('今日のフォーカスセッションの取得に失敗しました');
    }
    return (sessions || []) as FocusSession[];
  },
  {
    auth: true,
  }
);
