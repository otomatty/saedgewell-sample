import { CategoryLayout } from "../_components/category-layout";
import { getComponentDocs } from "../utils";

const CATEGORY = {
	id: "layout",
	label: "Layout",
	description: "レイアウト系コンポーネント",
};

export default async function LayoutComponentsPage() {
	const components = await getComponentDocs();
	const layoutComponents = components.filter((c) => c.category === "layout");

	return <CategoryLayout category={CATEGORY} components={layoutComponents} />;
}
