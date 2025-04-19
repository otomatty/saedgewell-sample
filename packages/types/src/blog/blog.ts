export interface BlogCategory {
	id: string;
	created_at: string | null;
	name: string;
}

export interface BlogPost {
	id: string;
	created_at: string | null;
	updated_at: string | null;
	published_at: string | null; // published_at を追加
	title: string;
	slug: string;
	content: string;
	description: string;
	estimated_reading_time: number;
	status: "draft" | "published";
	thumbnail_url?: string | null;
	blog_posts_categories: {
		blog_categories: {
			id: string;
			created_at: string; // created_at を追加
			name: string;
		};
	}[];
}
