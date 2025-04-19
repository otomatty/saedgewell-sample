'use client';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { ArrowRightIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { useUpdateUser } from '@kit/supabase/hooks/use-update-user-mutation';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Heading } from '@kit/ui/heading';
import { Input } from '@kit/ui/input';

import { PasswordResetSchema } from '../schemas/password-reset.schema';

/**
 * @name UpdatePasswordForm
 * @description
 * パスワードリセット後の新しいパスワード設定フォームコンポーネント。
 * ユーザーが新しいパスワードを入力し、アカウントのパスワードを更新する機能を提供する。
 *
 * @features
 * - 新しいパスワード入力フィールド
 * - パスワード確認入力フィールド
 * - Zodスキーマによるフォームバリデーション
 * - 成功/エラー状態の表示
 * - リダイレクト機能
 *
 * @dependencies
 * - react-hook-form: フォーム状態管理
 * - zod: バリデーションスキーマ
 * - @kit/supabase/hooks/use-update-user-mutation: ユーザー情報更新フック
 *
 * @childComponents
 * - SuccessState: 成功状態表示コンポーネント
 * - ErrorState: エラー状態表示コンポーネント
 *
 * @param {Object} params
 * @param {string} params.redirectTo - パスワード更新成功後のリダイレクト先
 *
 * @example
 * ```tsx
 * <UpdatePasswordForm
 *   redirectTo="/auth/login"
 * />
 * ```
 */
export function UpdatePasswordForm(params: { redirectTo: string }) {
  const updateUser = useUpdateUser();

  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      password: '',
      repeatPassword: '',
    },
  });

  if (updateUser.error) {
    return <ErrorState onRetry={() => updateUser.reset()} />;
  }

  if (updateUser.data && !updateUser.isPending) {
    return <SuccessState redirectTo={params.redirectTo} />;
  }

  return (
    <div className={'flex w-full flex-col space-y-6'}>
      <div className={'flex justify-center'}>
        <Heading level={5} className={'tracking-tight'}>
          パスワードをリセット
        </Heading>
      </div>

      <Form {...form}>
        <form
          className={'flex w-full flex-1 flex-col'}
          onSubmit={form.handleSubmit(({ password }) => {
            return updateUser.mutateAsync({
              password,
              redirectTo: params.redirectTo,
            });
          })}
        >
          <div className={'flex-col space-y-4'}>
            <FormField
              name={'password'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード</FormLabel>

                  <FormControl>
                    <Input required type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={'repeatPassword'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワードの確認</FormLabel>

                  <FormControl>
                    <Input required type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={updateUser.isPending}
              type="submit"
              className={'w-full'}
            >
              パスワードをリセット
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function SuccessState(props: { redirectTo: string }) {
  return (
    <div className={'flex flex-col space-y-4'}>
      <Alert variant={'success'}>
        <CheckIcon className={'s-6'} />

        <AlertTitle>パスワードを更新しました</AlertTitle>

        <AlertDescription>パスワードが正常に更新されました</AlertDescription>
      </Alert>

      <Link href={props.redirectTo}>
        <Button variant={'outline'} className={'w-full'}>
          <span>ホームページに戻る</span>

          <ArrowRightIcon className={'ml-2 h-4'} />
        </Button>
      </Link>
    </div>
  );
}

function ErrorState(props: { onRetry: () => void }) {
  return (
    <div className={'flex flex-col space-y-4'}>
      <Alert variant={'destructive'}>
        <ExclamationTriangleIcon className={'s-6'} />

        <AlertTitle>エラーが発生しました</AlertTitle>

        <AlertDescription>
          パスワードのリセットに失敗しました。もう一度お試しください。
        </AlertDescription>
      </Alert>

      <Button onClick={props.onRetry} variant={'outline'}>
        やり直す
      </Button>
    </div>
  );
}
