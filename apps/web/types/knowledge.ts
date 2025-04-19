// types/knowledge.ts

export interface Line {
	content: string;
	style: string;
}

export interface KnowledgeProject {
	id: string;
	projectName: string;
	totalPages: number;
	lastSyncedAt: Date;
	scrapboxCookie?: string;
	autoSyncEnabled: boolean;
	isPrivate: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface KnowledgePage {
	id: string;
	projectId: string;
	scrapboxId: string;
	title: string;
	imageUrl?: string;
	descriptions: string[];
	pinStatus: number;
	views: number;
	linkedCount: number;
	commitId?: string;
	pageRank: number;
	persistent: boolean;
	createdAt: Date;
	updatedAt: Date;
	accessedAt?: Date;
	lastAccessedAt?: Date;
	snapshotCreatedAt?: Date;
	snapshotCount: number;
}

export interface KnowledgePageDetail {
	id: string;
	pageId: string;
	lines: Line[];
	icons: string[];
	files: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface KnowledgeUser {
	id: string;
	scrapboxId: string;
	name: string;
	displayName: string;
	photoUrl?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface KnowledgePageCollaborator {
	id: string;
	pageId: string;
	userId: string;
	isLastEditor: boolean;
	createdAt: Date;
}

export interface KnowledgePageLink {
	id: string;
	sourcePageId: string;
	targetPageId: string;
	hopLevel: number;
	createdAt: Date;
}

export interface KnowledgeSyncLog {
	id: string;
	projectId: string;
	syncStartedAt: Date;
	syncCompletedAt?: Date;
	status: string;
	errorMessage?: string;
	pagesProcessed: number;
	pagesUpdated: number;
	createdAt: Date;
}
