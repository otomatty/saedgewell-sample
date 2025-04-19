export type MetricType =
	| "development_experience"
	| "project_count"
	| "article_count"
	| "personal_project_count";

export interface Metric {
	id: string;
	type: MetricType;
	value: number;
	unit: string;
	display_name: string;
	description?: string;
	icon: string;
	href: string;
	cta: string;
	sort_order: number;
	created_at: string;
	updated_at: string;
}
