/**
 * 管理画面用のServer Actions
 * @module
 */
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { AdminStatsWithGraphs } from '../../types/admin';

/**
 * 管理画面の統計情報を取得する
 */
export async function getAdminStats(): Promise<AdminStatsWithGraphs> {
  'use server';

  const supabase = await getSupabaseServerClient();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // 総ユーザー数を取得
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // 今月の新規ユーザー数を取得
  const { count: newUsersThisMonth } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', firstDayOfMonth.toISOString());

  // 先月の新規ユーザー数を取得
  const { count: newUsersLastMonth } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', lastMonth.toISOString())
    .lt('created_at', firstDayOfMonth.toISOString());

  // アクティブユーザー数を取得（最近30日間でログインしたユーザー）
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const { count: activeUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('last_sign_in_at', thirtyDaysAgo.toISOString());

  // 60日前から30日前までのアクティブユーザー数を取得（トレンド計算用）
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const { count: previousActiveUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('last_sign_in_at', sixtyDaysAgo.toISOString())
    .lt('last_sign_in_at', thirtyDaysAgo.toISOString());

  // 未対応のお問い合わせ数を取得
  const { count: pendingContacts } = await supabase
    .from('contact_chats')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // グラフ用のデータを取得（過去30日間）
  const userStats = [];
  const activityStats = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    // その日までの累計ユーザー数
    const { count: totalUsersAtDate } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .lte('created_at', endOfDay.toISOString());

    // その日のアクティブユーザー数
    const { count: activeUsersAtDate } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_sign_in_at', startOfDay.toISOString())
      .lte('last_sign_in_at', endOfDay.toISOString());

    // その日の新規ユーザー数
    const { count: newUsersAtDate } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString());

    // その日のログイン数
    const { count: loginsAtDate } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_sign_in_at', startOfDay.toISOString())
      .lte('last_sign_in_at', endOfDay.toISOString());

    // その日のお問い合わせ数
    const { count: contactsAtDate } = await supabase
      .from('contact_chats')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfDay.toISOString())
      .lte('created_at', endOfDay.toISOString());

    userStats.unshift({
      date: startOfDay.toISOString(),
      totalUsers: totalUsersAtDate ?? 0,
      activeUsers: activeUsersAtDate ?? 0,
      newUsers: newUsersAtDate ?? 0,
    });

    activityStats.unshift({
      date: startOfDay.toISOString(),
      logins: loginsAtDate ?? 0,
      registrations: newUsersAtDate ?? 0,
      contacts: contactsAtDate ?? 0,
    });
  }

  // トレンドの計算
  const newUsersTrend = newUsersLastMonth
    ? (((newUsersThisMonth ?? 0) - newUsersLastMonth) / newUsersLastMonth) * 100
    : 0;

  const activeUsersTrend = previousActiveUsers
    ? (((activeUsers ?? 0) - previousActiveUsers) / previousActiveUsers) * 100
    : 0;

  return {
    totalUsers: totalUsers ?? 0,
    newUsers: {
      count: newUsersThisMonth ?? 0,
      trend: newUsersTrend,
    },
    activeUsers: {
      count: activeUsers ?? 0,
      trend: activeUsersTrend,
    },
    pendingContacts: pendingContacts ?? 0,
    graphs: {
      userStats,
      activityStats,
    },
  };
}
