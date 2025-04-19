'use client';

import { useCallback } from 'react';

import type { SupabaseClient } from '@supabase/supabase-js';

import { toast } from 'sonner';

import type { Database } from '@kit/supabase/database';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { ImageUploader } from '@kit/ui/image-uploader';

import { useRevalidatePersonalAccountDataQuery } from '../hooks/use-personal-account-data';

const AVATARS_BUCKET = 'account_image';

export function UpdateAccountImageContainer({
  user,
}: {
  user: {
    pictureUrl: string | null;
    id: string;
  };
}) {
  const revalidateUserDataQuery = useRevalidatePersonalAccountDataQuery();

  return (
    <UploadProfileAvatarForm
      pictureUrl={user.pictureUrl ?? null}
      userId={user.id}
      onAvatarUpdated={() => revalidateUserDataQuery(user.id)}
    />
  );
}

function UploadProfileAvatarForm(props: {
  pictureUrl: string | null;
  userId: string;
  onAvatarUpdated: () => void;
}) {
  const client = useSupabase();

  const createToaster = useCallback((promise: () => Promise<unknown>) => {
    return toast.promise(promise, {
      success: 'プロフィール画像を更新しました',
      error: 'プロフィール画像の更新に失敗しました',
      loading: 'プロフィール画像を更新中...',
    });
  }, []);

  const onValueChange = useCallback(
    (file: File | null) => {
      const removeExistingStorageFile = () => {
        if (props.pictureUrl) {
          return (
            deleteProfilePhoto(
              client as unknown as SupabaseClient<Database>,
              props.pictureUrl
            ) ?? Promise.resolve()
          );
        }

        return Promise.resolve();
      };

      if (file) {
        const promise = () =>
          removeExistingStorageFile().then(() =>
            uploadUserProfilePhoto(
              client as unknown as SupabaseClient<Database>,
              file,
              props.userId
            )
              .then((pictureUrl) => {
                return client
                  .from('profiles')
                  .update({
                    avatar_url: pictureUrl,
                  })
                  .eq('id', props.userId)
                  .throwOnError();
              })
              .then(() => {
                props.onAvatarUpdated();
              })
          );

        createToaster(promise);
      } else {
        const promise = () =>
          removeExistingStorageFile()
            .then(() => {
              return client
                .from('profiles')
                .update({
                  avatar_url: null,
                })
                .eq('id', props.userId)
                .throwOnError();
            })
            .then(() => {
              props.onAvatarUpdated();
            });

        createToaster(promise);
      }
    },
    [client, createToaster, props]
  );

  return (
    <ImageUploader value={props.pictureUrl} onValueChange={onValueChange}>
      <div className={'flex flex-col space-y-1'}>
        <span className={'text-sm'}>プロフィール画像</span>

        <span className={'text-xs'}>
          プロフィール画像をアップロードまたは変更できます
        </span>
      </div>
    </ImageUploader>
  );
}

function deleteProfilePhoto(client: SupabaseClient<Database>, url: string) {
  const bucket = client.storage.from(AVATARS_BUCKET);
  const fileName = url.split('/').pop()?.split('?')[0];

  if (!fileName) {
    return;
  }

  return bucket.remove([fileName]);
}

async function uploadUserProfilePhoto(
  client: SupabaseClient<Database>,
  photoFile: File,
  userId: string
) {
  const bytes = await photoFile.arrayBuffer();
  const bucket = client.storage.from(AVATARS_BUCKET);
  const extension = photoFile.name.split('.').pop();
  const fileName = await getAvatarFileName(userId, extension);

  const result = await bucket.upload(fileName, bytes);

  if (!result.error) {
    return bucket.getPublicUrl(fileName).data.publicUrl;
  }

  throw result.error;
}

async function getAvatarFileName(
  userId: string,
  extension: string | undefined
) {
  const { nanoid } = await import('nanoid');

  // we add a version to the URL to ensure
  // the browser always fetches the latest image
  const uniqueId = nanoid(16);

  return `${userId}.${extension}?v=${uniqueId}`;
}
