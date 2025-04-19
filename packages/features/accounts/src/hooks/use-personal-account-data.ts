import { useCallback } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';

/**
 * フックで使用されるアカウントデータの型
 */
export interface PersonalAccountData {
  id: string;
  name: string | null;
  picture_url: string | null;
}

/**
 * ユーザーの個人アカウントデータを取得するフック
 * @param userId - ユーザーID
 * @param partialAccount - 部分的なアカウントデータ（オプション）
 * @returns アカウントデータを含むクエリ結果
 */
export function usePersonalAccountData(
  userId: string,
  partialAccount?: {
    id: string | null;
    name: string | null;
    picture_url: string | null;
  }
) {
  const client = useSupabase();
  const queryKey = ['account:data', userId];

  const queryFn = async (): Promise<PersonalAccountData> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const response = await client
      .from('profiles')
      .select(
        `
        id,
        full_name,
        avatar_url
    `
      )
      .eq('id', userId)
      .single();

    if (response.error) {
      throw response.error;
    }

    // プロファイルデータをアカウントデータの形式に変換
    return {
      id: response.data.id,
      name: response.data.full_name,
      picture_url: response.data.avatar_url,
    };
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    initialData: partialAccount?.id
      ? {
          id: partialAccount.id,
          name: partialAccount.name,
          picture_url: partialAccount.picture_url,
        }
      : undefined,
  });
}

export function useRevalidatePersonalAccountDataQuery() {
  const queryClient = useQueryClient();

  return useCallback(
    (userId: string) =>
      queryClient.invalidateQueries({
        queryKey: ['account:data', userId],
      }),
    [queryClient]
  );
}
