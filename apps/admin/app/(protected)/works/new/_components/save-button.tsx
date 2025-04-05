'use client'; // isLoading プロパティによる表示制御のため

/**
 * @file フォーム保存ボタンコンポーネント。
 * @description フォームの内容を送信するためのボタンです。
 * 送信中のローディング状態を表示できます。
 */

import React from 'react';
import { Button } from '@kit/ui/button';
import { Loader2 } from 'lucide-react';

// TODO: Propsを定義する
interface SaveButtonProps {
  isLoading?: boolean; // ローディング状態
}

/**
 * フォーム送信用の保存ボタン
 * ローディング状態に応じてスピナーを表示
 */
const SaveButton = ({ isLoading = false }: SaveButtonProps) => {
  return (
    <div className="flex justify-end pt-6 border-t">
      <Button type="submit" size="lg" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            保存中...
          </>
        ) : (
          '保存する'
        )}
      </Button>
    </div>
  );
};

export default SaveButton;
