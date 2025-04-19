'use client';

import { useCallback } from 'react';

import type { z } from 'zod';

import { useSignInWithEmailPassword } from '@kit/supabase/hooks/use-sign-in-with-email-password';

import { useCaptchaToken } from '../captcha/client';
import type { PasswordSignInSchema } from '../schemas/password-sign-in.schema';
import { AuthErrorAlert } from './auth-error-alert';
import { PasswordSignInForm } from './password-sign-in-form';

/**
 * @name PasswordSignInContainer
 * @description
 * メールアドレスとパスワードを使用したサインインのコンテナコンポーネント。
 * Supabaseの認証機能と連携し、実際のサインイン処理を行う。
 *
 * @features
 * - CAPTCHAトークンの管理
 * - Supabaseを使用したメール/パスワード認証
 * - エラー表示
 * - サインイン成功時のコールバック処理
 *
 * @dependencies
 * - @kit/supabase/hooks/use-sign-in-with-email-password: Supabaseサインインフック
 * - ../captcha/client: CAPTCHAトークン管理
 *
 * @childComponents
 * - AuthErrorAlert: エラー表示コンポーネント
 * - PasswordSignInForm: サインインフォームコンポーネント
 *
 * @param {Object} props
 * @param {Function} [props.onSignIn] - サインイン成功時のコールバック関数
 *
 * @example
 * ```tsx
 * <PasswordSignInContainer onSignIn={(userId) => router.push('/dashboard')} />
 * ```
 */
export function PasswordSignInContainer({
  onSignIn,
}: {
  onSignIn?: (userId?: string) => unknown;
}) {
  const { captchaToken, resetCaptchaToken } = useCaptchaToken();
  const signInMutation = useSignInWithEmailPassword();
  const isLoading = signInMutation.isPending;

  const onSubmit = useCallback(
    async (credentials: z.infer<typeof PasswordSignInSchema>) => {
      try {
        const data = await signInMutation.mutateAsync({
          ...credentials,
          options: { captchaToken },
        });

        if (onSignIn) {
          const userId = data?.user?.id;

          onSignIn(userId);
        }
      } catch {
        // wrong credentials, do nothing
      } finally {
        resetCaptchaToken();
      }
    },
    [captchaToken, onSignIn, resetCaptchaToken, signInMutation]
  );

  return (
    <>
      <AuthErrorAlert error={signInMutation.error} />

      <PasswordSignInForm onSubmit={onSubmit} loading={isLoading} />
    </>
  );
}
