'use client';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

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

import { PasswordSignInSchema } from '../schemas/password-sign-in.schema';

/**
 * @name PasswordSignInForm
 * @description
 * メールアドレスとパスワードを使用したサインインフォームコンポーネント。
 * React Hook Formを使用してフォームの状態管理と検証を行う。
 *
 * @features
 * - Zodスキーマによるフォームバリデーション
 * - メールアドレス入力フィールド
 * - パスワード入力フィールド
 * - パスワードリセットへのリンク
 * - ローディング状態の表示
 * - 送信ボタン
 *
 * @dependencies
 * - react-hook-form: フォーム状態管理
 * - zod: バリデーションスキーマ
 * - @kit/ui: UIコンポーネント
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - フォーム送信時のコールバック関数
 * @param {boolean} props.loading - ローディング状態
 *
 * @example
 * ```tsx
 * <PasswordSignInForm
 *   onSubmit={handleSignIn}
 *   loading={isLoading}
 * />
 * ```
 */
export function PasswordSignInForm({
  onSubmit,
  loading,
}: {
  onSubmit: (params: z.infer<typeof PasswordSignInSchema>) => unknown;
  loading: boolean;
}) {
  const form = useForm<z.infer<typeof PasswordSignInSchema>>({
    resolver: zodResolver(PasswordSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Form {...form}>
      <form
        className={'w-full space-y-2.5'}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name={'email'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>

              <FormControl>
                <Input
                  data-test={'email-input'}
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

        <FormField
          control={form.control}
          name={'password'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード</FormLabel>

              <FormControl>
                <Input
                  required
                  data-test={'password-input'}
                  type="password"
                  placeholder={''}
                  {...field}
                />
              </FormControl>

              <FormMessage />

              <Button
                asChild
                type={'button'}
                size={'sm'}
                variant={'link'}
                className={'text-xs'}
              >
                <Link href={'/auth/password-reset'}>
                  パスワードをお忘れですか？
                </Link>
              </Button>
            </FormItem>
          )}
        />

        <Button
          data-test="auth-submit-button"
          className={'group w-full'}
          type="submit"
          disabled={loading}
        >
          <If
            condition={loading}
            fallback={
              <>
                メールアドレスでログイン
                <ArrowRight
                  className={
                    'zoom-in animate-in slide-in-from-left-2 fill-mode-both h-4 delay-500 duration-500'
                  }
                />
              </>
            }
          >
            ログイン中...
          </If>
        </Button>
      </form>
    </Form>
  );
}
