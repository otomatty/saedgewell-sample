import type { Metadata } from "next";
import { SkillsHero } from "./_components/SkillsHero";
import { SkillCategory } from "./_components/SkillCategory";

export const metadata: Metadata = {
	title: "Skills",
	description:
		"フロントエンド、バックエンド、インフラまで、プロダクトな開発スキルを活かしてプロジェクトに貢献します。",
};

const skillsData = {
	frontend: {
		title: "フロントエンド",
		description:
			"モダンなフロントエンド技術を活用し、パフォーマンスと使いやすさを両立したUIを実装します。",
		skills: [
			{
				name: "Next.js",
				level: 95,
				description:
					"App RouterやServer Componentsなど、最新機能を活用した開発経験が豊富です。",
			},
			{
				name: "TypeScript",
				level: 90,
				description:
					"型安全性を重視した開発を行い、保守性の高いコードを実装します。",
			},
			{
				name: "React",
				level: 90,
				description:
					"パフォーマンスを考慮したコンポーネント設計と実装が得意です。",
			},
			{
				name: "TailwindCSS",
				level: 85,
				description:
					"効率的なスタイリングと、レスポンシブデザインの実装が得意です。",
			},
		],
	},
	backend: {
		title: "バックエンド",
		description:
			"スケーラブルで保守性の高いバックエンドシステムを設計・実装します。",
		skills: [
			{
				name: "Node.js",
				level: 85,
				description:
					"Express, Fastifyなどを使用したRESTful APIの開発経験が豊富です。",
			},
			{
				name: "Python",
				level: 80,
				description:
					"FastAPI, Djangoを使用したバックエンド開発やデータ処理の経験があります。",
			},
			{
				name: "PostgreSQL",
				level: 75,
				description:
					"パフォーマンスを考慮したスキーマ設計とクエリ最適化が得意です。",
			},
			{
				name: "GraphQL",
				level: 70,
				description: "Apollo ServerやPrismaを使用したAPI開発の経験があります。",
			},
		],
	},
	infrastructure: {
		title: "インフラストラクチャ",
		description:
			"クラウドサービスを活用し、安定性と拡張性を備えたインフラを構築します。",
		skills: [
			{
				name: "AWS",
				level: 80,
				description:
					"ECS, Lambda, S3などを使用したサーバーレスアプリケーションの開発経験があります。",
			},
			{
				name: "Docker",
				level: 75,
				description:
					"マルチコンテナ環境の構築と、CI/CDパイプラインの整備が得意です。",
			},
			{
				name: "Terraform",
				level: 70,
				description:
					"IaCを活用したインフラ構築と、再現性の高い環境管理を行います。",
			},
			{
				name: "Kubernetes",
				level: 65,
				description:
					"コンテナオーケストレーションを活用したマイクロサービスの運用経験があります。",
			},
		],
	},
	other: {
		title: "その他",
		description:
			"プロジェクト成功に必要な、開発プロセスやツールの活用スキルです。",
		skills: [
			{
				name: "Git",
				level: 90,
				description:
					"GitFlow, GitHub Flowを活用したチーム開発の経験が豊富です。",
			},
			{
				name: "アジャイル開発",
				level: 85,
				description:
					"スクラムマスターとしてのチームマネジメント経験があります。",
			},
			{
				name: "CI/CD",
				level: 80,
				description:
					"GitHub Actions, CircleCIを使用した自動化パイプラインの構築が得意です。",
			},
			{
				name: "テスト駆動開発",
				level: 75,
				description:
					"Jest, Vitest, Pytestを使用した単体テスト・統合テストの実装経験があります。",
			},
		],
	},
};

export default function SkillsPage() {
	return (
		<main>
			<SkillsHero />
			<div className="container py-20 space-y-32">
				<SkillCategory {...skillsData.frontend} />
				<SkillCategory {...skillsData.backend} />
				<SkillCategory {...skillsData.infrastructure} />
				<SkillCategory {...skillsData.other} />
			</div>
		</main>
	);
}
