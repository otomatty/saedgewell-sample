import Link from 'next/link';

import type { AuthError } from '@supabase/supabase-js';

import { ResendAuthLinkForm } from '@kit/auth/resend-email-link';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';

import pathsConfig from '~/config/paths.config';
import { withI18n } from '~/lib/i18n/with-i18n';

interface AuthCallbackErrorPageProps {
  searchParams: Promise<{
    error: string;
    callback?: string;
    email?: string;
    code?: AuthError['code'];
  }>;
}

async function AuthCallbackErrorPage(props: AuthCallbackErrorPageProps) {
  const { callback, code } = await props.searchParams;
  const homePath = pathsConfig.app.home;
  const redirectPath = callback ?? pathsConfig.auth.callback;

  return (
    <div className={'flex flex-col space-y-4 py-4'}>
      <Alert variant={'destructive'}>
        <AlertTitle>認証エラー</AlertTitle>

        <AlertDescription>
          申し訳ありません。認証中にエラーが発生しました。もう一度お試しください。
        </AlertDescription>
      </Alert>

      <AuthCallbackForm
        code={code}
        homePath={homePath}
        redirectPath={redirectPath}
      />
    </div>
  );
}

function AuthCallbackForm(props: {
  homePath: string;
  redirectPath?: string;
  code?: AuthError['code'];
}) {
  switch (props.code) {
    case 'otp_expired':
      return <ResendAuthLinkForm redirectPath={props.redirectPath} />;
    default:
      return <HomeButton homePath={props.homePath} />;
  }
}

function HomeButton(props: { homePath: string }) {
  return (
    <Button className={'w-full'} asChild>
      <Link href={props.homePath}>トップページに戻る</Link>
    </Button>
  );
}

export default withI18n(AuthCallbackErrorPage);
