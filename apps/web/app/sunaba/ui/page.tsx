import { CategoryLayout } from "../_components/category-layout";
import { getComponentDocs } from "../utils";

const CATEGORY = {
	id: "ui",
	label: "UI Components",
	description: "shadcn/ui ベースのカスタムコンポーネント",
};

export default async function UIComponentsPage() {
	const components = await getComponentDocs();
	const uiComponents = components.filter((c) => c.category === "ui");

	return <CategoryLayout category={CATEGORY} components={uiComponents} />;
}
