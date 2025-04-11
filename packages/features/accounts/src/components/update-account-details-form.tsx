import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { Database } from '@kit/supabase/database';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';

import { useUpdateAccountData } from '../hooks/use-update-account';
import { AccountDetailsSchema } from '../schema/account-details.schema';

type UpdateUserDataParams = Database['public']['Tables']['profiles']['Update'];

export function UpdateAccountDetailsForm({
  displayName,
  onUpdate,
  userId,
}: {
  displayName: string;
  userId: string;
  onUpdate: (user: Partial<UpdateUserDataParams>) => void;
}) {
  const updateAccountMutation = useUpdateAccountData(userId);

  const form = useForm({
    resolver: zodResolver(AccountDetailsSchema),
    defaultValues: {
      displayName,
    },
  });

  const onSubmit = ({ displayName }: { displayName: string }) => {
    const data = { full_name: displayName };

    const promise = updateAccountMutation.mutateAsync(data).then(() => {
      onUpdate(data);
    });

    return toast.promise(() => promise, {
      success: 'プロフィールを更新しました',
      error: 'プロフィールの更新に失敗しました',
      loading: 'プロフィールを更新中...',
    });
  };

  return (
    <div className={'flex flex-col space-y-8'}>
      <Form {...form}>
        <form
          data-test={'update-account-name-form'}
          className={'flex flex-col space-y-4'}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name={'displayName'}
            render={({ field }) => (
              <FormItem>
                <FormLabel>表示名</FormLabel>

                <FormControl>
                  <Input
                    data-test={'account-display-name'}
                    minLength={2}
                    placeholder={''}
                    maxLength={100}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button disabled={updateAccountMutation.isPending}>
              プロフィールを更新
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
