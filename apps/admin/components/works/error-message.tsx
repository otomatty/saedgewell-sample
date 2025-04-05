/**
 * @file エラーメッセージ表示コンポーネント。
 * @description データ取得失敗時やバリデーションエラー時などに使用します。
 * shadcn/ui/alert を利用します。
 */

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { AlertTriangle } from 'lucide-react'; // アイコン例

/**
 * ErrorMessage コンポーネントの Props
 */
interface ErrorMessageProps {
  /** オプション: エラータイトル (デフォルト: 'エラー') */
  title?: string;
  /** 表示するエラーメッセージ本文 */
  message: string;
  /** アラートのスタイル (デフォルト: 'destructive') */
  variant?: 'default' | 'destructive';
  /** オプション: 追加のCSSクラス */
  className?: string;
}

/**
 * エラーメッセージを表示するコンポーネント。
 * shadcn/ui の Alert を使用します。
 */
const ErrorMessage = ({
  title = 'エラー',
  message,
  variant = 'destructive',
  className,
}: ErrorMessageProps) => {
  return (
    <Alert variant={variant} className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ErrorMessage;
