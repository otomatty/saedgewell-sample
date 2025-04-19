interface ComponentData {
	id: string;
	name: string;
	description: string;
	category: (typeof CATEGORIES)[number]["id"];
	tags: string[];
	previewUrl?: string;
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

export const COMPONENTS: ComponentData[] = [
	{
		id: "theme-toggle",
		name: "Theme Toggle",
		description: "ダークモード切り替えコンポーネント",
		category: "ui",
		tags: ["theme", "dark-mode", "toggle"],
		previewUrl: "/images/components/theme-toggle.png",
	},
	{
		id: "galaxy-3d",
		name: "Galaxy 3D",
		description: "3Dの銀河アニメーション",
		category: "animation",
		tags: ["3d", "animation", "three.js"],
		previewUrl: "/images/components/galaxy-3d.png",
	},
	{
		id: "bento-grid",
		name: "Bento Grid",
		description: "ベントグリッドレイアウト",
		category: "layout",
		tags: ["grid", "layout", "responsive"],
		previewUrl: "/images/components/bento-grid.png",
	},
	// TODO: 他のコンポーネントを追加
];

export type { ComponentData };
