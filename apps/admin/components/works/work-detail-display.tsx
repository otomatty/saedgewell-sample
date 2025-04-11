import type React from 'react';
import type { WorkDetailData } from '../../app/(protected)/works/_components/schemas'; // WorkDetailData 型をインポート
// import { WorkFormData } from './schemas'; // Zod スキーマから生成した型
// import InlineEditableField from './inline-editable-field';
// import ImageManager from './image-manager';
// import EditableList from './editable-list';
// import MultiSelectCombobox from './multi-select-combobox';
// import ConfirmationDialog from './confirmation-dialog';
// import { Button } from '@kit/ui/button';
// import { Trash2 } from 'lucide-react';
// import { updateWorkField, deleteWork } from '@/actions/works'; // Server Actions (仮)
// import { toast } from 'sonner';

interface WorkDetailDisplayProps {
  workDetails: WorkDetailData; // 型を WorkDetailData に変更
}

/**
 * @function WorkDetailDisplay
 * @description 実績の詳細情報を表示・編集するコンポーネント。
 * 各フィールドは InlineEditableField で編集可能にする想定。
 * @param {WorkDetailDisplayProps} props - コンポーネントの Props。
 * @returns {React.ReactElement} 実績詳細表示。
 */
const WorkDetailDisplay: React.FC<WorkDetailDisplayProps> = ({
  workDetails,
}) => {
  // TODO: InlineEditableField 用の保存ハンドラ (field の型も WorkDetailData に合わせる)
  // const handleSaveField = async (field: keyof WorkDetailData, value: any) => {
  //   try {
  //     await updateWorkField(workDetails.id, field, value);
  //     toast.success(`${field} を更新しました。`);
  //     // TODO: データ再取得 or キャッシュ更新
  //   } catch (error) {
  //     toast.error("更新に失敗しました。");
  //     console.error(error);
  //   }
  // };

  // TODO: 削除処理用ハンドラ
  // const handleDeleteWork = async () => { ... };

  return (
    <div className="space-y-6">
      {/* --- 基本情報エリア --- */}
      <div>
        <h1 className="text-3xl font-bold mb-4">
          {/* タイトル (インライン編集可能) */}
          {/* <InlineEditableField
            initialValue={workDetails.title}
            onSave={(value) => handleSaveField('title', value)}
            label="タイトル"
            required
          /> */}
          [Title: {workDetails.title}]
        </h1>
        <p className="text-muted-foreground">
          [Published Date:{' '}
          {workDetails.publishedAt?.toLocaleDateString() ?? '-'}]
        </p>
      </div>

      {/* --- 画像管理エリア --- */}
      <div>
        <h2 className="text-xl font-semibold mb-3">画像</h2>
        {/* TODO: ImageManager を詳細表示・編集モードで組み込む */}
        {/* ImageManager はフォームとは独立して、画像の追加/削除/並び替え/メタデータ編集を行い、都度 Server Action を呼ぶ想定 */}
        {/* <ImageManager images={workDetails.images} workId={workDetails.id} /> */}
        <div className="p-4 border rounded-lg text-muted-foreground">
          [ImageManager Placeholder for Details]
          <pre>{JSON.stringify(workDetails.images, null, 2)}</pre>
        </div>
      </div>

      {/* --- 詳細説明エリア --- */}
      <div>
        <h2 className="text-xl font-semibold mb-3">説明</h2>
        {/* 説明文 (インライン編集可能、Markdown対応?) */}
        {/* <InlineEditableField
          initialValue={workDetails.description}
          onSave={(value) => handleSaveField('description', value)}
          label="説明文"
          inputType="textarea"
        /> */}
        <div className="p-4 border rounded-lg">
          [Description: {workDetails.description ?? '-'}]
        </div>
      </div>

      {/* --- 技術・スキルエリア --- */}
      <div>
        <h2 className="text-xl font-semibold mb-3">使用技術</h2>
        {/* TODO: MultiSelectCombobox を詳細表示・編集モードで組み込む */}
        {/* 選択肢の変更は都度 Server Action を呼ぶ想定 */}
        {/* <MultiSelectCombobox selectedItems={workDetails.technologies} workId={workDetails.id} /> */}
        <div className="p-4 border rounded-lg text-muted-foreground">
          [MultiSelectCombobox Placeholder for Technologies]
        </div>
      </div>

      {/* --- 関連リンクエリア --- */}
      <div>
        <h2 className="text-xl font-semibold mb-3">関連リンク</h2>
        {/* TODO: EditableList を詳細表示・編集モードで組み込む */}
        {/* リスト項目の追加/削除/編集/並び替えは都度 Server Action を呼ぶ想定 */}
        {/* <EditableList items={workDetails.links} workId={workDetails.id} /> */}
        <div className="p-4 border rounded-lg text-muted-foreground">
          [EditableList Placeholder for Related Links]
        </div>
      </div>

      {/* --- 削除ボタンエリア --- */}
      <div className="pt-8 border-t">
        <h2 className="text-xl font-semibold text-destructive mb-3">
          実績の削除
        </h2>
        {/* TODO: 削除ボタンと ConfirmationDialog を連携させる */}
        {/* <Button variant="destructive" onClick={() => setIsConfirmOpen(true)}>実績を削除</Button> */}
        {/* <ConfirmationDialog ... /> */}
        <div className="p-4 border rounded-lg text-muted-foreground">
          [Delete Button & Confirmation Placeholder]
        </div>
      </div>
    </div>
  );
};

export default WorkDetailDisplay;
