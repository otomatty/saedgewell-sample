'use client';

import { ResponsiveDialog } from '../../../custom/responsive-dialog';

interface DataTableEditDialogProps<TData> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (row: TData) => Promise<void>;
  row: TData;
  title?: string;
  children: React.ReactNode;
}

/**
 * データテーブルの編集ダイアログ
 *
 * @description
 * このコンポーネントは行の編集用のダイアログを表示します。
 * ResponsiveDialogを使用して、モバイルではドロワー、デスクトップではダイアログとして表示されます。
 * 編集フォームの内容は子要素として渡します。
 *
 * @example
 * ```tsx
 * <DataTableEditDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   onEdit={handleEdit}
 *   row={row}
 *   title="編集"
 * >
 *   <EditForm row={row} onSubmit={handleSubmit} />
 * </DataTableEditDialog>
 * ```
 */
export function DataTableEditDialog<TData>({
  title = '編集',
  children,
}: DataTableEditDialogProps<TData>) {
  return (
    <ResponsiveDialog title={title} trigger={null} description={title}>
      {children}
    </ResponsiveDialog>
  );
}
