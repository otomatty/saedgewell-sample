"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Skill } from "../../../../../../../../../../packages/types/src/skill";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/data-table/data-table-row-actions";
import { SkillForm } from "../dialog/skill-form";
import { deleteSkill } from "@/_actions/skills";

export const skillColumns: ColumnDef<Skill>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="スキル名" />
		),
	},
	{
		accessorKey: "description",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="説明" />
		),
	},
	{
		accessorKey: "category",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="カテゴリー" />
		),
	},
	{
		accessorKey: "created_at",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="作成日時" />
		),
		cell: ({ row }) => {
			const date = new Date(row.getValue("created_at"));
			return date.toLocaleString("ja-JP");
		},
	},
	{
		accessorKey: "updated_at",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="更新日時" />
		),
		cell: ({ row }) => {
			const date = new Date(row.getValue("updated_at"));
			return date.toLocaleString("ja-JP");
		},
	},
	{
		id: "actions",
		cell: ({ row }) => (
			<DataTableRowActions
				row={row.original}
				editForm={
					<SkillForm
						categories={[]}
						onSuccess={async () => {}}
						onCancel={() => {}}
						defaultValues={row.original}
					/>
				}
				editTitle="スキルの編集"
				onDelete={async (skill) => {
					try {
						await deleteSkill(skill.id);
					} catch (error) {
						console.error("Failed to delete skill:", error);
						throw new Error("スキルの削除に失敗しました");
					}
				}}
			/>
		),
	},
];
