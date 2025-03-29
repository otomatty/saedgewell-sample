"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveDialog } from "@/components/custom/responsive-dialog";
import { CategoryForm } from "./category-form";
import {
	createSkillCategory,
	updateSkillCategory,
} from "@/_actions/skill-categories";
import type { SkillCategory } from "../../../../../../../../../../packages/types/src/skill";

interface Props {
	trigger: React.ReactNode;
	defaultValues?: SkillCategory;
}

export function CategoryDialog({ trigger, defaultValues }: Props) {
	const router = useRouter();
	const { toast } = useToast();

	const handleSubmit = async (
		values: {
			name: string;
			description: string;
		},
		close: () => void,
	) => {
		try {
			if (defaultValues) {
				await updateSkillCategory(defaultValues.id, values);
				toast({
					title: "カテゴリーを更新しました",
				});
			} else {
				await createSkillCategory(values);
				toast({
					title: "カテゴリーを作成しました",
				});
			}
			router.refresh();
			close();
		} catch (error) {
			console.error("Failed to save category:", error);
			toast({
				title: defaultValues
					? "カテゴリーの更新に失敗しました"
					: "カテゴリーの作成に失敗しました",
				variant: "destructive",
			});
		}
	};

	return (
		<ResponsiveDialog
			trigger={trigger}
			title={defaultValues ? "カテゴリーを編集" : "カテゴリーを作成"}
			description={
				defaultValues
					? "既存のカテゴリーを編集します。"
					: "新しいカテゴリーを作成します。"
			}
		>
			{({ close }) => (
				<CategoryForm
					defaultValues={defaultValues}
					onSubmit={async (values) => handleSubmit(values, close)}
					onCancel={close}
				/>
			)}
		</ResponsiveDialog>
	);
}
