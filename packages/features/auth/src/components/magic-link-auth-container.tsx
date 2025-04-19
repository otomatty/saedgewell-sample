'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useSignInWithOtp } from '@kit/supabase/hooks/use-sign-in-with-otp';
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
import { If } from '@kit/ui/if';
import { Input } from '@kit/ui/input';

import { useCaptchaToken } from '../captcha/client';
import { TermsAndConditionsFormField } from './terms-and-conditions-form-field';

/**
 * @name MagicLinkAuthContainer
 * @description
 * マジックリンク認証（メールリンク認証）のコンテナコンポーネント。
 * ユーザーのメールアドレスを入力し、認証リンクを送信する機能を提供する。
 *
 * @features
 * - メールアドレス入力フォーム
 * - CAPTCHAトークンの管理
 * - Supabaseを使用したOTP（ワンタイムパスワード）認証
 * - 送信成功/エラー表示
 * - オプションの利用規約チェックボックス
 * - トースト通知
 *
 * @dependencies
 * - react-hook-form: フォーム状態管理
 * - zod: バリデーションスキーマ
 * - @kit/supabase/hooks/use-sign-in-with-otp: SupabaseのOTP認証フック
 * - sonner: トースト通知ライブラリ
 *
 * @childComponents
 * - SuccessAlert: 成功通知コンポーネント
 * - ErrorAlert: エラー通知コンポーネント
 * - TermsAndConditionsFormField: 利用規約チェックボックスコンポーネント
 *
 * @param {Object} props
 * @param {string} props.redirectUrl - 認証後のリダイレクトURL
 * @param {boolean} props.shouldCreateUser - 新規ユーザーを作成するかどうか
 * @param {boolean} [props.displayTermsCheckbox] - 利用規約チェックボックスを表示するか
 * @param {Object} [props.defaultValues] - フォームのデフォルト値
 * @param {string} [props.defaultValues.email] - デフォルトのメールアドレス
 *
 * @example
 * ```tsx
 * <MagicLinkAuthContainer
 *   redirectUrl="https://example.com/auth/callback"
 *   shouldCreateUser={true}
 *   displayTermsCheckbox={true}
 * />
 * ```
 */
export function MagicLinkAuthContainer({
  redirectUrl,
  shouldCreateUser,
  defaultValues,
  displayTermsCheckbox,
}: {
  redirectUrl: string;
  shouldCreateUser: boolean;
  displayTermsCheckbox?: boolean;

  defaultValues?: {
    email: string;
  };
}) {
  const { captchaToken, resetCaptchaToken } = useCaptchaToken();
  const signInWithOtpMutation = useSignInWithOtp();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email(),
      })
    ),
    defaultValues: {
      email: defaultValues?.email ?? '',
    },
  });

  const onSubmit = ({ email }: { email: string }) => {
    const url = new URL(redirectUrl);
    const emailRedirectTo = url.href;

    const promise = async () => {
      await signInWithOtpMutation.mutateAsync({
        email,
        options: {
          emailRedirectTo,
          captchaToken,
          shouldCreateUser,
        },
      });
    };

    toast.promise(promise, {
      loading: 'メールを送信中...',
      success: 'メールを送信しました。メールボックスをご確認ください。',
      error: 'メールの送信に失敗しました。もう一度お試しください。',
    });

    resetCaptchaToken();
  };

  if (signInWithOtpMutation.data) {
    return <SuccessAlert />;
  }

  return (
    <Form {...form}>
      <form className={'w-full'} onSubmit={form.handleSubmit(onSubmit)}>
        <If condition={signInWithOtpMutation.error}>
          <ErrorAlert />
        </If>

        <div className={'flex flex-col space-y-4'}>
          <FormField
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
            name={'email'}
          />

          <If condition={displayTermsCheckbox}>
            <TermsAndConditionsFormField />
          </If>

          <Button disabled={signInWithOtpMutation.isPending}>
            <If
              condition={signInWithOtpMutation.isPending}
              fallback={'ログインリンクを送信'}
            >
              送信中...
            </If>
          </Button>
        </div>
      </form>
    </Form>
  );
}

function SuccessAlert() {
  return (
    <Alert variant={'success'}>
      <CheckIcon className={'h-4'} />

      <AlertTitle>メールを送信しました</AlertTitle>

      <AlertDescription>
        メールボックスをご確認ください。ログインリンクをクリックしてログインを完了してください。
      </AlertDescription>
    </Alert>
  );
}

function ErrorAlert() {
  return (
    <Alert variant={'destructive'}>
      <ExclamationTriangleIcon className={'h-4'} />

      <AlertTitle>エラーが発生しました</AlertTitle>

      <AlertDescription>
        メールの送信に失敗しました。もう一度お試しください。
      </AlertDescription>
    </Alert>
  );
}
