"use client";

import { ProcessCard } from "./process-card";
import type { ProcessCardProps } from "./process-card";

export interface ProcessSectionProps {
	processes: ProcessCardProps[];
}

export const ProcessSection = ({ processes }: ProcessSectionProps) => {
	return (
		<section className="mb-20">
			<h2 className="text-3xl font-bold mb-8">開発プロセス</h2>
			<p className="text-muted-foreground mb-8 max-w-2xl">
				プロジェクトは以下のステップで進めていきます。各ステップで必要な成果物を作成し、お客様との合意を得ながら進行します。
			</p>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{processes.map((process) => (
					<ProcessCard key={process.step} {...process} />
				))}
			</div>
		</section>
	);
};
