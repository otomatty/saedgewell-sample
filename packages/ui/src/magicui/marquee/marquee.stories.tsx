import type { Meta, StoryObj } from "@storybook/react";
import { Marquee } from "./index";

const meta: Meta<typeof Marquee> = {
	title: "Animation/Marquee",
	component: Marquee,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Marquee>;

export const Default: Story = {
	args: {
		children: (
			<>
				<span className="px-4">マーキーテキスト</span>
				<span className="px-4">スクロールします</span>
				<span className="px-4">自動的に</span>
				<span className="px-4">繰り返し</span>
			</>
		),
		className: "w-96 h-12",
	},
};

export const Reverse: Story = {
	args: {
		children: (
			<>
				<span className="px-4">逆方向に</span>
				<span className="px-4">スクロール</span>
				<span className="px-4">します</span>
			</>
		),
		reverse: true,
		className: "w-96 h-12",
	},
};

export const PauseOnHover: Story = {
	args: {
		children: (
			<>
				<span className="px-4">ホバーすると</span>
				<span className="px-4">一時停止</span>
				<span className="px-4">します</span>
			</>
		),
		pauseOnHover: true,
		className: "w-96 h-12",
	},
};

export const Vertical: Story = {
	args: {
		children: (
			<>
				<span className="py-4">垂直方向に</span>
				<span className="py-4">スクロール</span>
				<span className="py-4">します</span>
			</>
		),
		vertical: true,
		className: "w-40 h-80",
	},
};

export const CustomRepeat: Story = {
	args: {
		children: (
			<>
				<span className="px-4">繰り返し回数</span>
				<span className="px-4">を変更</span>
			</>
		),
		repeat: 2,
		className: "w-96 h-12",
	},
};
