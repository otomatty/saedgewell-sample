import type React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@kit/ui/button';
import { Loader2 } from 'lucide-react';

/**
 * @function SaveButton
 * @description フォームの保存ボタン。
 * 送信中のローディング状態を表示します。
 * @returns {React.ReactElement} 保存ボタン。
 */
const SaveButton: React.FC = () => {
  // useFormState を使って isSubmitting を取得する方が望ましい
  const { formState } = useFormContext();
  const isSubmitting = formState.isSubmitting;

  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          保存中...
        </>
      ) : (
        '保存'
      )}
    </Button>
  );
};

export default SaveButton;
