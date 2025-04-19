import type { Meta, StoryObj } from "@storybook/react";
import { FlipText } from "./index";

const meta: Meta<typeof FlipText> = {
	title: "Animation/FlipText",
	component: FlipText,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FlipText>;

export const Default: Story = {
	args: {
		word: "FLIP TEXT",
	},
};

export const SlowerAnimation: Story = {
	args: {
		word: "SLOWER",
		duration: 1.0,
	},
};

export const FasterSequence: Story = {
	args: {
		word: "FASTER SEQUENCE",
		delayMultiple: 0.04,
	},
};

export const CustomAnimation: Story = {
	args: {
		word: "CUSTOM",
		framerProps: {
			hidden: { rotateY: -90, opacity: 0 },
			visible: { rotateY: 0, opacity: 1 },
		},
	},
};

export const StyledText: Story = {
	args: {
		word: "STYLED",
		className: "text-2xl font-bold text-blue-500",
	},
};
