'use client';

import { useFormStatus } from 'react-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@kit/ui/alert-dialog';
import { Button } from '@kit/ui/button';
import { Form, FormControl, FormItem, FormLabel } from '@kit/ui/form';
import { Input } from '@kit/ui/input';

import { DeletePersonalAccountSchema } from '../schema/delete-personal-account.schema';
import { deletePersonalAccountAction } from '../server/server-actions';

export function AccountDangerZone() {
  return (
    <div className={'flex flex-col space-y-4'}>
      <div className={'flex flex-col space-y-1'}>
        <span className={'text-sm font-medium'}>アカウントの削除</span>

        <p className={'text-muted-foreground text-sm'}>
          アカウントを完全に削除します。この操作は取り消すことができません。
        </p>
      </div>

      <div>
        <DeleteAccountModal />
      </div>
    </div>
  );
}

function DeleteAccountModal() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button data-test={'delete-account-button'} variant={'destructive'}>
          アカウントを削除
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent onEscapeKeyDown={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>アカウントの削除</AlertDialogTitle>
        </AlertDialogHeader>

        <DeleteAccountForm />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteAccountForm() {
  const form = useForm({
    resolver: zodResolver(DeletePersonalAccountSchema),
    defaultValues: {
      confirmation: '' as 'DELETE',
    },
  });

  return (
    <Form {...form}>
      <form
        data-test={'delete-account-form'}
        action={deletePersonalAccountAction}
        className={'flex flex-col space-y-4'}
      >
        <div className={'flex flex-col space-y-6'}>
          <div
            className={'border-destructive text-destructive border p-4 text-sm'}
          >
            <div className={'flex flex-col space-y-2'}>
              <div>
                アカウントを削除すると、すべてのデータが完全に削除され、この操作は取り消すことができません。
              </div>

              <div>本当に削除してもよろしいですか？</div>
            </div>
          </div>

          <FormItem>
            <FormLabel>確認のため「DELETE」と入力してください</FormLabel>

            <FormControl>
              <Input
                autoComplete={'off'}
                data-test={'delete-account-input-field'}
                required
                name={'confirmation'}
                type={'text'}
                className={'w-full'}
                placeholder={'DELETE'}
                pattern={'DELETE'}
              />
            </FormControl>
          </FormItem>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>

          <DeleteAccountSubmitButton />
        </AlertDialogFooter>
      </form>
    </Form>
  );
}

function DeleteAccountSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      data-test={'confirm-delete-account-button'}
      type={'submit'}
      disabled={pending}
      name={'action'}
      variant={'destructive'}
    >
      {pending ? 'アカウントを削除中...' : 'アカウントを削除'}
    </Button>
  );
}
