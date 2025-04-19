import { atom } from 'jotai';
import type { SiteSettings } from '../types/site-settings';

/**
 * サイト設定のグローバルステート
 */
export const siteSettingsAtom = atom<SiteSettings | null>(null);

/**
 * メンテナンスモードの状態
 * - メンテナンスモードが有効かつ管理者でない場合にtrue
 */
export const isMaintenanceModeAtom = atom((get) => {
  const settings = get(siteSettingsAtom);
  return settings?.maintenanceMode ?? false;
});

/**
 * 開発中バナーの表示状態
 */
export const isDevelopmentBannerVisibleAtom = atom((get) => {
  const settings = get(siteSettingsAtom);
  return settings?.isDevelopmentBannerEnabled ?? true;
});

/**
 * 機能の有効状態
 */
export const featureEnabledAtom = atom((get) => {
  const settings = get(siteSettingsAtom);
  return {
    blog: settings?.enableBlog ?? true,
    works: settings?.enableWorks ?? true,
    contact: settings?.enableContact ?? true,
    estimate: settings?.enableEstimate ?? true,
  };
});
