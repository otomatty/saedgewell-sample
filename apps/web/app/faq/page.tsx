import type { Metadata } from "next";
import { FaqHero } from "./_components/faq-hero";
import { FaqAccordion } from "./_components/faq-accordion";

export const metadata: Metadata = {
	title: "FAQ",
	description: "よくある質問と回答をまとめています。",
};

// サンプルデータ（実際のプロジェクトではCMSやデータベースから取得）
const faqItems = [
	{
		category: "サービスについて",
		question: "どのようなサービスを提供していますか？",
		answer:
			"Webアプリケーション開発を中心に、以下のサービスを提供しています：\n\n" +
			"・フロントエンド開発（React, Next.js, TypeScript）\n" +
			"・バックエンド開発（Node.js, Python, Go）\n" +
			"・インフラ構築（AWS, GCP, Firebase）\n" +
			"・技術コンサルティング\n" +
			"・パフォーマンス最適化",
	},
	{
		category: "料金について",
		question: "料金体系を教えてください",
		answer:
			"プロジェクトの規模や要件に応じて、以下の料金体系から選択いただけます：\n\n" +
			"・時間単価制：作業時間に応じた請求\n" +
			"・プロジェクト一括制：要件に応じた一括見積もり\n" +
			"・リテイナー契約：月額固定での継続的なサポート\n\n" +
			"詳細は個別にご相談させていただきます。",
	},
	{
		category: "開発プロセス",
		question: "開発の進め方について教えてください",
		answer:
			"アジャイル開発手法を採用し、以下のステップで進めています：\n\n" +
			"1. 要件定義・プランニング\n" +
			"2. デザイン・設計\n" +
			"3. 開発・実装\n" +
			"4. テスト・レビュー\n" +
			"5. デプロイ・運用\n\n" +
			"2週間単位のスプリントで開発を進め、定期的なフィードバックを取り入れながら進めていきます。",
	},
	{
		category: "技術スタック",
		question: "主に使用している技術スタックは何ですか？",
		answer:
			"モダンな開発環境を整備し、以下の技術スタックを中心に開発を行っています：\n\n" +
			"フロントエンド：\n" +
			"・Next.js\n" +
			"・TypeScript\n" +
			"・Tailwind CSS\n\n" +
			"バックエンド：\n" +
			"・Node.js\n" +
			"・Python\n" +
			"・PostgreSQL\n\n" +
			"インフラ：\n" +
			"・AWS\n" +
			"・Docker\n" +
			"・GitHub Actions",
	},
	{
		category: "サポート",
		question: "開発後のサポート体制はどうなっていますか？",
		answer:
			"以下のようなサポート体制を整えています：\n\n" +
			"・保守運用サポート\n" +
			"・障害対応\n" +
			"・機能追加・改善\n" +
			"・セキュリティアップデート\n" +
			"・パフォーマンスモニタリング\n\n" +
			"サポートプランに応じて、24時間365日の緊急対応も可能です。",
	},
];

export default function FaqPage() {
	return (
		<main>
			<FaqHero />
			<div className="container py-20">
				<FaqAccordion items={faqItems} />
			</div>
		</main>
	);
}
