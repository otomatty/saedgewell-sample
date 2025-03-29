import { Suspense } from "react";
import { getSkills } from "@/_actions/skills";
import { getSkillCategories } from "@/_actions/skill-categories";
import { SkillsView } from "./_components/skills-view";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/custom/page-header";

export const metadata = {
	title: "スキル管理",
	description: "スキル情報の管理を行います。",
};

/**
 * スキル管理ページ
 * @returns {Promise<JSX.Element>}
 */
export default async function SkillsPage() {
	// Server Actionsを使用してデータを取得
	const [skills, categories] = await Promise.all([
		getSkills(),
		getSkillCategories(),
	]);

	return (
		<>
			<PageHeader title="スキル管理" />
			<div className="container mx-auto py-10">
				<Suspense fallback={<Skeleton className="h-[400px]" />}>
					<SkillsView initialSkills={skills} initialCategories={categories} />
				</Suspense>
			</div>
		</>
	);
}
