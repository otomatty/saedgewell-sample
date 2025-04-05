import type React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  WorkFormSchema,
  type WorkFormData,
} from '../../app/(protected)/works/_components/schemas'; // Zodスキーマと型をインポート
// import BasicInfoSection from './basic-info-section';
// import DetailsSection from './details-section';
// import ImageManager from './image-manager';
// import SaveButton from './save-button';
// import { createWork } from '@/actions/works'; // Server Action (仮)
import { toast } from 'sonner';
import { Button } from '@kit/ui/button'; // SaveButton の代わり

/**
 * @interface WorkFormProps
 * @description WorkForm コンポーネントの Props 型定義。
 * @property {WorkFormData} [initialData] - 編集時に初期表示するデータ。
 * @property {(data: WorkFormData) => Promise<void>} [onSubmit] - フォーム送信時の処理 (オプショナルに変更)。
 */
interface WorkFormProps {
  initialData?: WorkFormData;
  onSubmit?: (data: WorkFormData) => Promise<void>; // オプショナルに変更
}

/**
 * @function WorkForm
 * @description 実績データの作成・編集フォームコンポーネント。
 * react-hook-form, zodResolver, FormProvider を使用。
 * @param {WorkFormProps} props - コンポーネントの Props。
 * @returns {React.ReactElement} フォーム。
 */
const WorkForm: React.FC<WorkFormProps> = ({ initialData }) => {
  const form = useForm<WorkFormData>({
    resolver: zodResolver(WorkFormSchema),
    defaultValues: initialData || {
      // 新規作成時のデフォルト値
      title: '',
      images: [],
      // 他のフィールドのデフォルト値...
    },
  });

  const internalOnSubmit = async (data: WorkFormData) => {
    console.log('Form data submitted:', data);
    try {
      // TODO: Server Action (createWork または updateWork) を呼び出す
      // await createWork(data);
      toast.success('実績を保存しました。');
      // TODO: 保存後のリダイレクトやフォームのリセット処理
    } catch (error) {
      console.error('Failed to save work:', error);
      toast.error('保存に失敗しました。');
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(internalOnSubmit)}
        className="space-y-8"
      >
        {/* TODO: BasicInfoSection コンポーネントを実装・配置 */}
        <div className="p-4 border rounded-lg">
          [BasicInfoSection Placeholder]
        </div>

        {/* TODO: DetailsSection コンポーネントを実装・配置 */}
        <div className="p-4 border rounded-lg">
          [DetailsSection Placeholder]
        </div>

        {/* TODO: ImageManager コンポーネントを配置 */}
        {/* ImageManager は useFormContext を使うので props は不要 */}
        {/* <ImageManager /> */}
        <div className="p-4 border rounded-lg">[ImageManager Placeholder]</div>

        {/* TODO: SaveButton コンポーネントを実装・配置 */}
        {/* <SaveButton isSubmitting={form.formState.isSubmitting} /> */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? '保存中...' : '保存'}
        </Button>
      </form>
    </FormProvider>
  );
};

export default WorkForm;
