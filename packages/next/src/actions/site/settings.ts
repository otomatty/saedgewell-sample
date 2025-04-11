'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { requireAdmin } from '../role/roles';
import type { SiteSettings, UpdateSiteSettingsInput } from '@kit/types';
import { convertToRawSiteSettings, convertToSiteSettings } from '@kit/types';

/**
 * サイト設定を取得する
 * @returns サイト設定
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await getSupabaseServerClient();

  const { data: rawSettings, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (error) {
    console.error('サイト設定の取得に失敗しました:', error);
    if (error.code === 'PGRST116') {
      console.log('初期設定を作成します...');
      return initializeSiteSettings();
    }
    return null;
  }

  return rawSettings ? convertToSiteSettings(rawSettings) : null;
}

/**
 * サイト設定を更新する
 * @param input 更新するサイト設定
 * @returns 更新後のサイト設定
 */
export async function updateSiteSettings(
  input: UpdateSiteSettingsInput
): Promise<SiteSettings | null> {
  // 管理者権限の確認
  await requireAdmin();

  const supabase = await getSupabaseServerClient();
  const rawInput = convertToRawSiteSettings(input);

  // 現在のユーザーIDを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('ユーザーが見つかりません');
  }

  // 現在の設定を確認
  const { data: currentSettings, error: getCurrentError } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (getCurrentError) {
    console.error('現在の設定の取得に失敗しました:', getCurrentError);
    throw getCurrentError;
  }

  // 更新を実行
  const { error: updateError } = await supabase
    .from('site_settings')
    .update({
      ...rawInput,
      last_modified_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentSettings.id);

  if (updateError) {
    console.error('サイト設定の更新に失敗しました:', updateError);
    throw updateError;
  }

  // 更新後の設定を取得
  const { data: rawSettings, error: getUpdatedError } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', currentSettings.id)
    .single();

  if (getUpdatedError) {
    console.error('更新後の設定の取得に失敗しました:', getUpdatedError);
    throw getUpdatedError;
  }

  // キャッシュを更新
  revalidatePath('/', 'layout');

  return rawSettings ? convertToSiteSettings(rawSettings) : null;
}

/**
 * サイト設定を初期化する
 * @returns 初期化後のサイト設定
 */
export async function initializeSiteSettings(): Promise<SiteSettings | null> {
  // 管理者権限の確認
  await requireAdmin();

  const supabase = await getSupabaseServerClient();

  // 現在のユーザーIDを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('ユーザーが見つかりません');
  }

  // 既存の設定を確認
  const { data: existingSettings } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (existingSettings) {
    console.log('サイト設定は既に初期化されています');
    return convertToSiteSettings(existingSettings);
  }

  // 新しい設定を作成
  const { data: rawSettings, error } = await supabase
    .from('site_settings')
    .insert({
      last_modified_by: user.id,
    })
    .select('*')
    .single();

  if (error) {
    console.error('サイト設定の初期化に失敗しました:', error);
    throw error;
  }

  // キャッシュを更新
  revalidatePath('/', 'layout');

  return rawSettings ? convertToSiteSettings(rawSettings) : null;
}
