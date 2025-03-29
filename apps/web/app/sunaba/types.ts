export interface ComponentProp {
	name: string;
	type: string;
	description: string;
	default?: string;
}

export interface ComponentUsage {
	description: string;
	example: string;
	props: ComponentProp[];
}

export interface ComponentImplementation {
	description: string;
	features: string[];
}

export interface ComponentDoc {
	id: string;
	name: string;
	description: string;
	category: string;
	tags: string[];
	usage: ComponentUsage;
	implementation: ComponentImplementation;
}

export const CATEGORIES = [
	{
		id: "ui",
		label: "UI Components",
		description: "shadcn/ui ベースのカスタムコンポーネント",
	},
	{
		id: "animation",
		label: "Animation",
		description: "アニメーション系コンポーネント",
	},
	{
		id: "layout",
		label: "Layout",
		description: "レイアウト系コンポーネント",
	},
	{
		id: "interactive",
		label: "Interactive",
		description: "インタラクティブ系コンポーネント",
	},
	{
		id: "magic",
		label: "Magic UI",
		description: "特殊効果系コンポーネント",
	},
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
