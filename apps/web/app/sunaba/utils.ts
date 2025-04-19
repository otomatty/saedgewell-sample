import type { ComponentDoc, ComponentProp } from "./types";
import { COMPONENTS } from "./contents";

export async function getComponentDocs(): Promise<ComponentDoc[]> {
	const docs: ComponentDoc[] = [];

	for (const component of COMPONENTS) {
		try {
			const module = await import(
				`./${component.category}/${component.id}/docs.json`
			);
			const doc = {
				id: module.id,
				name: module.name,
				description: module.description,
				category: module.category,
				tags: [...module.tags],
				usage: {
					description: module.usage.description,
					example: module.usage.example,
					props: module.usage.props.map((prop: ComponentProp) => ({ ...prop })),
				},
				implementation: {
					description: module.implementation.description,
					features: [...module.implementation.features],
				},
			};
			docs.push(doc);
		} catch (error) {
			console.error(`Failed to load docs for ${component.id}:`, error);
		}
	}

	return docs;
}

export async function getComponentDoc(
	id: string,
): Promise<ComponentDoc | null> {
	const component = COMPONENTS.find((c) => c.id === id);
	if (!component) return null;

	try {
		const module = await import(
			`./${component.category}/${component.id}/docs.json`
		);
		return {
			id: module.id,
			name: module.name,
			description: module.description,
			category: module.category,
			tags: [...module.tags],
			usage: {
				description: module.usage.description,
				example: module.usage.example,
				props: module.usage.props.map((prop: ComponentProp) => ({ ...prop })),
			},
			implementation: {
				description: module.implementation.description,
				features: [...module.implementation.features],
			},
		};
	} catch (error) {
		console.error(`Failed to load docs for ${id}:`, error);
		return null;
	}
}
