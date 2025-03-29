"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { SkillCategory } from "../../../../../../../../../../packages/types/src/skill";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/data-table/data-table-row-actions";

export const categoryColumns: ColumnDef<SkillCategory>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="カテゴリー名" />
		),
	},
	{
		accessorKey: "description",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="説明" />
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
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
