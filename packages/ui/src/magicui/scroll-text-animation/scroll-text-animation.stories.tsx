import type { Meta, StoryObj } from "@storybook/react";
import { ScrollTextAnimation } from "./index";

const meta: Meta<typeof ScrollTextAnimation> = {
	title: "Animation/ScrollTextAnimation",
	component: ScrollTextAnimation,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollTextAnimation>;

export const Default: Story = {
	args: {
		text: "スクロールテキストアニメーション",
		className: "text-black dark:text-white",
	},
	render: (args) => (
		<div className="h-[200vh]">
			<div className="h-screen flex items-center justify-center">
				<ScrollTextAnimation {...args} />
			</div>
		</div>
	),
};

export const EnglishText: Story = {
	args: {
		text: "Scroll Text Animation",
		className: "text-black dark:text-white",
	},
	render: (args) => (
		<div className="h-[200vh]">
			<div className="h-screen flex items-center justify-center">
				<ScrollTextAnimation {...args} />
			</div>
		</div>
	),
};

export const LargerFontSize: Story = {
	args: {
		text: "大きなフォントサイズ",
		initialFontSize: 64,
		className: "text-black dark:text-white",
	},
	render: (args) => (
		<div className="h-[200vh]">
			<div className="h-screen flex items-center justify-center">
				<ScrollTextAnimation {...args} />
			</div>
		</div>
	),
};

export const SmallerFontSize: Story = {
	args: {
		text: "小さなフォントサイズのテキスト",
		initialFontSize: 32,
		className: "text-black dark:text-white",
	},
	render: (args) => (
		<div className="h-[200vh]">
			<div className="h-screen flex items-center justify-center">
				<ScrollTextAnimation {...args} />
			</div>
		</div>
	),
};
