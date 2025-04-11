// @ts-nocheck - Storybookの型定義の問題を回避
import type { Meta, StoryObj } from "@storybook/react";
import { SectionTitle } from "./section-title";

/**
 * `SectionTitle`コンポーネントは、ページのセクションのタイトルとサブタイトルを表示するためのコンポーネントです。
 *
 * ## 特徴
 * - アニメーション付きの表示
 * - タイトルとオプションのサブタイトルをサポート
 * - 左揃え、中央揃え、右揃えの配置オプション
 * - グラデーションテキスト効果
 *
 * ## 使用例
 * ```tsx
 * <SectionTitle
 *   title="特徴"
 *   subtitle="私たちのサービスが提供する主な特徴をご紹介します"
 *   align="center"
 * />
 * ```
 *
 * ## アクセシビリティ
 * - 適切な見出しレベルを使用
 * - コントラスト比を考慮したスタイリング
 */
const meta = {
	title: "Layout/SectionTitle",
	component: SectionTitle,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"セクションタイトルコンポーネントは、ページのセクションのタイトルとサブタイトルを表示するためのコンポーネントです。",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		title: {
			control: "text",
			description: "セクションのタイトルを指定します。",
			table: {
				type: { summary: "string" },
			},
		},
		subtitle: {
			control: "text",
			description: "セクションのサブタイトルを指定します（オプション）。",
			table: {
				type: { summary: "string" },
			},
		},
		align: {
			control: "select",
			options: ["left", "center", "right"],
			description: "テキストの配置を指定します。",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "left" },
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
} as Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なセクションタイトルの例です。
 * タイトルのみを表示します。
 */
export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: "基本的なセクションタイトルの例です。タイトルのみを表示します。",
			},
		},
	},
	args: {
		title: "セクションタイトル",
	},
};

/**
 * サブタイトル付きのセクションタイトルの例です。
 * タイトルとサブタイトルの両方を表示します。
 */
export const WithSubtitle: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"サブタイトル付きのセクションタイトルの例です。タイトルとサブタイトルの両方を表示します。",
			},
		},
	},
	args: {
		title: "私たちのサービス",
		subtitle: "お客様のニーズに合わせた最高品質のサービスを提供しています。",
	},
};

/**
 * 中央揃えのセクションタイトルの例です。
 * テキストが中央に配置されます。
 */
export const CenterAligned: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"中央揃えのセクションタイトルの例です。テキストが中央に配置されます。",
			},
		},
	},
	args: {
		title: "特徴",
		subtitle: "私たちのサービスが提供する主な特徴をご紹介します。",
		align: "center",
	},
};

/**
 * 右揃えのセクションタイトルの例です。
 * テキストが右に配置されます。
 */
export const RightAligned: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"右揃えのセクションタイトルの例です。テキストが右に配置されます。",
			},
		},
	},
	args: {
		title: "お問い合わせ",
		subtitle: "ご質問やご相談がございましたら、お気軽にお問い合わせください。",
		align: "right",
	},
};

/**
 * カスタムスタイルのセクションタイトルの例です。
 * 追加のクラス名を使用してスタイルをカスタマイズしています。
 */
export const CustomStyling: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"カスタムスタイルのセクションタイトルの例です。追加のクラス名を使用してスタイルをカスタマイズしています。",
			},
		},
	},
	args: {
		title: "カスタムスタイル",
		subtitle: "追加のクラス名を使用してスタイルをカスタマイズできます。",
		className: "py-8 px-4 bg-secondary/20 rounded-lg",
	},
};
