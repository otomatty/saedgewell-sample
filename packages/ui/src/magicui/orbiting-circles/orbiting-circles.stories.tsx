import type { Meta, StoryObj } from "@storybook/react";
import { OrbitingCircles } from "./index";

const meta: Meta<typeof OrbitingCircles> = {
	title: "Animation/OrbitingCircles",
	component: OrbitingCircles,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OrbitingCircles>;

export const Default: Story = {
	args: {
		children: [
			<div
				key="1"
				className="flex size-full items-center justify-center rounded-full bg-blue-500 text-white"
			>
				1
			</div>,
			<div
				key="2"
				className="flex size-full items-center justify-center rounded-full bg-green-500 text-white"
			>
				2
			</div>,
			<div
				key="3"
				className="flex size-full items-center justify-center rounded-full bg-red-500 text-white"
			>
				3
			</div>,
			<div
				key="4"
				className="flex size-full items-center justify-center rounded-full bg-yellow-500 text-white"
			>
				4
			</div>,
		],
		className: "relative size-[400px]",
	},
};

export const CustomRadius: Story = {
	args: {
		children: [
			<div
				key="1"
				className="flex size-full items-center justify-center rounded-full bg-blue-500 text-white"
			>
				1
			</div>,
			<div
				key="2"
				className="flex size-full items-center justify-center rounded-full bg-green-500 text-white"
			>
				2
			</div>,
			<div
				key="3"
				className="flex size-full items-center justify-center rounded-full bg-red-500 text-white"
			>
				3
			</div>,
		],
		radius: 100,
		className: "relative size-[300px]",
	},
};

export const NoPath: Story = {
	args: {
		children: [
			<div
				key="1"
				className="flex size-full items-center justify-center rounded-full bg-blue-500 text-white"
			>
				1
			</div>,
			<div
				key="2"
				className="flex size-full items-center justify-center rounded-full bg-green-500 text-white"
			>
				2
			</div>,
			<div
				key="3"
				className="flex size-full items-center justify-center rounded-full bg-red-500 text-white"
			>
				3
			</div>,
			<div
				key="4"
				className="flex size-full items-center justify-center rounded-full bg-yellow-500 text-white"
			>
				4
			</div>,
		],
		path: false,
		className: "relative size-[400px]",
	},
};

export const ReverseDirection: Story = {
	args: {
		children: [
			<div
				key="1"
				className="flex size-full items-center justify-center rounded-full bg-blue-500 text-white"
			>
				1
			</div>,
			<div
				key="2"
				className="flex size-full items-center justify-center rounded-full bg-green-500 text-white"
			>
				2
			</div>,
			<div
				key="3"
				className="flex size-full items-center justify-center rounded-full bg-red-500 text-white"
			>
				3
			</div>,
		],
		reverse: true,
		className: "relative size-[400px]",
	},
};

export const CustomSpeed: Story = {
	args: {
		children: [
			<div
				key="1"
				className="flex size-full items-center justify-center rounded-full bg-blue-500 text-white"
			>
				1
			</div>,
			<div
				key="2"
				className="flex size-full items-center justify-center rounded-full bg-green-500 text-white"
			>
				2
			</div>,
			<div
				key="3"
				className="flex size-full items-center justify-center rounded-full bg-red-500 text-white"
			>
				3
			</div>,
		],
		speed: 2,
		className: "relative size-[400px]",
	},
};
