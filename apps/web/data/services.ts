/**
 * サービス関連のデータ
 * 提供サービスの情報を定義
 */

/**
 * サービス情報の型定義
 */
export interface Service {
	title: string;
	description: string;
	features: string[];
	price: string;
	technologies: string[];
}

/**
 * 提供サービス一覧
 */
export const services: Service[] = [
	{
		title: "プロダクト開発",
		description:
			"フロントエンドからバックエンド、インフラまで一貫して開発を行います。モダンな技術スタックを活用し、高品質なWebアプリケーションを提供します。",
		features: [
			"要件定義・設計",
			"フロントエンド開発",
			"バックエンド開発",
			"データベース設計",
			"インフラ構築",
			"CI/CD構築",
			"保守・運用",
		],
		price: "100万円〜/月",
		technologies: [
			"Next.js",
			"TypeScript",
			"Node.js",
			"PostgreSQL",
			"AWS",
			"Docker",
		],
	},
	{
		title: "フロントエンド開発",
		description:
			"モダンなフロントエンド技術を活用し、ユーザー体験の高いWebアプリケーションを開発します。パフォーマンスとアクセシビリティを重視した実装を行います。",
		features: [
			"UI/UX設計",
			"コンポーネント設計",
			"状態管理設計",
			"レスポンシブ対応",
			"パフォーマンス最適化",
			"アクセシビリティ対応",
			"ユニットテスト",
		],
		price: "80万円〜/月",
		technologies: [
			"React",
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"Jest",
			"Storybook",
		],
	},
	{
		title: "技術コンサルティング",
		description:
			"プロジェクトの技術選定や設計レビュー、パフォーマンス改善など、技術面での課題解決をサポートします。",
		features: [
			"技術選定支援",
			"アーキテクチャ設計",
			"コードレビュー",
			"パフォーマンス改善",
			"セキュリティ対策",
			"チーム体制構築",
			"技術研修",
		],
		price: "50万円〜/月",
		technologies: [
			"React",
			"Next.js",
			"Node.js",
			"AWS",
			"Docker",
			"GitHub Actions",
		],
	},
];
