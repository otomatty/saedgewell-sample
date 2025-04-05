"use client";

import { PricingCard } from "./pricing-card";

const pricingPlans = [
	{
		name: "ベーシック",
		description: "小規模なプロジェクトや個人開発向け",
		price: "50",
		period: "時間",
		features: [
			{ name: "要件定義・設計", included: true },
			{ name: "フロントエンド開発", included: true },
			{ name: "バックエンド開発", included: true },
			{ name: "レスポンシブ対応", included: true },
			{ name: "SEO対策", included: true },
			{ name: "保守・運用", included: false },
			{ name: "24時間サポート", included: false },
		],
	},
	{
		name: "スタンダード",
		description: "中規模プロジェクトやチーム開発向け",
		price: "80",
		period: "時間",
		features: [
			{ name: "要件定義・設計", included: true },
			{ name: "フロントエンド開発", included: true },
			{ name: "バックエンド開発", included: true },
			{ name: "レスポンシブ対応", included: true },
			{ name: "SEO対策", included: true },
			{ name: "保守・運用", included: true },
			{ name: "24時間サポート", included: false },
		],
		recommended: true,
	},
	{
		name: "エンタープライズ",
		description: "大規模プロジェクトや企業向け",
		price: "120",
		period: "時間",
		features: [
			{ name: "要件定義・設計", included: true },
			{ name: "フロントエンド開発", included: true },
			{ name: "バックエンド開発", included: true },
			{ name: "レスポンシブ対応", included: true },
			{ name: "SEO対策", included: true },
			{ name: "保守・運用", included: true },
			{ name: "24時間サポート", included: true },
		],
	},
];

export const PricingSection = () => {
	return (
		<section className="py-20 bg-muted/50">
			<div className="container">
				<div className="text-center space-y-4 mb-12">
					<h2 className="text-3xl font-bold">料金プラン</h2>
					<p className="text-muted-foreground">
						プロジェクトの規模や要件に応じて、最適なプランをお選びいただけます。
					</p>
				</div>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{pricingPlans.map((plan) => (
						<PricingCard key={plan.name} {...plan} />
					))}
				</div>
				<p className="text-center text-sm text-muted-foreground mt-8">
					※ カスタマイズや追加機能のご要望は、お気軽にご相談ください。
				</p>
			</div>
		</section>
	);
};
