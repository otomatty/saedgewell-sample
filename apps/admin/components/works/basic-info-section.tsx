import type React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Label } from '@kit/ui/label';
import { Input } from '@kit/ui/input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form'; // shadcn/ui の Form コンポーネント
// import { DatePicker } from '@kit/ui/datepicker'; // DatePicker コンポーネント (仮)
import type { WorkFormData } from '../../app/(protected)/works/_components/schemas';

/**
 * @function BasicInfoSection
 * @description 実績フォームの基本情報セクション。
 * タイトル、公開日などを入力します。
 * @returns {React.ReactElement} 基本情報セクションのフォーム要素。
 */
const BasicInfoSection: React.FC = () => {
  const { control } = useFormContext<WorkFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>基本情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="title" // WorkFormData のキーと一致させる
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input placeholder="実績のタイトルを入力" {...field} />
              </FormControl>
              <FormDescription>
                一覧や詳細で表示されるタイトルです。
              </FormDescription>
              <FormMessage /> {/* バリデーションエラー表示 */}
            </FormItem>
          )}
        />

        {/* TODO: 公開日 (DatePicker) フィールドを追加 */}
        {/* <FormField
          control={control}
          name="publishedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>公開日</FormLabel>
              <FormControl>
                 <DatePicker 
                   value={field.value} 
                   onChange={field.onChange} 
                   placeholder="公開日を選択"
                 />
              </FormControl>
              <FormDescription>実績を公開する日付です（任意）。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <div className="p-4 border rounded-lg text-muted-foreground">
          [DatePicker Placeholder for publishedAt]
        </div>

        {/* TODO: 他の基本情報フィールド (例: カテゴリ選択、スラッグ) を追加 */}
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
