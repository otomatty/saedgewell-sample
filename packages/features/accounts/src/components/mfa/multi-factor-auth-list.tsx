'use client';

import { useCallback, useState } from 'react';

import type { Factor } from '@supabase/supabase-js';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useFetchAuthFactors } from '@kit/supabase/hooks/use-fetch-mfa-factors';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { useFactorsMutationKey } from '@kit/supabase/hooks/use-user-factors-mutation-key';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@kit/ui/alert-dialog';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { If } from '@kit/ui/if';
import { Spinner } from '@kit/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@kit/ui/tooltip';

import { MultiFactorAuthSetupDialog } from './multi-factor-auth-setup-dialog';

export function MultiFactorAuthFactorsList(props: { userId: string }) {
  return (
    <div className={'flex flex-col space-y-4'}>
      <FactorsTableContainer userId={props.userId} />

      <div>
        <MultiFactorAuthSetupDialog userId={props.userId} />
      </div>
    </div>
  );
}

function FactorsTableContainer(props: { userId: string }) {
  const {
    data: factors,
    isLoading,
    isError,
  } = useFetchAuthFactors(props.userId);

  if (isLoading) {
    return (
      <div className={'flex items-center space-x-4'}>
        <Spinner />

        <div>二段階認証の設定を読み込み中...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Alert variant={'destructive'}>
          <ExclamationTriangleIcon className={'h-4'} />

          <AlertTitle>二段階認証の設定に失敗しました</AlertTitle>

          <AlertDescription>
            設定の読み込み中にエラーが発生しました。もう一度お試しください。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const allFactors = factors?.all ?? [];

  if (!allFactors.length) {
    return (
      <div className={'flex flex-col space-y-4'}>
        <Alert>
          <ShieldCheck className={'h-4'} />

          <AlertTitle>二段階認証を設定</AlertTitle>

          <AlertDescription>
            アカウントのセキュリティを強化するため、二段階認証を設定することをお勧めします。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <FactorsTable factors={allFactors} userId={props.userId} />;
}

function ConfirmUnenrollFactorModal(
  props: React.PropsWithChildren<{
    factorId: string;
    userId: string;
    setIsModalOpen: (isOpen: boolean) => void;
  }>
) {
  const { t } = useTranslation();
  const unEnroll = useUnenrollFactor(props.userId);

  const onUnenrollRequested = useCallback(
    (factorId: string) => {
      if (unEnroll.isPending) return;

      const promise = unEnroll.mutateAsync(factorId).then((response) => {
        props.setIsModalOpen(false);

        if (!response.success) {
          const errorCode = response.data;

          throw t(`auth:errors.${errorCode}`, {
            defaultValue: t('account:unenrollFactorError'),
          });
        }
      });

      toast.promise(promise, {
        loading: t('account:unenrollingFactor'),
        success: t('account:unenrollFactorSuccess'),
        error: (error: string) => {
          return error;
        },
      });
    },
    [props, t, unEnroll]
  );

  return (
    <AlertDialog open={!!props.factorId} onOpenChange={props.setIsModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>認証方法の削除</AlertDialogTitle>

          <AlertDialogDescription>
            この認証方法を削除してもよろしいですか？
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>

          <AlertDialogAction
            type={'button'}
            disabled={unEnroll.isPending}
            onClick={() => onUnenrollRequested(props.factorId)}
          >
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function FactorsTable({
  factors,
  userId,
}: React.PropsWithChildren<{
  factors: Factor[];
  userId: string;
}>) {
  const [unEnrolling, setUnenrolling] = useState<string>();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>認証方法名</TableHead>
            <TableHead>種類</TableHead>
            <TableHead>状態</TableHead>

            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {factors.map((factor) => (
            <TableRow key={factor.id}>
              <TableCell>
                <span className={'block truncate'}>{factor.friendly_name}</span>
              </TableCell>

              <TableCell>
                <Badge variant={'info'} className={'inline-flex uppercase'}>
                  {factor.factor_type}
                </Badge>
              </TableCell>

              <td>
                <Badge
                  className={'inline-flex capitalize'}
                  variant={factor.status === 'verified' ? 'success' : 'outline'}
                >
                  {factor.status}
                </Badge>
              </td>

              <td className={'flex justify-end'}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={'ghost'}
                        size={'icon'}
                        onClick={() => setUnenrolling(factor.id)}
                      >
                        <X className={'h-4'} />
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>認証方法を削除</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <If condition={unEnrolling}>
        {(factorId) => (
          <ConfirmUnenrollFactorModal
            userId={userId}
            factorId={factorId}
            setIsModalOpen={() => setUnenrolling(undefined)}
          />
        )}
      </If>
    </>
  );
}

function useUnenrollFactor(userId: string) {
  const queryClient = useQueryClient();
  const client = useSupabase();
  const mutationKey = useFactorsMutationKey(userId);

  const mutationFn = async (factorId: string) => {
    const { data, error } = await client.auth.mfa.unenroll({
      factorId,
    });

    if (error) {
      return {
        success: false as const,
        data: error.code as string,
      };
    }

    return {
      success: true as const,
      data,
    };
  };

  return useMutation({
    mutationFn,
    mutationKey,
    onSuccess: () => {
      return queryClient.refetchQueries({
        queryKey: mutationKey,
      });
    },
  });
}
