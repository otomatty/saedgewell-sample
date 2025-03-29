"use client";

import { ResponsiveDialog } from "@/components/custom/responsive-dialog";
import { SkillForm } from "./skill-form";
import type { SkillCategory } from "../../../../../../../../../../packages/types/src/skill";
import type { z } from "zod";
import type { formSchema } from "./skill-form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

type FormData = z.infer<typeof formSchema>;

interface CreateSkillDialogProps {
	categories: SkillCategory[];
	onSubmit: (values: FormData) => Promise<void>;
}

/**
 * スキル作成ダイアログ
 * @description ResponsiveDialogを使用して、スキル作成フォームを表示するダイアログコンポーネント
 */
export function CreateSkillDialog({
	categories,
	onSubmit,
}: CreateSkillDialogProps) {
	const [isSuccess, setIsSuccess] = useState(false);

	const handleSubmit = async (values: FormData) => {
		await onSubmit(values);
		setIsSuccess(true);
	};

	return (
		<ResponsiveDialog
			title="スキルを追加"
			description="新しいスキルを追加します"
			trigger={
				<Button>
					<PlusIcon className="h-4 w-4" />
					スキルを追加
				</Button>
			}
			onSuccess={() => setIsSuccess(false)}
		>
			{({ close }) => (
				<SkillForm
					categories={categories}
					onSuccess={() => {
						setIsSuccess(true);
						close();
					}}
					onCancel={close}
				/>
			)}
		</ResponsiveDialog>
	);
}
