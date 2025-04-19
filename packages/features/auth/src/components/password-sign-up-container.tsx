'use client';

import { useCallback, useRef, useState } from 'react';

import { CheckCircledIcon } from '@radix-ui/react-icons';

import { useSignUpWithEmailAndPassword } from '@kit/supabase/hooks/use-sign-up-with-email-password';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { If } from '@kit/ui/if';

import { useCaptchaToken } from '../captcha/client';
import { AuthErrorAlert } from './auth-error-alert';
import { PasswordSignUpForm } from './password-sign-up-form';

/**
 * @name EmailPasswordSignUpContainer
 * @description
 * メールアドレスとパスワードを使用したサインアップ（新規登録）のコンテナコンポーネント。
 * Supabaseの認証機能と連携し、実際のサインアップ処理を行う。
 *
 * @features
 * - CAPTCHAトークンの管理
 * - Supabaseを使用したメール/パスワード登録
 * - エラー表示
 * - 登録成功時の確認メール送信通知
 * - サインアップ成功時のコールバック処理
 *
 * @dependencies
 * - @kit/supabase/hooks/use-sign-up-with-email-password: Supabaseサインアップフック
 * - ../captcha/client: CAPTCHAトークン管理
 *
 * @childComponents
 * - AuthErrorAlert: エラー表示コンポーネント
 * - PasswordSignUpForm: サインアップフォームコンポーネント
 * - SuccessAlert: 成功通知コンポーネント
 *
 * @param {EmailPasswordSignUpContainerProps} props
 * @param {boolean} [props.displayTermsCheckbox] - 利用規約チェックボックスを表示するか
 * @param {Object} [props.defaultValues] - フォームのデフォルト値
 * @param {string} [props.defaultValues.email] - デフォルトのメールアドレス
 * @param {Function} [props.onSignUp] - サインアップ成功時のコールバック関数
 * @param {string} props.emailRedirectTo - 確認メールのリダイレクトURL
 *
 * @example
 * ```tsx
 * <EmailPasswordSignUpContainer
 *   emailRedirectTo="https://example.com/auth/callback"
 *   displayTermsCheckbox={true}
 *   onSignUp={(userId) => console.log(`User ${userId} signed up`)}
 * />
 * ```
 */
interface EmailPasswordSignUpContainerProps {
  displayTermsCheckbox?: boolean;
  defaultValues?: {
    email: string;
  };

  onSignUp?: (userId?: string) => unknown;
  emailRedirectTo: string;
}

export function EmailPasswordSignUpContainer({
  defaultValues,
  onSignUp,
  emailRedirectTo,
  displayTermsCheckbox,
}: EmailPasswordSignUpContainerProps) {
  const { captchaToken, resetCaptchaToken } = useCaptchaToken();

  const signUpMutation = useSignUpWithEmailAndPassword();
  const redirecting = useRef(false);
  const [showVerifyEmailAlert, setShowVerifyEmailAlert] = useState(false);

  const loading = signUpMutation.isPending || redirecting.current;

  const onSignupRequested = useCallback(
    async (credentials: { email: string; password: string }) => {
      if (loading) {
        return;
      }

      try {
        const data = await signUpMutation.mutateAsync({
          ...credentials,
          emailRedirectTo,
          captchaToken,
        });

        setShowVerifyEmailAlert(true);

        if (onSignUp) {
          onSignUp(data.user?.id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        resetCaptchaToken();
      }
    },
    [
      captchaToken,
      emailRedirectTo,
      loading,
      onSignUp,
      resetCaptchaToken,
      signUpMutation,
    ]
  );

  return (
    <>
      <If condition={showVerifyEmailAlert}>
        <SuccessAlert />
      </If>

      <If condition={!showVerifyEmailAlert}>
        <AuthErrorAlert error={signUpMutation.error} />

        <PasswordSignUpForm
          onSubmit={onSignupRequested}
          loading={loading}
          defaultValues={defaultValues}
          displayTermsCheckbox={displayTermsCheckbox}
        />
      </If>
    </>
  );
}

function SuccessAlert() {
  return (
    <Alert variant={'success'}>
      <CheckCircledIcon className={'w-4'} />

      <AlertTitle>メールを送信しました</AlertTitle>

      <AlertDescription data-test={'email-confirmation-alert'}>
        メールボックスをご確認ください。確認メールをクリックして登録を完了してください。
      </AlertDescription>
    </Alert>
  );
}
