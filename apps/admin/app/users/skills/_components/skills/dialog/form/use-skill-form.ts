"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Skill } from "../../../../../../../../../../../packages/types/src/skill";
import { createSkill, updateSkill } from "@/_actions/skills";
import type { ManualSkillFormData } from "./manual-skill-form";

interface UseSkillFormProps {
	skill?: Skill;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}

export function useSkillForm({
	skill,
	onSuccess,
	onError,
}: UseSkillFormProps = {}) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (values: ManualSkillFormData) => {
		try {
			setIsSubmitting(true);

			const formattedData = {
				...values,
				started_at: values.started_at.toISOString(),
			};

			console.log("送信するデータ:", formattedData);

			if (skill) {
				// 更新処理
				console.log("更新処理を実行:", {
					id: skill.id,
					...formattedData,
				});
				await updateSkill({
					id: skill.id,
					...formattedData,
				});
			} else {
				// 新規作成処理
				console.log("新規作成処理を実行:", formattedData);
				await createSkill(formattedData);
			}

			// 成功時の処理
			router.refresh();
			onSuccess?.();
		} catch (error) {
			console.error("スキルの保存に失敗:", error);
			if (error instanceof Error) {
				console.error("エラーの詳細:", {
					name: error.name,
					message: error.message,
					stack: error.stack,
				});
			}
			onError?.(error as Error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		isSubmitting,
		handleSubmit,
	};
}
