import type { Meta, StoryObj } from "@storybook/react";
import { ScrollFadeText } from "./index";

const meta: Meta<typeof ScrollFadeText> = {
	title: "Animation/ScrollFadeText",
	component: ScrollFadeText,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollFadeText>;

export const Default: Story = {
	args: {
		text: "スクロールに応じて\nフェードするテキスト",
		className: "text-black dark:text-white",
	},
	render: (args) => (
		<div className="h-[200vh]">
			<div className="h-screen flex items-center justify-center">
				<ScrollFadeText {...args} />
			</div>
		</div>
	),
};

export const EnglishText: Story = {
	args: {
		text: "Scroll to see\nthe text fade",
		className: "text-black dark:text-white",
	},
	render: (args) => (
		<div className="h-[200vh]">
			<div className="h-screen flex items-center justify-center">
				<ScrollFadeText {...args} />
			</div>
		</div>
	),
};

export const LargerFontSize: Story = {
	args: {
		text: "大きなフォント\nサイズのテキスト",
		fontSize: 48,
		className: "text-black dark:text-white",
	},
	render: (args) => (
		<div className="h-[200vh]">
			<div className="h-screen flex items-center justify-center">
				<ScrollFadeText {...args} />
			</div>
		</div>
	),
};

export const MultipleLines: Story = {
	args: {
		text: "複数行の\nテキストを\n表示できます",
		className: "text-black dark:text-white",
	},
	render: (args) => (
		<div className="h-[200vh]">
			<div className="h-screen flex items-center justify-center">
				<ScrollFadeText {...args} />
			</div>
		</div>
	),
};
