// @ts-nocheck - Storybookの型定義の問題を回避
import type { Meta, StoryObj } from "@storybook/react";
import { BackLink } from "./back-link";

/**
 * `BackLink`コンポーネントは、ユーザーが前のページに戻るためのリンクを提供します。
 *
 * ## 特徴
 * - シンプルなナビゲーションリンク
 * - カスタマイズ可能なラベル
 * - Next.jsのLinkコンポーネントを使用
 *
 * ## 使用例
 * ```tsx
 * <BackLink label="戻る" href="/previous-page" />
 * ```
 *
 * ## アクセシビリティ
 * - キーボードでのフォーカスと操作をサポート
 * - スクリーンリーダー対応
 */
const meta = {
	title: "Layout/BackLink",
	component: BackLink,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"BackLinkコンポーネントは、ユーザーが前のページに戻るためのリンクを提供します。",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "リンクのラベルテキストを指定します。",
			table: {
				type: { summary: "string" },
			},
		},
		href: {
			control: "text",
			description: "リンク先のURLを指定します。",
			table: {
				type: { summary: "string" },
			},
		},
	},
} as Meta<typeof BackLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なBackLinkの例です。
 * シンプルな「戻る」リンクを表示します。
 */
export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"基本的なBackLinkの例です。シンプルな「戻る」リンクを表示します。",
			},
		},
	},
	args: {
		label: "戻る",
		href: "#",
	},
};

/**
 * カスタムラベルを持つBackLinkの例です。
 * 異なるラベルテキストを使用しています。
 */
export const CustomLabel: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"カスタムラベルを持つBackLinkの例です。異なるラベルテキストを使用しています。",
			},
		},
	},
	args: {
		label: "前のページへ戻る",
		href: "#",
	},
};

/**
 * 実際のURLを持つBackLinkの例です。
 * 実際のページへのリンクを示しています。
 */
export const WithRealURL: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"実際のURLを持つBackLinkの例です。実際のページへのリンクを示しています。",
			},
		},
	},
	args: {
		label: "ホームに戻る",
		href: "/",
	},
};
