import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';

/**
 * @name AuthErrorAlert
 * @description
 * 認証プロセス中に発生したエラーを表示するアラートコンポーネント。
 * Supabaseから返されるエラーコードを受け取り、ユーザーフレンドリーなエラーメッセージを表示する。
 *
 * @features
 * - エラーがない場合は何も表示しない
 * - デフォルトのエラーメッセージを提供
 * - 視覚的に目立つデザイン（赤色の警告スタイル）
 * - アイコン付きの警告表示
 *
 * @param {Object} props
 * @param {Error|null|undefined|string} props.error - Supabaseから返されるエラー
 * このエラーは翻訳ファイルのauth:errors.{error}からマッピングされる
 * エラーメッセージを更新するには、翻訳ファイルを更新する必要がある
 * https://github.com/supabase/gotrue-js/blob/master/src/lib/errors.ts
 *
 * @example
 * ```tsx
 * <AuthErrorAlert error={signInMutation.error} />
 * ```
 */
export function AuthErrorAlert({
  error,
}: {
  error: Error | null | undefined | string;
}) {
  if (!error) {
    return null;
  }

  const DefaultError = 'エラーが発生しました。もう一度お試しください。';

  return (
    <Alert variant={'destructive'}>
      <ExclamationTriangleIcon className={'w-4'} />

      <AlertTitle>認証エラー</AlertTitle>

      <AlertDescription data-test={'auth-error-message'}>
        {DefaultError}
      </AlertDescription>
    </Alert>
  );
}
