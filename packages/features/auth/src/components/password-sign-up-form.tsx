'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { If } from '@kit/ui/if';
import { Input } from '@kit/ui/input';

import { PasswordSignUpSchema } from '../schemas/password-sign-up.schema';
import { TermsAndConditionsFormField } from './terms-and-conditions-form-field';

/**
 * @name PasswordSignUpForm
 * @description
 * メールアドレスとパスワードを使用したサインアップ（新規登録）フォームコンポーネント。
 * React Hook Formを使用してフォームの状態管理と検証を行う。
 *
 * @features
 * - Zodスキーマによるフォームバリデーション
 * - メールアドレス入力フィールド
 * - パスワード入力フィールド
 * - パスワード確認入力フィールド
 * - オプションの利用規約チェックボックス
 * - ローディング状態の表示
 * - 送信ボタン
 *
 * @dependencies
 * - react-hook-form: フォーム状態管理
 * - zod: バリデーションスキーマ
 * - @kit/ui: UIコンポーネント
 *
 * @param {Object} props
 * @param {Object} [props.defaultValues] - フォームのデフォルト値
 * @param {string} [props.defaultValues.email] - デフォルトのメールアドレス
 * @param {boolean} [props.displayTermsCheckbox] - 利用規約チェックボックスを表示するか
 * @param {Function} props.onSubmit - フォーム送信時のコールバック関数
 * @param {boolean} props.loading - ローディング状態
 *
 * @example
 * ```tsx
 * <PasswordSignUpForm
 *   defaultValues={{ email: 'user@example.com' }}
 *   displayTermsCheckbox={true}
 *   onSubmit={handleSignUp}
 *   loading={isLoading}
 * />
 * ```
 */
export function PasswordSignUpForm({
  defaultValues,
  displayTermsCheckbox,
  onSubmit,
  loading,
}: {
  defaultValues?: {
    email: string;
  };

  displayTermsCheckbox?: boolean;

  onSubmit: (params: {
    email: string;
    password: string;
    repeatPassword: string;
  }) => unknown;
  loading: boolean;
}) {
  const form = useForm({
    resolver: zodResolver(PasswordSignUpSchema),
    defaultValues: {
      email: defaultValues?.email ?? '',
      password: '',
      repeatPassword: '',
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={'repeatPassword'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワードの確認</FormLabel>

              <FormControl>
                <Input
                  required
                  data-test={'repeat-password-input'}
                  type="password"
                  placeholder={''}
                  {...field}
                />
              </FormControl>

              <FormMessage />

              <FormDescription className={'pb-2 text-xs'}>
                確認のため、パスワードをもう一度入力してください
              </FormDescription>
            </FormItem>
          )}
        />

        <If condition={displayTermsCheckbox}>
          <TermsAndConditionsFormField />
        </If>

        <Button
          data-test={'auth-submit-button'}
          className={'w-full'}
          type="submit"
          disabled={loading}
        >
          <If
            condition={loading}
            fallback={
              <>
                メールアドレスで新規登録
                <ArrowRight
                  className={
                    'zoom-in animate-in slide-in-from-left-2 fill-mode-both h-4 delay-500 duration-500'
                  }
                />
              </>
            }
          >
            登録中...
          </If>
        </Button>
      </form>
    </Form>
  );
}
