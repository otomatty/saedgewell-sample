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
} from "../../alert-dialog";

interface DataTableDeleteDialogProps<TData> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDelete: (row: TData) => Promise<void>;
	row: TData;
}

/**
 * データテーブルの削除確認ダイアログ
 *
 * @description
 * このコンポーネントは行の削除前に確認ダイアログを表示します。
 * ユーザーは削除を確認または取り消すことができます。
 *
 * @example
 * ```tsx
 * <DataTableDeleteDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   onDelete={handleDelete}
 *   row={row}
 * />
 * ```
 */
export function DataTableDeleteDialog<TData>({
	open,
	onOpenChange,
	onDelete,
	row,
}: DataTableDeleteDialogProps<TData>) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
					<AlertDialogDescription>
						この操作は取り消すことができません。
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>キャンセル</AlertDialogCancel>
					<AlertDialogAction
						onClick={async (e) => {
							e.preventDefault();
							await onDelete(row);
							onOpenChange(false);
						}}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						削除
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
