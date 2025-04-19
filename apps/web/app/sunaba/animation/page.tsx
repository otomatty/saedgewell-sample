import { CategoryLayout } from "../_components/category-layout";
import { getComponentDocs } from "../utils";

const CATEGORY = {
	id: "animation",
	label: "Animation",
	description: "アニメーション系コンポーネント",
};

export default async function AnimationComponentsPage() {
	const components = await getComponentDocs();
	const animationComponents = components.filter(
		(c) => c.category === "animation",
	);

	return (
		<CategoryLayout category={CATEGORY} components={animationComponents} />
	);
}
