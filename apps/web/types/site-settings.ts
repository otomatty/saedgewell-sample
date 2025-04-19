import type { Database } from "./supabase";
import type { Json } from "./supabase";
/**
 * サイトの状態を表す型
 */
export type SiteStatus = Database["public"]["Enums"]["site_status"];

/**
 * SNSリンク情報の型
 */
export interface SocialLinks {
	github?: string | null;
	twitter?: string | null;
	linkedin?: string | null;
}

/**
 * サイト設定の型
 */
export interface SiteSettings {
	// 基本設定
	id: string;
	siteStatus: SiteStatus;
	maintenanceMode: boolean;
	isDevelopmentBannerEnabled: boolean;

	// SEO設定
	siteName: string;
	siteDescription: string;
	siteKeywords: string[];
	ogImageUrl: string | null;
	faviconUrl: string | null;
	robotsTxtContent: string | null;

	// 機能設定
	enableBlog: boolean;
	enableWorks: boolean;
	enableContact: boolean;
	enableEstimate: boolean;

	// SNS設定
	socialLinks: SocialLinks;

	// システム情報
	createdAt: Date;
	updatedAt: Date;
	lastModifiedBy: string | null;
}

/**
 * データベースから取得した生のサイト設定の型
 */
export type RawSiteSettings =
	Database["public"]["Tables"]["site_settings"]["Row"];

/**
 * サイト設定の更新用の型
 */
export type UpdateSiteSettingsInput = Partial<
	Omit<SiteSettings, "id" | "createdAt" | "updatedAt">
>;

/**
 * データベースの生の型からフロントエンド用の型に変換する関数
 */
export function convertToSiteSettings(raw: RawSiteSettings): SiteSettings {
	return {
		id: raw.id,
		siteStatus: raw.site_status,
		maintenanceMode: raw.maintenance_mode,
		isDevelopmentBannerEnabled: raw.is_development_banner_enabled,
		siteName: raw.site_name,
		siteDescription: raw.site_description,
		siteKeywords: raw.site_keywords,
		ogImageUrl: raw.og_image_url,
		faviconUrl: raw.favicon_url,
		robotsTxtContent: raw.robots_txt_content,
		enableBlog: raw.enable_blog,
		enableWorks: raw.enable_works,
		enableContact: raw.enable_contact,
		enableEstimate: raw.enable_estimate,
		socialLinks: raw.social_links as SocialLinks,
		createdAt: new Date(raw.created_at),
		updatedAt: new Date(raw.updated_at),
		lastModifiedBy: raw.last_modified_by,
	};
}

/**
 * フロントエンド用の型からデータベース用の型に変換する関数
 */
export function convertToRawSiteSettings(
	input: UpdateSiteSettingsInput,
): Partial<RawSiteSettings> {
	const output: Partial<RawSiteSettings> = {};

	if (input.siteStatus !== undefined) output.site_status = input.siteStatus;
	if (input.maintenanceMode !== undefined)
		output.maintenance_mode = input.maintenanceMode;
	if (input.isDevelopmentBannerEnabled !== undefined)
		output.is_development_banner_enabled = input.isDevelopmentBannerEnabled;
	if (input.siteName !== undefined) output.site_name = input.siteName;
	if (input.siteDescription !== undefined)
		output.site_description = input.siteDescription;
	if (input.siteKeywords !== undefined)
		output.site_keywords = input.siteKeywords;
	if (input.ogImageUrl !== undefined) output.og_image_url = input.ogImageUrl;
	if (input.faviconUrl !== undefined) output.favicon_url = input.faviconUrl;
	if (input.robotsTxtContent !== undefined)
		output.robots_txt_content = input.robotsTxtContent;
	if (input.enableBlog !== undefined) output.enable_blog = input.enableBlog;
	if (input.enableWorks !== undefined) output.enable_works = input.enableWorks;
	if (input.enableContact !== undefined)
		output.enable_contact = input.enableContact;
	if (input.enableEstimate !== undefined)
		output.enable_estimate = input.enableEstimate;
	if (input.socialLinks !== undefined)
		output.social_links = input.socialLinks as Json;
	if (input.lastModifiedBy !== undefined)
		output.last_modified_by = input.lastModifiedBy;

	return output;
}
