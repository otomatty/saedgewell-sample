import type { Meta, StoryObj } from "@storybook/react";
import { ShimmerButton } from "./index";

const meta: Meta<typeof ShimmerButton> = {
	title: "Animation/ShimmerButton",
	component: ShimmerButton,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ShimmerButton>;

export const Default: Story = {
	args: {
		children: "Click me",
	},
};

export const CustomColors: Story = {
	args: {
		children: "Custom Colors",
		shimmerColor: "#00ff00",
		background: "rgba(0, 0, 100, 0.8)",
	},
};

export const CustomSize: Story = {
	args: {
		children: "Custom Size",
		shimmerSize: "0.1em",
		borderRadius: "8px",
	},
};

export const CustomDuration: Story = {
	args: {
		children: "Custom Duration",
		shimmerDuration: "1s",
	},
};
