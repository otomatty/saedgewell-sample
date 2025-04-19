import type { Meta, StoryObj } from "@storybook/react";
import { MagicCard } from "./index";

const meta: Meta<typeof MagicCard> = {
	title: "Animation/MagicCard",
	component: MagicCard,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MagicCard>;

export const Default: Story = {
	args: {
		children: (
			<div className="p-6">
				<h3 className="mb-2 text-xl font-bold">マジックカード</h3>
				<p>マウスを動かすとグラデーションエフェクトが表示されます</p>
			</div>
		),
		className: "w-80 h-60",
	},
};

export const CustomGradientSize: Story = {
	args: {
		children: (
			<div className="p-6">
				<h3 className="mb-2 text-xl font-bold">大きなグラデーション</h3>
				<p>グラデーションのサイズを大きくしています</p>
			</div>
		),
		gradientSize: 300,
		className: "w-80 h-60",
	},
};

export const CustomGradientColors: Story = {
	args: {
		children: (
			<div className="p-6">
				<h3 className="mb-2 text-xl font-bold">カスタムカラー</h3>
				<p>グラデーションの色をカスタマイズしています</p>
			</div>
		),
		gradientFrom: "#FF0080",
		gradientTo: "#7928CA",
		className: "w-80 h-60",
	},
};

export const HighOpacity: Story = {
	args: {
		children: (
			<div className="p-6">
				<h3 className="mb-2 text-xl font-bold">高い不透明度</h3>
				<p>グラデーションの不透明度を高くしています</p>
			</div>
		),
		gradientOpacity: 1.0,
		className: "w-80 h-60",
	},
};
