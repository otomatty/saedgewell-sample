import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedCircularProgressBar } from "./index";

const meta: Meta<typeof AnimatedCircularProgressBar> = {
	title: "Animation/AnimatedCircularProgressBar",
	component: AnimatedCircularProgressBar,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AnimatedCircularProgressBar>;

export const Default: Story = {
	args: {
		max: 100,
		min: 0,
		value: 75,
		gaugePrimaryColor: "#3b82f6",
		gaugeSecondaryColor: "#e5e7eb",
	},
};

export const LowValue: Story = {
	args: {
		max: 100,
		min: 0,
		value: 25,
		gaugePrimaryColor: "#3b82f6",
		gaugeSecondaryColor: "#e5e7eb",
	},
};

export const CustomColors: Story = {
	args: {
		max: 100,
		min: 0,
		value: 60,
		gaugePrimaryColor: "#10b981",
		gaugeSecondaryColor: "#d1fae5",
	},
};

export const CustomRange: Story = {
	args: {
		max: 200,
		min: 50,
		value: 125,
		gaugePrimaryColor: "#f59e0b",
		gaugeSecondaryColor: "#fef3c7",
	},
};
