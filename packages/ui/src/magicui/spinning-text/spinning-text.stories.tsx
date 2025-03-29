import type { Meta, StoryObj } from "@storybook/react";
import { SpinningText } from "./index";

const meta: Meta<typeof SpinningText> = {
	title: "Animation/SpinningText",
	component: SpinningText,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SpinningText>;

export const Default: Story = {
	args: {
		children: "SPINNING TEXT EXAMPLE",
	},
};

export const ArrayOfStrings: Story = {
	args: {
		children: ["S", "P", "I", "N", "N", "I", "N", "G", " ", "T", "E", "X", "T"],
	},
};

export const CustomDuration: Story = {
	args: {
		children: "FASTER SPINNING",
		duration: 5,
	},
};

export const ReverseDirection: Story = {
	args: {
		children: "REVERSE DIRECTION",
		reverse: true,
	},
};

export const CustomRadius: Story = {
	args: {
		children: "CUSTOM RADIUS",
		radius: 10,
	},
};
