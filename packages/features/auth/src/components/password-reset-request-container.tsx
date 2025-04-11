'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRequestResetPassword } from '@kit/supabase/hooks/use-request-reset-password';
import { Alert, AlertDescription } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { If } from '@kit/ui/if';
import { Input } from '@kit/ui/input';

import { useCaptchaToken } from '../captcha/client';
import { AuthErrorAlert } from './auth-error-alert';

/**
 * @name PasswordResetRequestContainer
 * @description
 * パスワードリセットリクエストを処理するコンテナコンポーネント。
 * ユーザーのメールアドレスを入力し、パスワードリセットリンクを送信する機能を提供する。
 *
 * @features
 * - メールアドレス入力フォーム
 * - CAPTCHAトークンの管理
 * - Supabaseを使用したパスワードリセット機能
 * - 送信成功/エラー表示
 * - リダイレクトパスの設定
 *
 * @dependencies
 * - react-hook-form: フォーム状態管理
 * - zod: バリデーションスキーマ
 * - @kit/supabase/hooks/use-request-reset-password: パスワードリセットリクエストフック
 *
 * @childComponents
 * - AuthErrorAlert: エラー表示コンポーネント
 *
 * @param {Object} params
 * @param {string} params.redirectPath - パスワードリセット後のリダイレクトパス
 *
 * @example
 * ```tsx
 * <PasswordResetRequestContainer
 *   redirectPath="/auth/reset-password/confirm"
 * />
 * ```
 */
const PasswordResetSchema = z.object({
  email: z.string().email(),
});

export function PasswordResetRequestContainer(params: {
  redirectPath: string;
}) {
  const resetPasswordMutation = useRequestResetPassword();
  const { captchaToken, resetCaptchaToken } = useCaptchaToken();

  const error = resetPasswordMutation.error;
  const success = resetPasswordMutation.data;

  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <>
      <If condition={success}>
        <Alert variant={'success'}>
          <AlertDescription>
            パスワードリセットのメールを送信しました。メールボックスをご確認ください。
          </AlertDescription>
        </Alert>
      </If>

      <If condition={!resetPasswordMutation.data}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(({ email }) => {
              const redirectTo = new URL(
                params.redirectPath,
                window.location.origin
              ).href;

              return resetPasswordMutation
                .mutateAsync({
                  email,
                  redirectTo,
                  captchaToken,
                })
                .catch(() => {
                  resetCaptchaToken();
                });
            })}
            className={'w-full'}
          >
            <div className={'flex flex-col space-y-4'}>
              <div>
                <p className={'text-muted-foreground text-sm'}>
                  パスワードをリセットするためのメールを送信します。
                </p>
              </div>

              <AuthErrorAlert error={error} />

              <FormField
                name={'email'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>

                    <FormControl>
                      <Input
                        required
                        type="email"
                        placeholder={'example@example.com'}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={resetPasswordMutation.isPending} type="submit">
                パスワードをリセット
              </Button>
            </div>
          </form>
        </Form>
      </If>
    </>
  );
}
