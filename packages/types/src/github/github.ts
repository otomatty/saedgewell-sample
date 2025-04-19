export interface GitHubContribution {
	id: string;
	userId: string;
	contributionDate: Date;
	contributionCount: number;
	linesAdded: number;
	linesDeleted: number;
	commitCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface GitHubSettings {
	id: string;
	userId: string | null;
	username: string;
	accessToken: string;
	autoSync: boolean | null;
	lastSyncedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface CommitStats {
	additions: number;
	deletions: number;
	total: number;
}

/**
 * GitHubのコントリビューション情報を表す型
 */
export interface ContributionDay {
	/** コントリビューションの日付 */
	date: string;
	/** コントリビューション数 */
	count: number;
	/** コントリビューションレベル (0-4) */
	level: 0 | 1 | 2 | 3 | 4;
	/** コントリビューションの色 */
	color: string;
}
