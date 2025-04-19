import type { Meta, StoryObj } from "@storybook/react";
import { AuroraText } from "./index";

const meta: Meta<typeof AuroraText> = {
	title: "Animation/AuroraText",
	component: AuroraText,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AuroraText>;

export const Default: Story = {
	args: {
		children: "オーロラテキスト",
	},
};

export const AsHeading: Story = {
	args: {
		as: "h1",
		children: "オーロラ見出し",
		className: "text-3xl font-bold",
	},
};

export const AsParagraph: Story = {
	args: {
		as: "p",
		children:
			"これはオーロラエフェクトを持つ段落テキストです。美しいグラデーションが表示されます。",
		className: "max-w-md",
	},
};

export const WithCustomStyles: Story = {
	args: {
		children: "カスタムスタイル",
		className: "text-2xl font-bold tracking-wider",
	},
};
