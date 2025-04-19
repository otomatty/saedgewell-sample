'use client';

import type { User } from '@supabase/supabase-js';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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
import { If } from '@kit/ui/if';
import { Input } from '@kit/ui/input';

import { UpdateEmailSchema } from '../../schema/update-email.schema';

type UpdateEmailFormProps = {
  user: User;
  callbackPath: string;
};

type EmailFormData = {
  email: string;
  repeatEmail: string;
};

function createEmailResolver(currentEmail: string, errorMessage: string) {
  return zodResolver(
    UpdateEmailSchema.withTranslation(errorMessage).refine((schema) => {
      return schema.email !== currentEmail;
    })
  );
}

function useEmailFormWithValidation(email: string, errorMessage: string) {
  return useForm<EmailFormData>({
    resolver: createEmailResolver(email, errorMessage),
    defaultValues: {
      email: '',
      repeatEmail: '',
    },
  });
}

export function UpdateEmailForm({ user, callbackPath }: UpdateEmailFormProps) {
  const { t } = useTranslation('account');
  const updateUserMutation = useUpdateUser();

  if (!user.email) {
    return (
      <Alert variant="warning">
        <AlertTitle>メールアドレスが設定されていません</AlertTitle>
        <AlertDescription>
          アカウントにメールアドレスが設定されていません。設定を行ってください。
        </AlertDescription>
      </Alert>
    );
  }

  const form = useEmailFormWithValidation(user.email, t('emailNotMatching'));

  const updateEmail = ({ email }: EmailFormData) => {
    const promise = async () => {
      const redirectTo = new URL(
        callbackPath,
        window.location.origin
      ).toString();

      await updateUserMutation.mutateAsync({ email, redirectTo });
    };

    toast.promise(promise, {
      success: 'メールアドレスを更新しました',
      loading: 'メールアドレスを更新中...',
      error: 'メールアドレスの更新に失敗しました',
    });
  };

  return (
    <Form {...form}>
      <form
        className={'flex flex-col space-y-4'}
        data-test={'account-email-form'}
        onSubmit={form.handleSubmit(updateEmail)}
      >
        <If condition={updateUserMutation.data}>
          <Alert variant={'success'}>
            <CheckIcon className={'h-4'} />

            <AlertTitle>メールアドレスを更新しました</AlertTitle>

            <AlertDescription>
              新しいメールアドレスに確認メールを送信しました。メールを確認して更新を完了してください。
            </AlertDescription>
          </Alert>
        </If>

        <div className={'flex flex-col space-y-4'}>
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>新しいメールアドレス</FormLabel>

                <FormControl>
                  <Input
                    data-test={'account-email-form-email-input'}
                    required
                    type={'email'}
                    placeholder={''}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
            name={'email'}
          />

          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレスの確認</FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    data-test={'account-email-form-repeat-email-input'}
                    required
                    type={'email'}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
            name={'repeatEmail'}
          />

          <div>
            <Button disabled={updateUserMutation.isPending}>
              メールアドレスを更新
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
