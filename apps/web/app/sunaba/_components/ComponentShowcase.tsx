"use client";

import { getComponentDocs } from "../utils";
import { ClientShowcase } from "./ClientShowcase";

export async function ComponentShowcase() {
	const components = await getComponentDocs();

	return (
		<div className="w-full">
			<ClientShowcase initialComponents={components} />
		</div>
	);
}
