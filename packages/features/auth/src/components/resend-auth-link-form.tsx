'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';

import { useCaptchaToken } from '../captcha/client';

/**
 * @name ResendAuthLinkForm
 * @description
 * 認証リンク（サインアップ確認メールなど）の再送信フォームコンポーネント。
 * ユーザーがメールアドレスを入力し、認証リンクを再送信する機能を提供する。
 *
 * @features
 * - メールアドレス入力フォーム
 * - CAPTCHAトークンの管理
 * - Supabaseを使用した認証リンク再送信機能
 * - 送信成功表示
 * - リダイレクトパスの設定
 *
 * @dependencies
 * - react-hook-form: フォーム状態管理
 * - zod: バリデーションスキーマ
 * - @tanstack/react-query: データフェッチングライブラリ
 * - @kit/supabase/hooks/use-supabase: Supabaseクライアントフック
 *
 * @param {Object} props
 * @param {string} [props.redirectPath] - 認証後のリダイレクトパス
 *
 * @example
 * ```tsx
 * <ResendAuthLinkForm redirectPath="/auth/confirm" />
 * ```
 */
export function ResendAuthLinkForm(props: { redirectPath?: string }) {
  const resendLink = useResendLink();

  const form = useForm({
    resolver: zodResolver(z.object({ email: z.string().email() })),
    defaultValues: {
      email: '',
    },
  });

  if (resendLink.data && !resendLink.isPending) {
    return (
      <Alert variant={'success'}>
        <AlertTitle>メールを再送信しました</AlertTitle>

        <AlertDescription>メールボックスをご確認ください。</AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form
        className={'flex flex-col space-y-2'}
        onSubmit={form.handleSubmit((data) => {
          return resendLink.mutate({
            email: data.email,
            redirectPath: props.redirectPath,
          });
        })}
      >
        <FormField
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>

                <FormControl>
                  <Input type="email" required {...field} />
                </FormControl>
              </FormItem>
            );
          }}
          name={'email'}
        />

        <Button disabled={resendLink.isPending}>認証メールを再送信</Button>
      </form>
    </Form>
  );
}

function useResendLink() {
  const supabase = useSupabase();
  const { captchaToken } = useCaptchaToken();

  const mutationFn = async (props: {
    email: string;
    redirectPath?: string;
  }) => {
    const response = await supabase.auth.resend({
      email: props.email,
      type: 'signup',
      options: {
        emailRedirectTo: props.redirectPath,
        captchaToken,
      },
    });

    if (response.error) {
      throw response.error;
    }

    return response.data;
  };

  return useMutation({
    mutationFn,
  });
}
