import type { Metadata } from "next";
import { SunabaHero } from "./_components/SunabaHero";
import { ClientShowcase } from "./_components/ClientShowcase";
import { getComponentDocs } from "./utils";

export const metadata: Metadata = {
	title: "実験場 | Saedge Well",
	description: "コンポーネントの実験場です。",
};

export default async function SunabaPage() {
	const components = await getComponentDocs();

	return (
		<main className="min-h-screen">
			<SunabaHero />
			<div className="container py-20">
				<ClientShowcase initialComponents={components} />
			</div>
		</main>
	);
}
