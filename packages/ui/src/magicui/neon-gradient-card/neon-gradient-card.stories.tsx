import type { Meta, StoryObj } from "@storybook/react";
import { NeonGradientCard } from "./index";

const meta: Meta<typeof NeonGradientCard> = {
	title: "Animation/NeonGradientCard",
	component: NeonGradientCard,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NeonGradientCard>;

export const Default: Story = {
	args: {
		children: <div className="p-4">ネオングラデーションカード</div>,
	},
};

export const CustomBorder: Story = {
	args: {
		children: <div className="p-4">カスタムボーダー</div>,
		borderSize: 4,
		borderRadius: 20,
	},
};

export const CustomColors: Story = {
	args: {
		children: <div className="p-4">カスタムカラー</div>,
		neonColors: {
			firstColor: "#ff5500",
			secondColor: "#00ff55",
		},
	},
};

export const LargeContent: Story = {
	args: {
		children: (
			<div className="p-6">
				<h3 className="mb-4 text-xl font-bold">ネオングラデーションカード</h3>
				<p className="mb-4">
					このカードはネオングラデーションエフェクトを持っています。
				</p>
				<p>
					ボーダーサイズ、ボーダー半径、ネオンカラーをカスタマイズできます。
				</p>
			</div>
		),
	},
};
