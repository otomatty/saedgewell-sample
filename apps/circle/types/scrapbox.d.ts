export interface ScrapboxPage {
	id: string;
	title: string;
	image: string | null;
	descriptions: string[];
	user: {
		id: string;
	};
	pin: number;
	views: number;
	linked: number;
	commitId: string;
	created: number;
	updated: number;
	accessed: number;
	lastAccessed?: number;
	snapshotCreated: number | null;
	pageRank: number;
}

export interface ProjectResponse {
	projectName: string;
	skip: number;
	limit: number;
	count: number;
	pages: ScrapboxPage[];
}

export interface ScrapboxApiConfig {
	baseUrl?: string;
	cookie?: string;
}
