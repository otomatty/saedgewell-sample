/**
 * コンタクト関連のデータ
 * カテゴリーやFAQなどの情報を提供
 */
import type { ContactTypes } from "@saedgewell/types";

/**
 * 問い合わせカテゴリー一覧
 */
export const CATEGORIES: ContactTypes.Category[] = [
	{
		id: "1",
		name: "仕事の依頼",
		description: "お仕事のご依頼やご相談について",
		icon: "Briefcase",
		created_at: null,
	},
	{
		id: "2",
		name: "技術的な質問",
		description: "技術的な質問や相談について",
		icon: "Code2",
		created_at: null,
	},
	{
		id: "3",
		name: "その他",
		description: "その他のお問い合わせ",
		icon: "MessageCircle",
		created_at: null,
	},
];

/**
 * よくある質問一覧
 */
export const FAQS: ContactTypes.Faq[] = [
	{
		id: "1",
		category_id: "1",
		question: "依頼可能な業務の範囲を教えてください",
		answer:
			"Webアプリケーション開発、フロントエンド開発、バックエンド開発など、幅広い業務に対応可能です。",
		created_at: null,
	},
	{
		id: "2",
		category_id: "1",
		question: "料金体系について教えてください",
		answer: "案件の規模や内容によって異なりますので、まずはご相談ください。",
		created_at: null,
	},
	{
		id: "3",
		category_id: "2",
		question: "使用している技術スタックについて教えてください",
		answer: "Next.js、TypeScript、Tailwind CSS、Supabaseなどを使用しています。",
		created_at: null,
	},
];
