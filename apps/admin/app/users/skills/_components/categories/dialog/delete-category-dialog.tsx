"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { deleteSkillCategory } from "@/_actions/skill-categories";
import type { SkillCategory } from "../../../../../../../../../../packages/types/src/skill";

interface Props {
	category: SkillCategory;
	trigger: React.ReactNode;
}

export function DeleteCategoryDialog({ category, trigger }: Props) {
	const router = useRouter();
	const { toast } = useToast();

	const handleDelete = async () => {
		try {
			await deleteSkillCategory(category.id);
			toast({
				title: "カテゴリーを削除しました",
			});
			router.refresh();
		} catch (error) {
			console.error("Failed to delete category:", error);
			toast({
				title: "カテゴリーの削除に失敗しました",
				variant: "destructive",
			});
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>カテゴリーの削除</AlertDialogTitle>
					<AlertDialogDescription>
						「{category.name}」を削除してもよろしいですか？
						<br />
						この操作は取り消せません。
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>キャンセル</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						削除
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
