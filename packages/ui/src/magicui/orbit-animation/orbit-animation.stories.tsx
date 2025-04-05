import type { Meta, StoryObj } from "@storybook/react";
import { OrbitAnimation } from "./index";

const meta: Meta<typeof OrbitAnimation> = {
	title: "Animation/OrbitAnimation",
	component: OrbitAnimation,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OrbitAnimation>;

export const Default: Story = {
	args: {
		className: "size-80",
	},
};

export const Smaller: Story = {
	args: {
		className: "size-60",
		radius: 80,
	},
};

export const SlowerSpeed: Story = {
	args: {
		className: "size-80",
		speed: 0.002,
	},
};

export const FasterSpeed: Story = {
	args: {
		className: "size-80",
		speed: 0.01,
	},
};

export const CustomStyle: Story = {
	args: {
		className: "size-80 bg-gray-100 rounded-full p-4",
	},
};
