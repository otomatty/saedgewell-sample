'use client';

import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { If } from '@kit/ui/if';
import { LanguageSelector } from '@kit/ui/language-selector';
import { LoadingOverlay } from '@kit/ui/loading-overlay';

import { usePersonalAccountData } from '../hooks/use-personal-account-data';
import { AccountDangerZone } from './account-danger-zone';
import { UpdateEmailFormContainer } from './email/update-email-form-container';
import { MultiFactorAuthFactorsList } from './mfa/multi-factor-auth-list';
import { UpdatePasswordFormContainer } from './password/update-password-container';
import { UpdateAccountDetailsFormContainer } from './update-account-details-form-container';
import { UpdateAccountImageContainer } from './update-account-image-container';

export function PersonalAccountSettingsContainer(
  props: React.PropsWithChildren<{
    userId: string;

    features: {
      enableAccountDeletion: boolean;
      enablePasswordUpdate: boolean;
    };

    paths: {
      callback: string;
    };
  }>
) {
  const supportsLanguageSelection = useSupportMultiLanguage();
  const user = usePersonalAccountData(props.userId);

  if (!user.data || user.isPending) {
    return <LoadingOverlay fullPage />;
  }

  return (
    <div className={'flex w-full flex-col space-y-4 pb-32'}>
      <Card>
        <CardHeader>
          <CardTitle>プロフィール画像</CardTitle>

          <CardDescription>プロフィール画像を変更できます</CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateAccountImageContainer
            user={{
              pictureUrl: user.data.picture_url,
              id: user.data.id,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>アカウント名</CardTitle>

          <CardDescription>
            アカウントに表示される名前を変更できます
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateAccountDetailsFormContainer user={user.data} />
        </CardContent>
      </Card>

      <If condition={supportsLanguageSelection}>
        <Card>
          <CardHeader>
            <CardTitle>言語設定</CardTitle>

            <CardDescription>表示言語を変更できます</CardDescription>
          </CardHeader>

          <CardContent>
            <LanguageSelector />
          </CardContent>
        </Card>
      </If>

      <Card>
        <CardHeader>
          <CardTitle>メールアドレスの変更</CardTitle>

          <CardDescription>
            アカウントに登録されているメールアドレスを変更できます
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpdateEmailFormContainer callbackPath={props.paths.callback} />
        </CardContent>
      </Card>

      <If condition={props.features.enablePasswordUpdate}>
        <Card>
          <CardHeader>
            <CardTitle>パスワードの変更</CardTitle>

            <CardDescription>
              アカウントのパスワードを変更できます
            </CardDescription>
          </CardHeader>

          <CardContent>
            <UpdatePasswordFormContainer callbackPath={props.paths.callback} />
          </CardContent>
        </Card>
      </If>

      <Card>
        <CardHeader>
          <CardTitle>二段階認証</CardTitle>

          <CardDescription>
            アカウントのセキュリティを強化するため、二段階認証を設定できます
          </CardDescription>
        </CardHeader>

        <CardContent>
          <MultiFactorAuthFactorsList userId={props.userId} />
        </CardContent>
      </Card>

      <If condition={props.features.enableAccountDeletion}>
        <Card className={'border-destructive'}>
          <CardHeader>
            <CardTitle>危険な操作</CardTitle>

            <CardDescription>
              アカウントの削除など、取り消しできない操作を行えます
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AccountDangerZone />
          </CardContent>
        </Card>
      </If>
    </div>
  );
}

function useSupportMultiLanguage() {
  const { i18n } = useTranslation();
  const langs = (i18n?.options?.supportedLngs as string[]) ?? [];

  const supportedLangs = langs.filter((lang) => lang !== 'cimode');

  return supportedLangs.length > 1;
}
