import type React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Textarea } from '@kit/ui/textarea';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import type { WorkFormData } from '../../app/(protected)/works/_components/schemas';

/**
 * @function DetailsSection
 * @description 実績フォームの詳細情報セクション。
 * 説明文などを入力します。
 * @returns {React.ReactElement} 詳細情報セクションのフォーム要素。
 */
const DetailsSection: React.FC = () => {
  const { control } = useFormContext<WorkFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>詳細情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="description" // WorkFormData のキーと一致させる
          render={({ field }) => (
            <FormItem>
              <FormLabel>説明文</FormLabel>
              <FormControl>
                {/* Textarea に rows を指定して高さを調整 */}
                <Textarea
                  placeholder="実績の詳細な説明を入力..."
                  className="min-h-[100px]" // 例: 最低高さを設定
                  rows={5} // 表示行数の目安
                  {...field}
                />
              </FormControl>
              <FormDescription>
                実績の詳細ページで表示される説明文です（任意）。Markdown
                記法が使えるようにするかも？
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TODO: 他の詳細情報フィールド (例: 使用技術の選択、関連リンク) を追加 */}
        {/* ここで MultiSelectCombobox や EditableList を使うことを想定 */}
        <div className="p-4 border rounded-lg text-muted-foreground">
          [Placeholder for technologies (MultiSelectCombobox)]
        </div>
        <div className="p-4 border rounded-lg text-muted-foreground">
          [Placeholder for related links (EditableList)]
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsSection;
