// @ts-nocheck - Storybookの型定義の問題を回避
import type { Meta, StoryObj } from "@storybook/react";
import { BasicHero } from "./basic-hero";
import { Button } from "../core/button";

/**
 * `BasicHero`コンポーネントは、ウェブサイトのヒーローセクションを表示するためのコンポーネントです。
 *
 * ## 特徴
 * - タイトルと説明文をサポート
 * - 複数の背景パターンオプション（ドット、グリッド、波、なし）
 * - 左揃えまたは中央揃えの配置オプション
 * - 複数のサイズオプション（小、中、大）
 * - アニメーション効果
 * - カスタムコンテンツの追加が可能
 *
 * ## 使用例
 * ```tsx
 * <BasicHero
 *   title="私たちのサービス"
 *   description="最高品質のサービスを提供しています。"
 *   pattern="dots"
 *   align="center"
 *   size="md"
 * >
 *   <Button>詳細を見る</Button>
 * </BasicHero>
 * ```
 *
 * ## アクセシビリティ
 * - 適切な見出しレベルを使用
 * - コントラスト比を考慮したスタイリング
 */
const meta = {
	title: "Layout/BasicHero",
	component: BasicHero,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"BasicHeroコンポーネントは、ウェブサイトのヒーローセクションを表示するためのコンポーネントです。",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		title: {
			control: "text",
			description: "ヒーローセクションのタイトルを指定します。",
			table: {
				type: { summary: "string" },
			},
		},
		description: {
			control: "text",
			description: "ヒーローセクションの説明文を指定します（オプション）。",
			table: {
				type: { summary: "string" },
			},
		},
		pattern: {
			control: "select",
			options: ["dots", "grid", "waves", "none"],
			description: "背景パターンを指定します。",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "dots" },
			},
		},
		align: {
			control: "select",
			options: ["left", "center"],
			description: "テキストの配置を指定します。",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "center" },
			},
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "ヒーローセクションのサイズを指定します。",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "md" },
			},
		},
		children: {
			description: "ヒーローセクションに追加するカスタムコンテンツ。",
			control: {
				type: null,
			},
		},
		className: {
			control: "text",
			description: "コンポーネントに追加のクラス名を指定します。",
			table: {
				type: { summary: "string" },
			},
		},
	},
} as Meta<typeof BasicHero>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なヒーローセクションの例です。
 * タイトルと説明文を表示します。
 */
export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"基本的なヒーローセクションの例です。タイトルと説明文を表示します。",
			},
		},
	},
	args: {
		title: "モダンなウェブサイトを構築",
		description:
			"最新のテクノロジーを使用して、美しく機能的なウェブサイトを構築します。",
	},
};

/**
 * ボタン付きのヒーローセクションの例です。
 * タイトル、説明文、およびアクションボタンを表示します。
 */
export const WithButton: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"ボタン付きのヒーローセクションの例です。タイトル、説明文、およびアクションボタンを表示します。",
			},
		},
	},
	render: (args) => (
		<BasicHero {...args}>
			<div className="flex gap-4 flex-wrap justify-center">
				<Button size="lg">詳細を見る</Button>
				<Button size="lg" variant="outline">
					お問い合わせ
				</Button>
			</div>
		</BasicHero>
	),
	args: {
		title: "ビジネスを次のレベルへ",
		description:
			"私たちのサービスを利用して、ビジネスを成長させましょう。専門家チームがサポートします。",
	},
};

/**
 * 左揃えのヒーローセクションの例です。
 * テキストが左に配置されます。
 */
export const LeftAligned: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"左揃えのヒーローセクションの例です。テキストが左に配置されます。",
			},
		},
	},
	render: (args) => (
		<BasicHero {...args}>
			<Button>始めましょう</Button>
		</BasicHero>
	),
	args: {
		title: "革新的なソリューション",
		description: "あなたのビジネスに最適なソリューションを提供します。",
		align: "left",
	},
};

/**
 * グリッドパターンのヒーローセクションの例です。
 * 背景にグリッドパターンを使用しています。
 */
export const GridPattern: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"グリッドパターンのヒーローセクションの例です。背景にグリッドパターンを使用しています。",
			},
		},
	},
	args: {
		title: "デザインの力",
		description: "美しいデザインで、ユーザー体験を向上させます。",
		pattern: "grid",
	},
};

/**
 * 波パターンのヒーローセクションの例です。
 * 背景に波パターンを使用しています。
 */
export const WavesPattern: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"波パターンのヒーローセクションの例です。背景に波パターンを使用しています。",
			},
		},
	},
	args: {
		title: "流れるようなデザイン",
		description: "波のようなパターンで、動きのあるデザインを実現します。",
		pattern: "waves",
	},
};

/**
 * 大きいサイズのヒーローセクションの例です。
 * より大きなサイズと大きなフォントを使用しています。
 */
export const LargeSize: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"大きいサイズのヒーローセクションの例です。より大きなサイズと大きなフォントを使用しています。",
			},
		},
	},
	args: {
		title: "インパクトのある見出し",
		description: "大きなヒーローセクションで、より強いインパクトを与えます。",
		size: "lg",
	},
};

/**
 * 小さいサイズのヒーローセクションの例です。
 * よりコンパクトなサイズを使用しています。
 */
export const SmallSize: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"小さいサイズのヒーローセクションの例です。よりコンパクトなサイズを使用しています。",
			},
		},
	},
	args: {
		title: "コンパクトなヒーロー",
		description: "小さいサイズのヒーローセクションで、スペースを節約します。",
		size: "sm",
	},
};
