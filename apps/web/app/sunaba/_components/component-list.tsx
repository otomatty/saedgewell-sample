import type { ComponentDoc } from "../types";

interface ComponentListProps {
	components: ComponentDoc[];
	category: {
		id: string;
		label: string;
		description: string;
	};
}

export function ComponentList({ components, category }: ComponentListProps) {
	return (
		<main className="container py-20">
			<div className="mb-8">
				<h1 className="text-4xl font-bold">{category.label}</h1>
				<p className="mt-2 text-muted-foreground">{category.description}</p>
			</div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{components.map((component) => (
					<a
						key={component.id}
						href={`/sunaba/${category.id}/${component.id}`}
						className="block transition-transform hover:scale-105"
					>
						<div className="rounded-lg border bg-card p-6 text-card-foreground shadow-xs">
							<h2 className="text-xl font-semibold">{component.name}</h2>
							<p className="mt-2 text-sm text-muted-foreground">
								{component.description}
							</p>
							<div className="mt-4 flex flex-wrap gap-2">
								{component.tags.map((tag: string) => (
									<span
										key={tag}
										className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					</a>
				))}
			</div>
		</main>
	);
}
