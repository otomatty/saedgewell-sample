/**
 * Scrapboxの型定義をエクスポートするラッパーファイル
 * scrapbox.d.tsからの型定義を再エクスポートします
 */

// scrapbox.d.tsからの型定義をインポート
import type {
	ScrapboxPage,
	ProjectResponse,
	ScrapboxApiConfig,
} from "./scrapbox";

// 型定義をエクスポート
export type { ScrapboxPage, ProjectResponse, ScrapboxApiConfig };

// Scrapbox関連の追加型定義
export interface ScrapboxPageWithContent extends ScrapboxPage {
	content: string;
	lines: Array<{
		id: string;
		text: string;
		created: number;
		updated: number;
	}>;
}

export interface ScrapboxProjectWithPages extends ProjectResponse {
	// ProjectResponseにはすでにpagesが含まれているため、追加の定義は不要
}

// ヘルパー関数の型
export type ScrapboxHelperTypes = {
	ScrapboxPage: ScrapboxPage;
	ProjectResponse: ProjectResponse;
	ScrapboxApiConfig: ScrapboxApiConfig;
	ScrapboxPageWithContent: ScrapboxPageWithContent;
	ScrapboxProjectWithPages: ScrapboxProjectWithPages;
};
