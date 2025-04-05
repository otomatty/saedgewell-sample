import type { Table, Column } from "@tanstack/react-table";

export interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	filterableColumns?: {
		id: string;
		title: string;
		options: {
			label: string;
			value: string;
		}[];
	}[];
	searchableColumns?: {
		id: string;
		title: string;
	}[];
	create?: {
		content: React.ReactNode;
	};
}

export interface DataTablePaginationProps<TData> {
	table: Table<TData>;
}

export interface DataTableRowActionsProps<TData> {
	row: TData;
	onEdit?: (row: TData) => Promise<void>;
	onDelete?: (row: TData) => Promise<void>;
	editForm?: React.ReactNode;
	editTitle?: string;
}

export interface DataTableDeleteDialogProps<TData> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDelete: (row: TData) => Promise<void>;
	row: TData;
}

export interface DataTableEditDialogProps<TData> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onEdit: (row: TData) => Promise<void>;
	row: TData;
	title?: string;
	children: React.ReactNode;
}

export interface DataTableHeaderProps<TData> {
	column: Column<TData>;
	title: string;
	className?: string;
}

export interface DataTableFilterProps<TData> {
	column: Column<TData>;
	title: string;
	options: {
		label: string;
		value: string;
	}[];
}

export interface DataTableSearchProps<TData> {
	column: Column<TData>;
	title: string;
}
